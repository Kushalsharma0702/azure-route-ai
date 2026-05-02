import random
import asyncio
import os
import logging
from datetime import datetime, timedelta
import httpx

logger = logging.getLogger("ai_engine")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO)

class LiveStatusEngine:
    _cache = {}
    _ttl = timedelta(seconds=30)

    @classmethod
    async def _simulate(cls, place_id: int):
        # Simulate metrics
        levels = ["Low", "Medium", "High"]
        crowd = random.choices(levels, weights=[50,30,20])[0]
        noise = random.choices(levels, weights=[40,40,20])[0]
        waiting_time = random.randint(0, 45)
        return {
            "place_id": place_id,
            "crowd": crowd,
            "noise": noise,
            "waiting_time": waiting_time,
            "timestamp": datetime.utcnow().isoformat()
        }

    @classmethod
    async def get_status(cls, place_id: int, force_refresh: bool = False):
        now = datetime.utcnow()
        cached = cls._cache.get(place_id)
        if cached and not force_refresh:
            value, ts = cached
            if now - ts < cls._ttl:
                return {**value, "source": "cache"}
        value = await cls._simulate(place_id)
        cls._cache[place_id] = (value, now)
        return {**value, "source": "live"}

class HiddenGemsEngine:
    @classmethod
    async def find_gems(cls, params: dict):
        location = params.get("location") or {"lat": 0, "lng": 0}
        location_name = params.get("location_name")
        source = (params.get("source") or "local").lower()

        if location_name and source == "reddit":
            reddit_gems = await cls._fetch_reddit_gems(location_name)
            if reddit_gems:
                return {"gems": reddit_gems, "source": "reddit"}

        gems = []
        for i in range(1, 4):
            gems.append({
                "id": f"gem_{i}",
                "name": f"Local Hidden Spot {i}",
                "category": "local_cafe" if i % 2 == 0 else "park",
                "location": {
                    "lat": location.get("lat", 0) + i * 0.001,
                    "lng": location.get("lng", 0) - i * 0.001,
                },
                "reason": "Most tourists miss this because it requires a short walk from the main square and is not listed on popular aggregator sites.",
            })
        return {"gems": gems, "source": "local"}

    @staticmethod
    async def _fetch_reddit_gems(location_name: str):
        query = f"hidden gems {location_name}"
        url = "https://www.reddit.com/search.json"
        headers = {"User-Agent": "routeaura-ai/1.0"}
        params = {
            "q": query,
            "limit": 8,
            "sort": "relevance",
            "t": "year",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params, headers=headers)
            if response.status_code != 200:
                return []
            payload = response.json()
            children = payload.get("data", {}).get("children", [])
            gems = []
            for idx, item in enumerate(children, start=1):
                data = item.get("data", {})
                title = data.get("title") or "Local tip"
                snippet = data.get("selftext") or data.get("selftext_html") or "Shared by locals on Reddit."
                gems.append({
                    "id": f"reddit_{idx}",
                    "name": title[:80],
                    "category": "local_tip",
                    "location": {"lat": 0, "lng": 0},
                    "reason": snippet[:240] or "Shared by locals on Reddit.",
                })
            return gems
        except Exception:
            return []

class SimpleAI:
    @staticmethod
    async def copilot_rule_based(input_data: dict):
        # Very small rule-based engine
        prefs = input_data.get("preferences", {}) or {}
        weather = input_data.get("weather") or {}
        time = input_data.get("time")
        suggestions = []
        reason_parts = []
        if weather.get("type") == "rain" or weather.get("precip_prob",0) > 0.5:
            suggestions.append("Visit indoor cafes and museums")
            reason_parts.append("Rain expected in your area")
        if prefs.get("travel_style") == "adventure":
            suggestions.append("Try the nearby hill trail")
            reason_parts.append("You prefer adventure activities")
        if not suggestions:
            suggestions.append("Explore the local market and popular landmarks")
            reason_parts.append("Good weather and central location")
        return {"suggestions": suggestions, "reason": "; ".join(reason_parts)}

class LLMAdapter:
    @staticmethod
    async def call_llm(prompt: str):
        api_key = os.getenv("MISTRAL_API_KEY")
        if not api_key:
            return {"error": "MISTRAL_API_KEY not set", "provider": "mistral"}

        try:
            from mistralai import Mistral
        except Exception as exc:
            return {"error": f"mistralai not installed: {exc}", "provider": "mistral"}

        client = Mistral(api_key=api_key)
        model = os.getenv("MISTRAL_MODEL", "mistral-small")
        # Allow overriding temperature and max tokens via env
        temperature = float(os.getenv("LLM_TEMPERATURE", "0.7"))
        max_tokens = int(os.getenv("LLM_MAX_TOKENS", "300"))

        # Use a system prompt to steer behavior and reduce repeated identical replies
        system_prompt = os.getenv("LLM_SYSTEM_PROMPT") or (
            "You are a helpful, concise travel assistant. Reply naturally and adapt tone to the user's input."
        )

        def _call():
            return client.chat.complete(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )

        try:
            logger.info("LLM request model=%s temperature=%s prompt_snip=%s", model, temperature, (prompt[:240] + ("..." if len(prompt) > 240 else "")))
            response = await asyncio.to_thread(_call)
            content = ""
            if hasattr(response, "choices") and response.choices:
                # Mistral SDK: choices[0].message.content
                content = response.choices[0].message.content
            else:
                content = str(response)
            logger.info("LLM response model=%s len=%d", model, len(content))
            return {"text": content, "provider": "mistral", "model": model}
        except Exception as exc:
            logger.exception("LLM call failed")
            return {"error": str(exc), "provider": "mistral", "model": model}