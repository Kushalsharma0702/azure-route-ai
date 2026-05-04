"""
app.services.hidden_gems_service — Hidden gems discovery business logic.
Orchestrates: DB → Reddit → AI → Fallback
"""
import logging
from typing import Dict, Any, List, Optional
from app.ai.llm_adapter import LLMAdapter
from app.ai.prompt_templates import PromptTemplates
from app.ai.fallback import FallbackEngine
from app.integrations.reddit_client import RedditClient
from app.cache.decorators import cached
from app.core import settings

logger = logging.getLogger("hidden_gems_service")


class HiddenGemsService:
    @classmethod
    async def discover(cls, location: Optional[Dict] = None, location_name: Optional[str] = None, radius_km: int = 10, source: str = "local", categories: Optional[List[str]] = None) -> Dict[str, Any]:
        source = source.lower()

        if source == "reddit" and location_name:
            gems = await RedditClient.search_hidden_gems(location_name)
            if gems:
                return {"gems": gems, "source": "reddit", "total": len(gems)}

        if source == "ai" and location_name and settings.USE_LLM:
            prompt = PromptTemplates.hidden_gems(location_name, categories)
            llm_resp = await LLMAdapter.call(prompt)
            if not llm_resp.is_error:
                # Try to parse JSON array from LLM response
                import json
                try:
                    gems_data = json.loads(llm_resp.text)
                    if isinstance(gems_data, list):
                        gems = [{"id": f"ai_{i}", "name": g.get("name", ""), "category": g.get("category", ""), "location": {"lat": 0, "lng": 0}, "reason": g.get("reason", ""), "source": "ai"} for i, g in enumerate(gems_data, 1)]
                        return {"gems": gems, "source": "ai", "total": len(gems)}
                except json.JSONDecodeError:
                    pass
                # If JSON parse fails, return raw text as single gem
                return {"gems": [{"id": "ai_1", "name": "AI Recommendations", "category": "mixed", "location": {"lat": 0, "lng": 0}, "reason": llm_resp.text[:500], "source": "ai"}], "source": "ai", "total": 1}

        # Fallback
        name = location_name or "your area"
        gems = FallbackEngine.hidden_gems_local(name)
        return {"gems": gems, "source": "fallback", "total": len(gems)}
