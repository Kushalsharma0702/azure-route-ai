"""
app.cache.redis_client — Async Redis connection pool and helpers.

Uses a single connection pool shared across the application. The pool
is created lazily on first use and closed during app shutdown.

All operations fail-open: if Redis is unavailable, methods return None
instead of raising exceptions. This ensures the application degrades
gracefully rather than crashing.
"""

import json
import logging
from typing import Optional, Any

import redis.asyncio as aioredis

from app.core import settings

logger = logging.getLogger("redis_client")

# Module-level pool reference (initialized in get_redis / app lifespan)
_redis_pool: Optional[aioredis.Redis] = None


async def get_redis() -> Optional[aioredis.Redis]:
    """
    Get or create the Redis connection pool.

    Returns None if Redis is not configured or connection fails.
    """
    global _redis_pool

    if _redis_pool is not None:
        return _redis_pool

    try:
        _redis_pool = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=20,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
        )
        # Verify connectivity
        await _redis_pool.ping()
        logger.info("Redis connected: %s", settings.REDIS_URL)
        return _redis_pool
    except Exception as e:
        logger.warning("Redis connection failed (app will work without cache): %s", e)
        _redis_pool = None
        return None


async def close_redis():
    """Close the Redis connection pool during shutdown."""
    global _redis_pool
    if _redis_pool:
        await _redis_pool.close()
        _redis_pool = None
        logger.info("Redis connection closed")


# ── Convenience Helpers ───────────────────────────────────────

async def cache_get(key: str) -> Optional[Any]:
    """Get a cached value (JSON-deserialized). Returns None on miss or error."""
    r = await get_redis()
    if not r:
        return None
    try:
        raw = await r.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception as e:
        logger.warning("cache_get error for key=%s: %s", key, e)
        return None


async def cache_set(key: str, value: Any, ttl_seconds: int = 300) -> bool:
    """Set a cached value (JSON-serialized) with TTL. Returns True on success."""
    r = await get_redis()
    if not r:
        return False
    try:
        serialized = json.dumps(value, default=str)
        await r.set(key, serialized, ex=ttl_seconds)
        return True
    except Exception as e:
        logger.warning("cache_set error for key=%s: %s", key, e)
        return False


async def cache_delete(key: str) -> bool:
    """Delete a cached key. Returns True if the key existed."""
    r = await get_redis()
    if not r:
        return False
    try:
        result = await r.delete(key)
        return result > 0
    except Exception as e:
        logger.warning("cache_delete error for key=%s: %s", key, e)
        return False


async def cache_delete_pattern(pattern: str) -> int:
    """
    Delete all keys matching a glob pattern.

    WARNING: Uses SCAN (not KEYS) to avoid blocking Redis.
    Returns the count of deleted keys.
    """
    r = await get_redis()
    if not r:
        return 0
    try:
        deleted = 0
        async for key in r.scan_iter(match=pattern, count=100):
            await r.delete(key)
            deleted += 1
        return deleted
    except Exception as e:
        logger.warning("cache_delete_pattern error for pattern=%s: %s", pattern, e)
        return 0
