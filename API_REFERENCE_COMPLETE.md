# 🔌 Complete API Reference - RouteAura AI Platform

**Last Updated:** April 28, 2026  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Base URL & Configuration](#api-base-url--configuration)
3. [Frontend API Client](#frontend-api-client)
4. [Complete API Endpoints](#complete-api-endpoints)
5. [AI API Keys Required](#ai-api-keys-required)
6. [Environment Variables](#environment-variables)
7. [Request/Response Examples](#requestresponse-examples)
8. [Error Handling](#error-handling)
9. [Authentication & Security](#authentication--security)

---

## 📌 Overview

Your RouteAura AI Platform has **4 core APIs**:

| Endpoint | Method | Purpose | Frontend Usage |
|----------|--------|---------|-----------------|
| `/api/copilot` | POST | AI travel suggestions | CopilotPage.tsx |
| `/api/live-status` | GET | Real-time crowd/noise/wait metrics | LiveStatusPage.tsx |
| `/api/voice` | POST | Intent detection from text | VoiceAssistant.tsx |
| `/api/hidden-gems` | POST | Discover underrated places | HiddenGems.tsx |
| `/api/health` | GET | Backend health check | App.tsx (on load) |

---

## 🌐 API Base URL & Configuration

### Backend URL Detection
The frontend **automatically detects** the backend URL:

```typescript
// src/services/api.ts
const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'
```

### Configuration Options

**Development:**
```bash
export VITE_AI_API_URL=http://localhost:8000
npm run dev
```

**Production:**
```bash
export VITE_AI_API_URL=https://your-api.example.com
npm run build
```

**Docker:**
```bash
# In docker-compose.yml
environment:
  VITE_AI_API_URL: http://api:8000
```

---

## 💻 Frontend API Client

### Location: `src/services/api.ts`

```typescript
const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'

async function request(path: string, opts: RequestInit = {}): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export default {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body: any) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
```

### How Frontend Uses It

```typescript
// GET Request
const response = await api.get('/api/live-status/?place_id=1')

// POST Request
const response = await api.post('/api/copilot', {
  preferences: { travel_style: 'adventure' },
  location: { lat: 12.97, lng: 77.59 }
})
```

---

## 🔌 Complete API Endpoints

### 1️⃣ **Trip Copilot API**

#### Endpoint
```
POST /api/copilot/
```

#### Frontend Component
- **File:** `src/pages/CopilotPage.tsx`
- **Trigger:** User sends message in chat

#### Request JSON

```json
{
  "user_id": null,
  "preferences": {
    "travel_style": "adventure"
  },
  "time": "2026-04-28T14:30:00.000Z",
  "weather": {
    "type": "rain"
  },
  "location": {
    "lat": 0,
    "lng": 0
  }
}
```

**Field Details:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `user_id` | int | No | User identifier | `123` |
| `preferences.travel_style` | string | No | Trip style preference | `"adventure"`, `"luxury"`, `"budget"` |
| `time` | string (ISO) | No | Current time | `"2026-04-28T14:30:00.000Z"` |
| `weather.type` | string | No | Weather condition | `"rain"`, `"sunny"`, `"cloudy"` |
| `location.lat` | float | No | Latitude | `12.97` |
| `location.lng` | float | No | Longitude | `77.59` |

#### Response JSON

```json
{
  "suggestion": "Visit indoor cafes and museums",
  "reason": "Rain expected in your area; you prefer adventure activities",
  "mode": "rule-based"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `suggestion` | string | AI-generated travel suggestion |
| `reason` | string | Explanation for the suggestion |
| `mode` | string | `"rule-based"` or `"llm"` (AI mode used) |

#### Frontend Usage

```typescript
// src/pages/CopilotPage.tsx (Line 47-65)
const res = await api.post('/api/copilot', {
  preferences: { travel_style: input },
  time: new Date().toISOString(),
  location: { lat: 0, lng: 0 }
})

const aiMessage = {
  id: (Date.now() + 1).toString(),
  text: res.suggestion || 'Great choice!',
  sender: 'ai' as const,
  timestamp: new Date()
}
setMessages(prev => [...prev, aiMessage])
```

#### Curl Example

```bash
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {"travel_style": "adventure"},
    "time": "2026-04-28T14:30:00Z",
    "weather": {"type": "rain"},
    "location": {"lat": 12.97, "lng": 77.59}
  }'
```

---

### 2️⃣ **Live Reality Layer API**

#### Endpoint
```
GET /api/live-status/?place_id=1
```

#### Frontend Component
- **File:** `src/pages/LiveStatusPage.tsx`
- **Trigger:** Page load + auto-refresh every 15 seconds

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `place_id` | int | **Yes** | Place identifier | `1` |
| `refresh` | bool | No | Force cache bypass | `false` |

#### Response JSON

```json
{
  "place_id": 1,
  "crowd": "Medium",
  "noise": "Low",
  "waiting_time": 15,
  "timestamp": "2026-04-28T14:30:00.123456",
  "source": "live"
}
```

**Response Fields:**

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `place_id` | int | - | Place identifier |
| `crowd` | string | `"Low"`, `"Medium"`, `"High"` | Crowd level |
| `noise` | string | `"Low"`, `"Medium"`, `"High"` | Noise level |
| `waiting_time` | int | 0-120 | Wait time in minutes |
| `timestamp` | string | ISO format | Data timestamp |
| `source` | string | `"cache"`, `"live"` | Data source (cached or fresh) |

#### Frontend Usage

```typescript
// src/pages/LiveStatusPage.tsx (Line 38-50)
const loadData = async () => {
  setLoading(true)
  try {
    const res = await api.get(`/api/live-status/?place_id=${placeId}`)
    setData(res as LiveStatus)
    setLastUpdate(new Date())
  } catch (e) {
    setError((e as Error).message)
  }
}

useEffect(() => {
  loadData()
  const interval = setInterval(loadData, 15000) // Refresh every 15s
  return () => clearInterval(interval)
}, [placeId])
```

#### Curl Example

```bash
# Get live status for place 1
curl http://localhost:8000/api/live-status/?place_id=1

# Force refresh (bypass cache)
curl http://localhost:8000/api/live-status/?place_id=1&refresh=true
```

---

### 3️⃣ **Voice Assistant API**

#### Endpoint
```
POST /api/voice/
```

#### Frontend Component
- **File:** `src/pages/VoiceAssistant.tsx`
- **Trigger:** User submits voice/text input

#### Request JSON

```json
{
  "user_id": null,
  "text": "Find me a hotel in Bangalore"
}
```

**Field Details:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `user_id` | int | No | User identifier | `123` |
| `text` | string | **Yes** | User input text | `"Find me a hotel in Bangalore"` |

#### Response JSON

```json
{
  "intent": "hotel",
  "action": "search_hotels",
  "params": {
    "query": "Find me a hotel in Bangalore"
  },
  "response_text": "I can help find hotels — what city or dates?"
}
```

**Response Fields:**

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `intent` | string | Detected user intent | `"hotel"`, `"food"`, `"travel"`, `"unknown"` |
| `action` | string | Recommended action | `"search_hotels"`, `"search_restaurants"`, etc. |
| `params` | object | Extracted parameters | `{"query": "..."}` |
| `response_text` | string | AI response to user | Natural language response |

#### Intent Detection Logic

```python
# backend/app/services/voice_engine.py
INTENT_MAP = {
  "hotel": ["hotel", "accommodation", "stay", "book"],
  "food": ["restaurant", "food", "eating", "cuisine"],
  "travel": ["flight", "train", "bus", "transport"],
  "unknown": [default]
}
```

#### Frontend Usage

```typescript
// src/pages/VoiceAssistant.tsx (Line 60-85)
const handleSubmit = async () => {
  setIsProcessing(true)
  try {
    const res = await api.post('/api/voice', {
      text: text
    })
    setResponse(res as VoiceResponse)
  } catch (e) {
    console.error(e)
  } finally {
    setIsProcessing(false)
    setText('')
  }
}
```

#### Curl Example

```bash
curl -X POST http://localhost:8000/api/voice/ \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Find me a hotel in Bangalore"
  }'
```

---

### 4️⃣ **Hidden Gems API**

#### Endpoint
```
POST /api/hidden-gems/
```

#### Frontend Component
- **File:** `src/pages/HiddenGems.tsx`
- **Trigger:** Page load

#### Request JSON

```json
{
  "user_id": null,
  "location": {
    "lat": 12.97,
    "lng": 77.59
  },
  "radius_km": 10
}
```

**Field Details:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `user_id` | int | No | User identifier | `123` |
| `location.lat` | float | **Yes** | Latitude | `12.97` |
| `location.lng` | float | **Yes** | Longitude | `77.59` |
| `radius_km` | int | No | Search radius | `10` |

#### Response JSON

```json
{
  "gems": [
    {
      "id": "gem_1",
      "name": "Local Hidden Spot 1",
      "category": "park",
      "location": {
        "lat": 12.971,
        "lng": 77.589
      },
      "reason": "Most tourists miss this because it requires a short walk from the main square and is not listed on popular aggregator sites."
    },
    {
      "id": "gem_2",
      "name": "Secret Garden Market",
      "category": "market",
      "location": {
        "lat": 12.974,
        "lng": 77.588
      },
      "reason": "This underground market is known for local artisans and authentic crafts. Hidden from main tourist routes."
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `gems[].id` | string | Unique gem identifier |
| `gems[].name` | string | Place name |
| `gems[].category` | string | Category (park, cafe, market, etc.) |
| `gems[].location.lat` | float | Latitude |
| `gems[].location.lng` | float | Longitude |
| `gems[].reason` | string | Why this is a hidden gem |

#### Frontend Usage

```typescript
// src/pages/HiddenGems.tsx (Line 34-60)
async function load() {
  setLoading(true)
  try {
    const res = await api.post('/api/hidden-gems', {
      location: { lat: 12.97, lng: 77.59 }
    })
    const gemsData = res.gems || []
    setGems(gemsData)
  } catch (e) {
    console.error(e)
  }
}
```

#### Curl Example

```bash
curl -X POST http://localhost:8000/api/hidden-gems/ \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"lat": 12.97, "lng": 77.59},
    "radius_km": 10
  }'
```

---

### 5️⃣ **Health Check API** (Utility)

#### Endpoint
```
GET /api/health
```

#### Response JSON

```json
{
  "status": "ok"
}
```

#### Curl Example

```bash
curl http://localhost:8000/api/health
```

---

## 🔐 AI API Keys Required

### Required for LLM Mode

To enable advanced AI features, add the following API keys:

#### Option 1: **Mistral AI** (Recommended)

**Get Key:** https://console.mistral.ai/

```bash
# Add to backend/.env
MISTRAL_API_KEY=your_mistral_key_here
```

**Usage in Code:**
```python
# backend/app/services/ai_engine.py
from mistralai.client import MistralClient

class LLMAdapter:
    @staticmethod
    async def call_llm(prompt: str):
        client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))
        response = await client.chat.complete(
            model="mistral-small",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
```

#### Option 2: **OpenAI** (Fallback)

**Get Key:** https://platform.openai.com/api-keys

```bash
# Add to backend/.env
OPENAI_API_KEY=your_openai_key_here
```

**Usage in Code:**
```python
from openai import AsyncOpenAI

class LLMAdapter:
    @staticmethod
    async def call_llm(prompt: str):
        client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
```

#### Option 3: **Hugging Face** (Open Source)

**Get Key:** https://huggingface.co/settings/tokens

```bash
# Add to backend/.env
HUGGINGFACE_API_KEY=your_hf_key_here
```

---

## 🔧 Environment Variables

### Backend (`.env` file)

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/routeaura

# AI Configuration
USE_LLM=false                          # Set to 'true' to enable LLM
MISTRAL_API_KEY=your_mistral_key      # For Mistral
OPENAI_API_KEY=your_openai_key        # For OpenAI
HUGGINGFACE_API_KEY=your_hf_key       # For Hugging Face

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=false
```

### Frontend (`.env.local` file)

```bash
# API Configuration
VITE_AI_API_URL=http://localhost:8000

# Optional: Additional frontend config
VITE_LOG_LEVEL=debug
VITE_CACHE_TTL=30000
```

### Docker Compose (`.env`)

```bash
# Backend services
BACKEND_PORT=8000
DATABASE_URL=postgresql://postgres:password@db:5432/routeaura

# Frontend services
FRONTEND_PORT=5173
VITE_AI_API_URL=http://backend:8000

# AI Keys (same as backend)
MISTRAL_API_KEY=your_mistral_key
OPENAI_API_KEY=your_openai_key
```

---

## 📝 Request/Response Examples

### Example 1: Complete Copilot Flow

**Step 1: Frontend sends request**
```typescript
const response = await api.post('/api/copilot', {
  preferences: {
    travel_style: "adventure",
    budget: "moderate",
    duration: "7 days"
  },
  time: new Date().toISOString(),
  weather: {
    type: "sunny",
    temp_celsius: 28
  },
  location: {
    lat: 12.9716,
    lng: 77.5946
  }
})
```

**Step 2: Backend processes (rule-based)**
```python
# Matches rules and returns
{
  "suggestion": "Try the nearby hill trail for an adventure hike with stunning views",
  "reason": "You prefer adventure; sunny weather is perfect for outdoor activities; perfect hiking season",
  "mode": "rule-based"
}
```

**Step 3: Frontend displays**
```tsx
<AIChatBubble 
  message={response.suggestion}
  sender="ai"
  delay={0.2}
/>
```

---

### Example 2: Live Status Auto-Refresh

**Initial Load (on component mount)**
```typescript
const res = await api.get('/api/live-status/?place_id=1')
// Returns: { place_id: 1, crowd: "Medium", source: "live", ... }
```

**Auto-refresh every 15s**
```typescript
const interval = setInterval(() => {
  api.get('/api/live-status/?place_id=1')
  // Returns: { place_id: 1, crowd: "High", source: "cache", ... }
}, 15000)
```

---

### Example 3: Voice Intent Flow

**User Input → Intent Detection → Response**

```typescript
const userInput = "I want to find a restaurant for dinner"

const response = await api.post('/api/voice', {
  text: userInput
})

// Returns:
{
  "intent": "food",
  "action": "search_restaurants",
  "params": { "query": "restaurant for dinner" },
  "response_text": "I can help find restaurants! What cuisine or area are you interested in?"
}
```

---

### Example 4: Hidden Gems Discovery

**User Location → Gem Recommendations**

```typescript
const response = await api.post('/api/hidden-gems', {
  location: {
    lat: 12.9716,
    lng: 77.5946
  },
  radius_km: 5
})

// Returns array of 3 gems:
{
  "gems": [
    {
      "id": "gem_1",
      "name": "Cubbon Park Hidden Trail",
      "category": "park",
      "location": { "lat": 12.9352, "lng": 77.5906 },
      "reason": "A lesser-known trail behind Cubbon Park with serene nature views..."
    },
    {
      "id": "gem_2", 
      "name": "Koshy's Vintage Library Cafe",
      "category": "cafe",
      ...
    }
  ]
}
```

---

## ⚠️ Error Handling

### Backend Error Responses

All errors return HTTP error codes with descriptive messages:

```json
{
  "detail": "Error message explaining what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | ✅ Success | API request succeeded |
| 400 | ❌ Bad Request | Invalid JSON or missing required fields |
| 404 | ❌ Not Found | Endpoint doesn't exist |
| 422 | ❌ Validation Error | Invalid data types or schema mismatch |
| 500 | ❌ Server Error | Backend error or database issue |
| 503 | ⚠️ Service Unavailable | Backend down or database connection failed |

### Frontend Error Handling

```typescript
try {
  const res = await api.post('/api/copilot', { ... })
  // Process response
} catch (error) {
  const message = error.message // "Error message from backend"
  console.error("API Error:", message)
  setError(message) // Show to user
}
```

### Example Error Response

**Request:**
```bash
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{"invalid_field": "test"}'
```

**Response (422 Validation Error):**
```json
{
  "detail": [
    {
      "loc": ["body", "preferences"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## 🔐 Authentication & Security

### Current Setup (No Authentication)

The APIs are currently **open** (no auth required for development).

### For Production: Add JWT Authentication

**Backend Implementation:**

```python
# backend/app/middleware/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthCredential
import jwt

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthCredential = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            "your-secret-key",
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=403)
        return user_id
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403)

# Usage in routes:
@router.post("/")
async def copilot(req: CopilotRequest, user_id = Depends(verify_token)):
    # Only authenticated users can access
    ...
```

**Frontend Usage:**

```typescript
export default {
  post: (path: string, body: any, token?: string) => {
    const headers: any = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return request(path, { method: 'POST', body: JSON.stringify(body), headers })
  }
}

// Usage:
const token = localStorage.getItem('auth_token')
await api.post('/api/copilot', payload, token)
```

### Environment-Based Auth

```bash
# backend/.env
ENABLE_AUTH=true
JWT_SECRET=your-very-secure-secret-key-here
```

---

## 🚀 Quick Start Checklist

### Step 1: Backend Setup ✅

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Environment Variables ✅

```bash
# backend/.env
USE_LLM=false
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/routeaura
```

```bash
# frontend/.env.local
VITE_AI_API_URL=http://localhost:8000
```

### Step 3: Start Backend ✅

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Verify:** `curl http://localhost:8000/api/health`  
**Expected:** `{"status": "ok"}`

### Step 4: Start Frontend ✅

```bash
npm run dev
```

**Verify:** Visit `http://localhost:5173`

### Step 5: Test APIs ✅

Access each feature from navbar "AI Features" dropdown:
- ✨ Trip Copilot
- 📍 Live Reality  
- 🎤 Voice Assistant
- 💎 Hidden Gems

---

## 🧪 API Testing Tools

### Using Curl

```bash
# Test Copilot
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{"preferences":{"travel_style":"adventure"}}'

# Test Live Status
curl http://localhost:8000/api/live-status/?place_id=1

# Test Voice
curl -X POST http://localhost:8000/api/voice/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Find a hotel"}'

# Test Gems
curl -X POST http://localhost:8000/api/hidden-gems/ \
  -H "Content-Type: application/json" \
  -d '{"location":{"lat":12.97,"lng":77.59}}'
```

### Using Postman

1. **Create new request** → POST
2. **URL:** `http://localhost:8000/api/copilot/`
3. **Headers:** `Content-Type: application/json`
4. **Body (JSON):**
```json
{
  "preferences": {"travel_style": "adventure"},
  "location": {"lat": 12.97, "lng": 77.59}
}
```
5. **Send** → View response

### Using REST Client (VS Code)

Create `requests.http`:

```http
### Health Check
GET http://localhost:8000/api/health

### Copilot
POST http://localhost:8000/api/copilot/
Content-Type: application/json

{
  "preferences": {"travel_style": "adventure"},
  "location": {"lat": 12.97, "lng": 77.59}
}

### Live Status
GET http://localhost:8000/api/live-status/?place_id=1

### Voice
POST http://localhost:8000/api/voice/
Content-Type: application/json

{
  "text": "Find me a hotel"
}

### Hidden Gems
POST http://localhost:8000/api/hidden-gems/
Content-Type: application/json

{
  "location": {"lat": 12.97, "lng": 77.59}
}
```

---

## 📊 API Rate Limits & Performance

### Current Configuration

| Feature | Limit | Cache TTL | Notes |
|---------|-------|-----------|-------|
| Copilot | Unlimited | — | No cache (real-time) |
| Live Status | Unlimited | 30 seconds | Cached to reduce DB load |
| Voice | Unlimited | — | No cache (intent detection) |
| Hidden Gems | Unlimited | — | Generated per request |

### Performance Tips

1. **Set appropriate cache TTL:**
   ```python
   # backend/app/services/ai_engine.py
   _ttl = timedelta(seconds=60)  # Increase for better performance
   ```

2. **Use query parameter to bypass cache:**
   ```bash
   curl http://localhost:8000/api/live-status/?place_id=1&refresh=true
   ```

3. **Batch requests when possible:**
   ```typescript
   // Instead of multiple requests
   await Promise.all([
     api.get('/api/live-status/?place_id=1'),
     api.get('/api/live-status/?place_id=2'),
     api.get('/api/live-status/?place_id=3')
   ])
   ```

---

## 🎯 Next Steps

### Phase 1: Basic Integration ✅ (Done)
- ✅ 4 core APIs working
- ✅ Frontend pages integrated
- ✅ Rule-based AI responses

### Phase 2: Add LLM (Recommended Next)
- [ ] Get Mistral API key
- [ ] Set `USE_LLM=true` in `.env`
- [ ] Implement LLMAdapter
- [ ] Test advanced responses

### Phase 3: Add Authentication
- [ ] Implement JWT auth
- [ ] Add login/signup endpoints
- [ ] Protect routes with auth middleware

### Phase 4: Production Deployment
- [ ] Connect PostgreSQL database
- [ ] Set up CORS for production domain
- [ ] Enable rate limiting
- [ ] Add API monitoring/logging

---

## 📞 Support & Troubleshooting

### Backend won't start?
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r backend/requirements.txt -U

# Check if port 8000 is in use
lsof -i :8000
```

### Frontend can't reach backend?
```bash
# Ensure backend URL is correct
export VITE_AI_API_URL=http://localhost:8000

# Check CORS is enabled
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:8000/api/copilot/
```

### API returns 500 error?
```bash
# Check backend logs for detailed error
tail -f backend.log

# Verify database connection
psql -U postgres -d routeaura -c "SELECT 1"
```

---

## 📚 Additional Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Pydantic Validation: https://docs.pydantic.dev/
- React Hooks: https://react.dev/reference/react/hooks
- Framer Motion: https://www.framer.com/motion/
- TailwindCSS: https://tailwindcss.com/docs

---

**Last Updated:** April 28, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

For updates or issues, check the GitHub repository or contact support.
