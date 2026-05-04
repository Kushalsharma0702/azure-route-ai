"""
app.integrations.reddit_client — Reddit hidden gems scraper.
Uses the public Reddit JSON API (no OAuth required).
"""
import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger("reddit_client")


class RedditClient:
    """Reddit public API client for hidden gems discovery."""

    BASE_URL = "https://www.reddit.com"
    HEADERS = {"User-Agent": "routeaura-ai/2.0 (travel assistant)"}
    TIMEOUT = 10.0

    @classmethod
    async def search_hidden_gems(cls, location_name: str, limit: int = 8) -> List[Dict[str, Any]]:
        """Search Reddit for hidden gems near a location."""
        query = f"hidden gems {location_name}"
        params = {
            "q": query, "limit": limit,
            "sort": "relevance", "t": "year", "type": "link",
        }
        try:
            async with httpx.AsyncClient(timeout=cls.TIMEOUT) as client:
                response = await client.get(
                    f"{cls.BASE_URL}/search.json",
                    params=params, headers=cls.HEADERS,
                )
            if response.status_code != 200:
                logger.warning("Reddit API error: %d", response.status_code)
                return []

            payload = response.json()
            children = payload.get("data", {}).get("children", [])
            gems = []
            for idx, item in enumerate(children, start=1):
                data = item.get("data", {})
                title = data.get("title") or "Local tip"
                snippet = data.get("selftext") or "Shared by locals on Reddit."
                gems.append({
                    "id": f"reddit_{idx}",
                    "name": title[:100],
                    "category": "local_tip",
                    "location": {"lat": 0, "lng": 0},
                    "reason": snippet[:300] or "Shared by locals on Reddit.",
                    "source": "reddit",
                })
            return gems
        except Exception as e:
            logger.warning("Reddit search failed: %s", e)
            return []
