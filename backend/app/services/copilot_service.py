from app.services.ai_engine import SimpleAI, LLMAdapter
import os

async def generate_copilot(payload: dict):
    # payload contains preferences, time, weather, location
    use_llm = os.getenv("USE_LLM", "false").lower() in ("1", "true", "yes")
    if use_llm:
        prompt = (
            "You are a travel advisor. Give one specific suggestion and a short reason.\n"
            f"User data: {payload}\n"
            "Return a concise suggestion in 1-2 sentences."
        )
        llm_out = await LLMAdapter.call_llm(prompt)
        if "error" not in llm_out:
            return {
                "suggestion": llm_out.get("text", ""),
                "reason": f"AI-generated using {llm_out.get('provider', 'mistral')}",
                "mode": "llm",
            }

    # fallback rule-based
    out = await SimpleAI.copilot_rule_based(payload)
    suggestion = out["suggestions"][0] if out["suggestions"] else "No suggestion"
    reasoning = out["reason"]
    return {"suggestion": suggestion, "reason": reasoning, "mode": "rule-based"}
