"""
app.cache.decorators — Caching decorator for service methods.

Provides a @cached decorator that:
1. Builds a cache key from function arguments
2. Checks Redis for a cached result
3. Returns cached data on hit, or calls the function and caches the result on miss
4. Falls back to the original function if Redis is unavailable
"""

import hashlib
import json
import functools
import logging
from typing import Optional, Callable

from app.cache.redis_client import cache_get, cache_set

logger = logging.getLogger("cache_decorator")


def cached(
    key_prefix: str,
    ttl_seconds: int = 300,
    key_builder: Optional[Callable] = None,
):
    """
    Caching decorator for async functions.

    Args:
        key_prefix: Cache key namespace (e.g., "copilot", "travel")
        ttl_seconds: Time-to-live in seconds
        key_builder: Optional function(args, kwargs) -> str to build custom keys.
                     If None, a hash of all arguments is used.

    Usage:
        @cached(key_prefix="copilot", ttl_seconds=300)
        async def get_suggestion(payload: dict) -> dict:
            ...
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key
            if key_builder:
                cache_key = f"{key_prefix}:{key_builder(*args, **kwargs)}"
            else:
                # Default: hash all arguments
                key_data = json.dumps(
                    {"args": [str(a) for a in args], "kwargs": kwargs},
                    sort_keys=True,
                    default=str,
                )
                key_hash = hashlib.md5(key_data.encode()).hexdigest()[:16]
                cache_key = f"{key_prefix}:{key_hash}"

            # Try cache
            cached_result = await cache_get(cache_key)
            if cached_result is not None:
                logger.debug("Cache HIT: %s", cache_key)
                return cached_result

            # Cache miss — call the original function
            logger.debug("Cache MISS: %s", cache_key)
            result = await func(*args, **kwargs)

            # Store result in cache (fire-and-forget, don't block on cache errors)
            if result is not None:
                await cache_set(cache_key, result, ttl_seconds=ttl_seconds)

            return result

        return wrapper
    return decorator
