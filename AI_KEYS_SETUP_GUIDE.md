# 🤖 AI API Keys Setup Guide

**Focus:** Setting up LLM integration with API keys  
**Status:** ✅ Complete

---

## 🎯 Quick Overview

Your RouteAura platform currently uses **rule-based AI** (simple pattern matching). To enable advanced AI:

1. **Get an API key** from your chosen AI provider
2. **Add to `.env` file**
3. **Enable LLM mode** by setting `USE_LLM=true`
4. **Restart backend** → Advanced AI engaged! 🚀

---

## 🤖 AI Providers & Setup

### ✅ Option 1: **Mistral AI** (Recommended)

**Why Mistral?**
- ✅ Fast responses (low latency)
- ✅ Affordable pricing
- ✅ Excellent context understanding
- ✅ Open source models available
- ✅ Great for travel recommendations

#### Step 1: Get API Key

1. Go to https://console.mistral.ai/
2. Sign up or log in
3. Click **"API Keys"** in left sidebar
4. Click **"+ Create new key"**
5. Name it: `routeaura-ai`
6. Copy the key (starts with `sk-...`)

#### Step 2: Add to Backend

**File:** `backend/.env`

```bash
# AI Configuration
USE_LLM=true
MISTRAL_API_KEY=sk_your_mistral_key_here_1234567890
```

#### Step 3: Install Mistral Package

```bash
cd backend
pip install mistralai
```

#### Step 4: Implement in Backend

**File:** `backend/app/services/ai_engine.py`

Replace the `LLMAdapter` class:

```python
from mistralai.client import MistralClient
import os
import asyncio

class LLMAdapter:
    client = None
    
    @classmethod
    def _get_client(cls):
        if cls.client is None:
            cls.client = MistralClient(
                api_key=os.getenv("MISTRAL_API_KEY")
            )
        return cls.client
    
    @classmethod
    async def call_llm(cls, prompt: str) -> dict:
        """Call Mistral AI for intelligent responses"""
        try:
            loop = asyncio.get_event_loop()
            client = cls._get_client()
            
            # Run in thread pool to avoid blocking
            response = await loop.run_in_executor(
                None,
                lambda: client.chat.complete(
                    model="mistral-small",
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
            )
            
            return {
                "response": response.choices[0].message.content,
                "provider": "mistral",
                "model": "mistral-small"
            }
        except Exception as e:
            return {
                "error": str(e),
                "provider": "mistral",
                "fallback": True
            }
```

#### Step 5: Update Copilot Service

**File:** `backend/app/services/copilot_service.py`

```python
import os
from app.services.ai_engine import SimpleAI, LLMAdapter

async def generate_copilot(data: dict) -> dict:
    use_llm = os.getenv("USE_LLM", "false").lower() == "true"
    
    if use_llm:
        # Create smart prompt from user data
        preferences = data.get("preferences", {})
        location = data.get("location", {})
        weather = data.get("weather", {})
        
        prompt = f"""You are a travel expert AI providing personalized travel suggestions.
        
User Preferences: {preferences}
Current Location: {location}
Weather: {weather}

Provide a single specific travel suggestion (1-2 sentences) with a brief reason. Be conversational and helpful."""
        
        llm_result = await LLMAdapter.call_llm(prompt)
        
        if "error" not in llm_result:
            return {
                "suggestion": llm_result["response"],
                "reason": f"AI-generated using {llm_result['provider']}",
                "mode": "llm"
            }
    
    # Fallback to rule-based
    rule_result = await SimpleAI.copilot_rule_based(data)
    return {
        "suggestion": rule_result["suggestions"][0],
        "reason": rule_result["reason"],
        "mode": "rule-based"
    }
```

#### Step 6: Test It

```bash
# Restart backend
cd backend
uvicorn app.main:app --reload

# In another terminal, test:
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {"travel_style": "adventure"},
    "location": {"lat": 12.97, "lng": 77.59},
    "weather": {"type": "sunny"}
  }'
```

**Expected Response (with LLM):**
```json
{
  "suggestion": "Consider exploring the hidden foothills near Bangalore with adventure hikes - perfect for sunny weather!",
  "reason": "AI-generated using mistral",
  "mode": "llm"
}
```

---

### 🔴 Option 2: **OpenAI GPT** (Alternative)

**Why OpenAI?**
- ✅ Most advanced AI (GPT-4)
- ✅ Best context understanding
- ⚠️ More expensive than Mistral
- ✅ Widely used and tested

#### Step 1: Get API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. **Save safely** - you won't see it again!

#### Step 2: Set Budget Limit (Important!)

1. Go to https://platform.openai.com/account/billing/overview
2. Click **"Usage limits"**
3. Set **Hard limit** to $10/month (or desired amount)
4. This prevents unexpected charges

#### Step 3: Add to Backend

**File:** `backend/.env`

```bash
# AI Configuration
USE_LLM=true
OPENAI_API_KEY=sk_your_openai_key_here_1234567890
```

#### Step 4: Install OpenAI Package

```bash
cd backend
pip install openai
```

#### Step 5: Implement in Backend

**File:** `backend/app/services/ai_engine.py`

```python
from openai import AsyncOpenAI
import os

class LLMAdapter:
    client = None
    
    @classmethod
    def _get_client(cls):
        if cls.client is None:
            cls.client = AsyncOpenAI(
                api_key=os.getenv("OPENAI_API_KEY")
            )
        return cls.client
    
    @classmethod
    async def call_llm(cls, prompt: str) -> dict:
        """Call OpenAI GPT for intelligent responses"""
        try:
            client = cls._get_client()
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",  # or "gpt-4" for advanced
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful travel recommendations AI. Be concise and specific."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return {
                "response": response.choices[0].message.content,
                "provider": "openai",
                "model": response.model
            }
        except Exception as e:
            return {
                "error": str(e),
                "provider": "openai",
                "fallback": True
            }
```

#### Pricing

| Model | Cost per 1K tokens |
|-------|-------------------|
| gpt-3.5-turbo | $0.0005 input / $0.0015 output |
| gpt-4 | $0.03 input / $0.06 output |

**Estimate:** ~100-200 tokens per request = $0.0001-0.0003 per request

---

### 🟢 Option 3: **Hugging Face** (Free/Open Source)

**Why Hugging Face?**
- ✅ Completely free
- ✅ Open source models
- ✅ No API key tokens cost
- ⚠️ Slower responses than paid APIs
- ✅ Privacy-friendly

#### Step 1: Get API Key

1. Go to https://huggingface.co/settings/tokens
2. Sign up or log in
3. Click **"New token"**
4. Set to **"Read"** (not Write)
5. Copy the token

#### Step 2: Add to Backend

**File:** `backend/.env`

```bash
# AI Configuration
USE_LLM=true
HUGGINGFACE_API_KEY=hf_your_hugging_face_token_here
```

#### Step 3: Install Package

```bash
cd backend
pip install requests
```

#### Step 4: Implement in Backend

**File:** `backend/app/services/ai_engine.py`

```python
import os
import aiohttp

class LLMAdapter:
    API_URL = "https://api-inference.huggingface.co/models/mistral-community/Mistral-7B-Instruct-v0.1"
    
    @classmethod
    async def call_llm(cls, prompt: str) -> dict:
        """Call Hugging Face for intelligent responses"""
        try:
            headers = {
                "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"
            }
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_length": 200,
                    "temperature": 0.7
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    cls.API_URL,
                    headers=headers,
                    json=payload
                ) as resp:
                    result = await resp.json()
                    
                    if isinstance(result, list) and len(result) > 0:
                        return {
                            "response": result[0].get("generated_text", "No response"),
                            "provider": "huggingface",
                            "model": "Mistral-7B-Instruct"
                        }
                    return {"error": str(result), "fallback": True}
        except Exception as e:
            return {
                "error": str(e),
                "provider": "huggingface",
                "fallback": True
            }
```

---

## 📊 Comparison: Which Should You Choose?

| Feature | Mistral | OpenAI | Hugging Face |
|---------|---------|--------|--------------|
| **Speed** | ⚡⚡⚡ Fast | ⚡⚡ Medium | ⚡ Slow |
| **Quality** | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐ Good |
| **Cost** | 💰 Affordable | 💸 Medium | 🆓 Free |
| **Setup** | 🟢 Easy | 🟢 Easy | 🟢 Easy |
| **For Travel AI** | ✅ Best Choice | ✅ Also Great | ✅ Good for Demo |

**Recommendation:** Start with **Mistral** (best balance of speed, quality, and cost)

---

## ⚙️ Configuration Options

### How LLM Mode Works

**File:** `backend/.env`

```bash
# Enable/Disable LLM
USE_LLM=true          # Set to 'false' for rule-based only

# Temperature (0-2): Controls randomness of responses
# 0.7 = balanced (recommended)
# 0.3 = more deterministic (safer)
# 1.5 = more creative (experimental)
LLM_TEMPERATURE=0.7

# Max tokens: Controls response length
# 200 = short responses (travel suggestions)
# 500 = medium responses
# 1000 = long responses
LLM_MAX_TOKENS=300

# Which AI to use if multiple keys provided
PRIMARY_LLM=mistral    # or: openai, huggingface
```

### Toggle Between Modes

**Without restarting backend:**

```bash
# Start backend with rule-based
USE_LLM=false uvicorn app.main:app

# Then enable LLM via environment
export USE_LLM=true

# Or handle via database flag (future enhancement)
UPDATE settings SET use_llm = true WHERE key = 'ai_mode'
```

---

## 🧪 Testing Your LLM Setup

### Test 1: Verify API Key

```bash
# Mistral
curl https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer sk_your_key" \
  -H "Content-Type: application/json" \
  -d '{"model":"mistral-small","messages":[{"role":"user","content":"Hi"}]}'

# OpenAI
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer sk_your_key" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hi"}]}'
```

### Test 2: Test Backend Endpoint

```bash
# Make sure backend is running with USE_LLM=true
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {"travel_style": "adventure"},
    "location": {"lat": 12.97, "lng": 77.59}
  }'

# Should return with "mode": "llm" if working
```

### Test 3: Check Response Quality

```typescript
// In browser console while on CopilotPage
const response = await fetch('http://localhost:8000/api/copilot/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    preferences: { travel_style: 'luxury' },
    location: { lat: 12.97, lng: 77.59 },
    weather: { type: 'sunny' }
  })
})
const data = await response.json()
console.log(data)
// Should see intelligent response like:
// "suggestion": "Experience the luxury villa stays in Coorg with spa services..."
// "mode": "llm"
```

---

## 🔄 Switching Providers

### Switch from Mistral to OpenAI

```bash
# 1. Update .env
USE_LLM=true
OPENAI_API_KEY=sk_your_openai_key
# Comment out: # MISTRAL_API_KEY=...

# 2. Update code to handle OpenAI
# In backend/app/services/ai_engine.py, modify LLMAdapter

# 3. Restart backend
cd backend
uvicorn app.main:app --reload

# 4. Test
curl -X POST http://localhost:8000/api/copilot/ ...
```

### Fallback Logic

```python
# Automatic fallback if API fails:
async def generate_copilot(data: dict) -> dict:
    try:
        if os.getenv("USE_LLM") == "true":
            result = await LLMAdapter.call_llm(prompt)
            if "error" not in result:
                return result  # Success with LLM
    except Exception as e:
        print(f"LLM failed: {e}")
    
    # Fallback to rule-based
    return await SimpleAI.copilot_rule_based(data)
```

---

## 💰 Cost Estimation

### Mistral AI

```
$0.14 per 1M input tokens
$0.42 per 1M output tokens

Example per request:
- 100 input tokens × $0.14/1M = $0.000014
- 100 output tokens × $0.42/1M = $0.000042
- Total per request: ~$0.00006

1000 requests per day = $0.06 per day = $1.80/month
```

### OpenAI GPT-3.5-turbo

```
$0.5 per 1M input tokens
$1.5 per 1M output tokens

Example per request:
- 100 input tokens × $0.5/1M = $0.00005
- 100 output tokens × $1.5/1M = $0.00015
- Total per request: ~$0.0002

1000 requests per day = $0.20 per day = $6/month
```

### Hugging Face

```
FREE! ✅

No usage costs. Perfect for:
- Development
- Testing
- Demo apps
- Learning
```

---

## 🚨 Troubleshooting

### "Invalid API Key"

```bash
# Check key is correctly set
echo $MISTRAL_API_KEY  # Should print your key

# Verify in .env file
cat backend/.env | grep MISTRAL_API_KEY

# If not set:
export MISTRAL_API_KEY=sk_your_actual_key
```

### "Connection Timeout"

```bash
# Network issue - check internet connection
ping api.mistral.ai

# Backend can't reach API
curl -H "Authorization: Bearer $MISTRAL_API_KEY" \
     https://api.mistral.ai/v1/models | jq '.data[] | .id'
```

### "Rate Limited"

```bash
# You've hit API limits
# Mistral: Check dashboard at console.mistral.ai
# OpenAI: Check dashboard and increase rate limit

# Temporary fix: Increase cache TTL
_ttl = timedelta(seconds=300)  # Increase from 30 to 300
```

### "Token Limit Exceeded"

```bash
# Reduce max_tokens in config
LLM_MAX_TOKENS=200  # From 500 to 200

# Or decrease input prompt length
```

---

## ✅ Deployment Checklist

- [ ] **Get API Key** from chosen provider
- [ ] **Add to backend/.env**
- [ ] **Install required package** (`pip install mistral-ai`)
- [ ] **Update LLMAdapter** implementation
- [ ] **Set USE_LLM=true** in environment
- [ ] **Test locally** with curl or Postman
- [ ] **Test in browser** on frontend
- [ ] **Set budget limit** (if using paid service)
- [ ] **Deploy backend** with new environment variables
- [ ] **Verify responses** from deployed API
- [ ] **Monitor API usage** and costs

---

## 📞 API Support Links

- **Mistral:** https://docs.mistral.ai/ | Support: support@mistral.ai
- **OpenAI:** https://platform.openai.com/docs/ | Support: help.openai.com
- **Hugging Face:** https://huggingface.co/docs/ | Support: Community Forum

---

## 🎯 Next: Full Integration Example

For a context-aware travel suggestion, the complete prompt sent to LLM would be:

```python
prompt = f"""
You are an expert travel advisor for RouteAura and help users discover amazing destinations.

User Travel Preferences:
- Style: {preferences.get('travel_style', 'balanced')}
- Budget: {preferences.get('budget', 'moderate')}
- Duration: {preferences.get('duration', '3-5 days')}

Current Conditions:
- Location: {location.get('lat', 0)}, {location.get('lng', 0)}
- Weather: {weather.get('type', 'unknown')}
- Temperature: {weather.get('temp_celsius', 'N/A')}°C

Please provide ONE specific travel suggestion (2-3 sentences):
1. What to do/visit
2. Why it matches their preferences
3. Best time to go

Be conversational, enthusiastic, and specific to their situation.
"""
```

**LLM Response:**
```
"Based on your adventure style and current sunny weather, I'd recommend 
exploring the Western Ghats hiking trails near Chikmagalur. You'll encounter 
pristine coffee plantations, misty mountains, and cascading waterfalls - 
perfect for a 3-5 day adventure. Go now during the dry season for the best views!"
```

---

**Version:** 1.0  
**Last Updated:** April 28, 2026  
**Status:** ✅ Ready for Implementation
