import re

class VoiceEngine:
    @staticmethod
    def handle_text(text: str, user_id: int = None):
        t = text.lower()
        # Simple intent detection using keywords
        if any(k in t for k in ["hotel", "stay", "book a room"]):
            intent = "hotel"
            resp = {"intent": intent, "action": "search_hotels", "params": {"query": text}}
        elif any(k in t for k in ["food", "eat", "restaurant", "where to eat"]):
            intent = "food"
            resp = {"intent": intent, "action": "search_food", "params": {"query": text}}
        elif any(k in t for k in ["how to go", "route", "travel", "directions", "book flight"]):
            intent = "travel"
            resp = {"intent": intent, "action": "search_travel_options", "params": {"query": text}}
        else:
            intent = "unknown"
            resp = {"intent": intent, "action": "clarify", "params": {"query": text}}
        # Add simple response text
        resp["response_text"] = VoiceEngine._compose_text(resp)
        return resp

    @staticmethod
    def _compose_text(resp: dict):
        if resp["intent"] == "hotel":
            return "I can help find hotels — what city or dates?"
        if resp["intent"] == "food":
            return "Looking for food — any cuisine preference?"
        if resp["intent"] == "travel":
            return "Do you want trains, flights, or buses for this route?"
        return "Can you clarify what you need?"
