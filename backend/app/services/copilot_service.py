"""
app.services.copilot_service — AI copilot business logic.

Flow: prompt template → LLM adapter → fallback engine → cache result
"""
import hashlib, json, logging
from typing import Dict, Any

from app.ai.llm_adapter import LLMAdapter
from app.ai.prompt_templates import PromptTemplates, PROMPT_VERSION
from app.ai.fallback import FallbackEngine
from app.cache.redis_client import cache_get, cache_set
from app.cache.cache_keys import CacheKeys
from app.core import settings

logger = logging.getLogger("copilot_service")


class CopilotService:
    @classmethod
    async def get_suggestion(cls, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Build cache key from payload hash + prompt version
        key_data = json.dumps(payload, sort_keys=True, default=str)
        payload_hash = hashlib.md5(f"{PROMPT_VERSION}:{key_data}".encode()).hexdigest()[:16]
        cache_key = CacheKeys.ai_copilot(payload_hash)

        cached = await cache_get(cache_key)
        if cached:
            logger.info("Copilot cache HIT")
            return {**cached, "cached": True}

        if settings.USE_LLM:
            prompt = PromptTemplates.copilot_suggestion(payload)
            llm_response = await LLMAdapter.call(prompt)
            if not llm_response.is_error:
                result = {
                    "suggestion": llm_response.text,
                    "reason": f"AI-generated using {llm_response.provider}/{llm_response.model}",
                    "mode": "llm",
                    "provider": llm_response.provider,
                }
                await cache_set(cache_key, result, ttl_seconds=CacheKeys.TTL_AI_RESPONSE)
                return result

        # Fallback
        result = FallbackEngine.copilot_suggestion(payload)
        return result

    @classmethod
    async def generate_itinerary(cls, destination: str, days: int, preferences: dict = None, budget: str = None) -> Dict[str, Any]:
        if settings.USE_LLM:
            prompt = PromptTemplates.itinerary_generation(destination, days, preferences, budget)
            llm_response = await LLMAdapter.call(prompt, max_tokens=1000)
            if not llm_response.is_error:
                return {"destination": destination, "days": days, "itinerary": llm_response.text, "mode": "llm"}

        return {
            "destination": destination, "days": days,
            "itinerary": f"# {days}-Day Trip to {destination}\n\nPlease try again later — AI is temporarily unavailable.",
            "mode": "fallback",
        }
