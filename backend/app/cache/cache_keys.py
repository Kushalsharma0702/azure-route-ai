"""
app.cache.cache_keys — Centralized Redis key patterns.

All cache keys are defined here to:
1. Prevent typos and key collisions
2. Make it easy to audit what's cached
3. Centralize TTL decisions

Key naming convention: {domain}:{entity}:{identifier}
"""


class CacheKeys:
    """Static key builders and TTL constants."""

    # ── TTLs (seconds) ────────────────────────────────────────
    TTL_TRAVEL = 900          # 15 minutes — train/flight data
    TTL_AI_RESPONSE = 300     # 5 minutes — AI responses (short to stay fresh)
    TTL_PLACES = 3600         # 1 hour — place listings
    TTL_USER_PROFILE = 600    # 10 minutes — user profile
    TTL_RATE_LIMIT = 60       # 1 minute — rate limit window

    # ── Key Builders ──────────────────────────────────────────

    @staticmethod
    def travel_route(transport_type: str, source: str, destination: str) -> str:
        """Cache key for travel route data."""
        return f"travel:{transport_type}:{source.lower()}:{destination.lower()}"

    @staticmethod
    def ai_copilot(payload_hash: str) -> str:
        """Cache key for AI copilot responses."""
        return f"ai:copilot:{payload_hash}"

    @staticmethod
    def places_category(category: str) -> str:
        """Cache key for places by category."""
        return f"places:category:{category.lower()}"

    @staticmethod
    def places_nearby(lat: float, lng: float, radius: float) -> str:
        """Cache key for nearby places (rounded coords for cache hits)."""
        # Round to 3 decimal places (~111m precision) to increase cache hits
        lat_r = round(lat, 3)
        lng_r = round(lng, 3)
        return f"places:nearby:{lat_r}:{lng_r}:{radius}"

    @staticmethod
    def user_profile(user_id: str) -> str:
        """Cache key for user profile data."""
        return f"user:profile:{user_id}"

    @staticmethod
    def rate_limit(user_id: str, endpoint: str) -> str:
        """Cache key for rate limit counter."""
        clean_ep = endpoint.strip("/").replace("/", "_")
        return f"rate:api:{user_id}:{clean_ep}"

    # ── Invalidation Patterns ─────────────────────────────────

    @staticmethod
    def travel_all_pattern() -> str:
        """Pattern to invalidate all travel cache."""
        return "travel:*"

    @staticmethod
    def user_all_pattern(user_id: str) -> str:
        """Pattern to invalidate all user-related cache."""
        return f"user:*:{user_id}*"

    @staticmethod
    def ai_all_pattern() -> str:
        """Pattern to invalidate all AI response cache."""
        return "ai:*"
