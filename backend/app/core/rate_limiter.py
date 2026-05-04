"""
app.core.rate_limiter — Redis-backed sliding window rate limiter.

Uses a sorted set per (user, endpoint) key where scores are timestamps.
On each request, expired entries are trimmed and the current count is
checked against the limit. This gives a true sliding window rather than
the simpler fixed-window approach.

Falls back to allowing requests if Redis is unavailable (fail-open).
"""

import time
import logging
from typing import Optional

from fastapi import Request, HTTPException, status

logger = logging.getLogger("rate_limiter")


class RateLimiter:
    """
    Sliding window rate limiter backed by Redis sorted sets.

    Args:
        redis: aioredis client instance
        max_requests: maximum requests allowed in the window
        window_seconds: window duration in seconds
        key_prefix: Redis key namespace
    """

    def __init__(
        self,
        redis,
        max_requests: int = 100,
        window_seconds: int = 60,
        key_prefix: str = "rate",
    ):
        self.redis = redis
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.key_prefix = key_prefix

    def _make_key(self, identifier: str, endpoint: str) -> str:
        """Build a namespaced Redis key."""
        # Normalize endpoint: /api/v1/copilot/suggest → copilot_suggest
        clean_ep = endpoint.strip("/").replace("/", "_")
        return f"{self.key_prefix}:{identifier}:{clean_ep}"

    async def check(self, identifier: str, endpoint: str) -> bool:
        """
        Check if the request is within the rate limit.

        Returns True if allowed, raises HTTPException(429) if exceeded.
        Falls back to True if Redis is unavailable.
        """
        if not self.redis:
            return True

        key = self._make_key(identifier, endpoint)
        now = time.time()
        window_start = now - self.window_seconds

        try:
            pipe = self.redis.pipeline()
            # Remove entries outside the current window
            pipe.zremrangebyscore(key, 0, window_start)
            # Count entries in the current window
            pipe.zcard(key)
            # Add the current request
            pipe.zadd(key, {str(now): now})
            # Set TTL so keys don't linger forever
            pipe.expire(key, self.window_seconds + 10)
            results = await pipe.execute()

            current_count = results[1]

            if current_count >= self.max_requests:
                retry_after = int(self.window_seconds - (now - window_start))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Rate limit exceeded. Max {self.max_requests} requests per {self.window_seconds}s.",
                    headers={"Retry-After": str(max(1, retry_after))},
                )

            return True

        except HTTPException:
            raise
        except Exception as e:
            # Fail-open: if Redis is down, don't block requests
            logger.warning("Rate limiter Redis error (failing open): %s", e)
            return True


# Pre-configured limiters for different endpoint tiers
def create_default_limiter(redis) -> RateLimiter:
    """Standard API rate limit: 100 req/min."""
    return RateLimiter(redis, max_requests=100, window_seconds=60)


def create_ai_limiter(redis) -> RateLimiter:
    """AI endpoint rate limit: 10 req/min (expensive operations)."""
    return RateLimiter(redis, max_requests=10, window_seconds=60, key_prefix="rate_ai")


def create_auth_limiter(redis) -> RateLimiter:
    """Auth endpoint rate limit: 5 req/min (brute-force protection)."""
    return RateLimiter(redis, max_requests=5, window_seconds=60, key_prefix="rate_auth")
