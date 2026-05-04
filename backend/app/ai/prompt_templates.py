"""
app.ai.prompt_templates — Versioned prompt templates.

Centralizing prompts here provides:
1. Version tracking (when prompts change, AI responses change)
2. Easy A/B testing of different prompt variants
3. Clean separation from business logic
4. Prompt injection mitigation via structured templates

Include the version in cache keys to auto-invalidate when prompts change.
"""

from typing import Dict, Any, Optional


# Increment this when any prompt changes — used in cache key generation
PROMPT_VERSION = "v2"


class PromptTemplates:
    """Travel assistant prompt templates."""

    @staticmethod
    def copilot_suggestion(payload: Dict[str, Any]) -> str:
        """Build a copilot travel suggestion prompt."""
        parts = [
            "You are an expert travel advisor with deep knowledge of local culture, food, and activities.",
            "Based on the following context, provide ONE specific, actionable travel suggestion.",
            "Be concise (2-3 sentences max). Include the place name and why it's a good choice.",
            "",
        ]

        if payload.get("query"):
            parts.append(f"User query: {payload['query']}")

        if payload.get("preferences"):
            prefs = payload["preferences"]
            parts.append(f"Travel style: {prefs.get('travel_style', 'not specified')}")
            parts.append(f"Budget: {prefs.get('budget', 'not specified')}")

        if payload.get("weather"):
            w = payload["weather"]
            parts.append(f"Current weather: {w.get('type', 'unknown')}, {w.get('temperature', '?')}°C")

        if payload.get("time"):
            parts.append(f"Time: {payload['time']}")

        if payload.get("location"):
            loc = payload["location"]
            parts.append(f"Location: ({loc.get('lat', 0)}, {loc.get('lng', 0)})")

        parts.append("")
        parts.append("Respond with ONLY the suggestion text. No labels, no formatting.")

        return "\n".join(parts)

    @staticmethod
    def itinerary_generation(destination: str, days: int, preferences: Optional[Dict] = None, budget: Optional[str] = None) -> str:
        """Build an itinerary generation prompt."""
        parts = [
            f"Create a {days}-day travel itinerary for {destination}.",
            "Format as a day-by-day plan with morning, afternoon, and evening activities.",
            "Include specific restaurant recommendations, travel tips, and estimated costs.",
            "",
        ]

        if preferences:
            parts.append(f"Travel preferences: {preferences}")
        if budget:
            parts.append(f"Budget level: {budget}")

        parts.extend([
            "",
            "Format the response in clean Markdown with headers for each day.",
            "Include practical tips like best times to visit and how to get around.",
        ])

        return "\n".join(parts)

    @staticmethod
    def voice_chat(language: Optional[str] = None) -> str:
        """System prompt for voice chat conversations."""
        base = (
            "You are a friendly, native-sounding travel assistant. "
            "Respond as a helpful, warm, and polite native speaker. "
            "Use natural conversational rhythm, short sentences, and empathetic interjections. "
            "Keep responses concise but human — polite, upbeat, and easy to read aloud by a TTS engine. "
            "When producing responses, use conversational sentences suitable for spoken audio "
            "(avoid long nested clauses). Provide only the reply text in your output."
        )

        if language and language != "auto":
            language_map = {
                "en-IN": "English",
                "hi-IN": "Hindi",
                "bn-IN": "Bengali",
                "ta-IN": "Tamil",
                "te-IN": "Telugu",
                "kn-IN": "Kannada",
                "ml-IN": "Malayalam",
                "mr-IN": "Marathi",
                "gu-IN": "Gujarati",
                "pa-IN": "Punjabi",
                "or-IN": "Odia",
            }
            lang_name = language_map.get(language, language)
            base += f"\n\nIMPORTANT: Respond ONLY in {lang_name}. Do not translate or use English."

        return base

    @staticmethod
    def hidden_gems(location_name: str, categories: Optional[list] = None) -> str:
        """Build a hidden gems discovery prompt."""
        parts = [
            f"Find hidden gems and underrated places in or near {location_name}.",
            "Focus on places that most tourists miss — local favorites, secret spots, off-the-beaten-path experiences.",
            "For each gem, provide: name, category (cafe/park/temple/market/trail/etc.), and a 1-2 sentence reason why it's special.",
            "Return 3-5 hidden gems.",
        ]

        if categories:
            parts.append(f"Focus on these categories: {', '.join(categories)}")

        parts.append("Format as a JSON array with objects: {name, category, reason}")

        return "\n".join(parts)
