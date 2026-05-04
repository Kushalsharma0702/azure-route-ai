"""
app.ai.fallback — Rule-based fallback engine.

When all LLM providers fail, these functions provide basic but
functional responses so the user isn't left with an error.

This is the "always works" layer — no external dependencies.
"""

from typing import Dict, Any, List, Optional


class FallbackEngine:
    """Rule-based fallback when LLM providers are unavailable."""

    @staticmethod
    def copilot_suggestion(payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a basic travel suggestion using rules.

        Covers the most common scenarios: weather, travel style, time of day.
        """
        prefs = payload.get("preferences") or {}
        weather = payload.get("weather") or {}
        time_str = payload.get("time") or ""

        suggestions: List[str] = []
        reasons: List[str] = []

        # Weather-based rules
        weather_type = (weather.get("type") or "").lower()
        precip = weather.get("precip_prob", 0)

        if weather_type == "rain" or precip > 0.5:
            suggestions.append("Visit indoor attractions like museums, art galleries, or cozy cafes")
            reasons.append("Rain expected in your area")
        elif weather_type == "sunny" and weather.get("temperature", 25) > 35:
            suggestions.append("Head to a hill station or water park to beat the heat")
            reasons.append("High temperatures today")
        elif weather_type == "sunny":
            suggestions.append("Great weather for outdoor sightseeing and nature trails")
            reasons.append("Pleasant weather conditions")

        # Travel style rules
        style = (prefs.get("travel_style") or "").lower()
        if style == "adventure":
            suggestions.append("Try the nearby trekking trail or adventure sports center")
            reasons.append("You prefer adventure activities")
        elif style == "cultural":
            suggestions.append("Visit local heritage sites and attend cultural performances")
            reasons.append("You enjoy cultural experiences")
        elif style == "relaxation":
            suggestions.append("Consider a spa day or a scenic lakeside retreat")
            reasons.append("You prefer relaxation")

        # Time-based rules
        if "morning" in time_str.lower() or "06:" in time_str or "07:" in time_str:
            suggestions.append("Start with a sunrise viewpoint or early morning market")
            reasons.append("Early morning is best for sunrise views")
        elif "evening" in time_str.lower() or "18:" in time_str or "19:" in time_str:
            suggestions.append("Enjoy street food and local nightlife")
            reasons.append("Evening is great for food and entertainment")

        # Default
        if not suggestions:
            suggestions.append("Explore the local market and popular landmarks nearby")
            reasons.append("Good conditions for general sightseeing")

        return {
            "suggestion": suggestions[0],
            "reason": "; ".join(reasons),
            "mode": "rule-based",
        }

    @staticmethod
    def voice_response(text: str) -> Dict[str, Any]:
        """
        Simple keyword-based intent detection for voice commands.

        Returns a structured response with detected intent and action.
        """
        t = text.lower()

        intent_map = [
            (["hotel", "stay", "book a room", "accommodation"], "hotel", "I can help find hotels — what city and dates?"),
            (["food", "eat", "restaurant", "cuisine", "hungry"], "food", "Looking for food nearby — any cuisine preference?"),
            (["train", "rail", "railway"], "train", "I can check train schedules. What's your route?"),
            (["flight", "fly", "airport", "airline"], "flight", "Let me look up flights. Where are you flying to?"),
            (["route", "directions", "navigate", "how to go"], "directions", "I can help with directions. Where do you want to go?"),
            (["weather", "rain", "sunny", "forecast"], "weather", "Let me check the weather forecast for you."),
            (["hidden", "secret", "offbeat", "gem"], "hidden_gems", "I'll find some hidden gems near you!"),
        ]

        for keywords, intent, response in intent_map:
            if any(k in t for k in keywords):
                return {
                    "intent": intent,
                    "response_text": response,
                    "mode": "rule-based",
                }

        return {
            "intent": "unknown",
            "response_text": "Can you tell me more about what you're looking for?",
            "mode": "rule-based",
        }

    @staticmethod
    def hidden_gems_local(location_name: str) -> List[Dict[str, Any]]:
        """Fallback hidden gems when AI and external APIs are unavailable."""
        return [
            {
                "id": "fallback_1",
                "name": f"Local Heritage Walk in {location_name}",
                "category": "cultural",
                "location": {"lat": 0, "lng": 0},
                "reason": "Walking tours with locals reveal stories you won't find in guidebooks.",
            },
            {
                "id": "fallback_2",
                "name": f"Morning Market in {location_name}",
                "category": "market",
                "location": {"lat": 0, "lng": 0},
                "reason": "Early morning markets offer authentic local produce and street food.",
            },
            {
                "id": "fallback_3",
                "name": f"Neighborhood Cafe Discovery in {location_name}",
                "category": "cafe",
                "location": {"lat": 0, "lng": 0},
                "reason": "Small neighborhood cafes often have the best local coffee and stories.",
            },
        ]
