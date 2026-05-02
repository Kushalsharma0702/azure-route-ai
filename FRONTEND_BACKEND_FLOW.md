# 📊 Frontend → Backend → AI Keys Flow Diagram

**Quick Reference:** Visual guide showing what frontend sends, what backend needs, and what AI keys to add

---

## 🔄 Complete Request/Response Flow

```
┌─────────────────┐
│  FRONTEND PAGES │
│  (React + TS)   │
└────────┬────────┘
         │
         ├─→ CopilotPage.tsx ──────┤
         ├─→ LiveStatusPage.tsx ────┤
         ├─→ VoiceAssistant.tsx ────┼──→ api.ts (API Client)
         └─→ HiddenGems.tsx ────────┤
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │  API CLIENT          │
                         │  (src/services/api.ts)
                         │                      │
                         │ - auto-detect URL    │
                         │ - add headers        │
                         │ - handle errors      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ↓               ↓               ↓
            ╔═══════════════╗  ╔══════════════╗  ╔════════════╗
            ║    HTTP       ║  ║    HTTP      ║  ║   HTTP     ║
            ║    GET/       ║  ║   POST       ║  ║   POST     ║
            ║    POST       ║  ║              ║  ║            ║
            ║               ║  ║              ║  ║            ║
            ║ LOCALHOST:    ║  ║ LOCALHOST:   ║  ║LOCALHOST:  ║
            ║    8000       ║  ║     8000     ║  ║    8000    ║
            ╚═══════════════╝  ╚══════════════╝  ╚════════════╝
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ↓
                      ┌────────────────────────────┐
                      │  FASTAPI BACKEND           │
                      │  (Python)                  │
                      │  backend/app/main.py       │
                      │  Port: 8000                │
                      │  CORS: Enabled             │
                      └────────┬───────────────────┘
                               │
                ┌──────────────┼──────────────┬─────────────┐
                │              │              │             │
                ↓              ↓              ↓             ↓
        ┌───────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────┐
        │  /api/copilot │ │/api/live-    │ │/api/voice│ │/api/    │
        │               │ │status        │ │          │ │hidden-  │
        │ POST          │ │ GET          │ │ POST     │ │gems     │
        │               │ │              │ │          │ │ POST    │
        └───────┬───────┘ └──────┬──────┘ └────┬─────┘ └────┬────┘
                │                │              │            │
                ↓                ↓              ↓            ↓
        ┌───────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────┐
        │ copilot.py    │ │live_status.py│ │voice.py  │ │hidden_  │
        │ ROUTE         │ │ ROUTE        │ │ ROUTE    │ │gems.py  │
        │               │ │              │ │          │ │ ROUTE   │
        └───────┬───────┘ └──────┬──────┘ └────┬─────┘ └────┬────┘
                │                │              │            │
                ↓                ↓              ↓            ↓
        ┌───────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────┐
        │SERVICES/      │ │SERVICES/     │ │SERVICES/ │ │SERVICES/│
        │ai_engine.py   │ │ai_engine.py  │ │voice_    │ │ai_      │
        │               │ │ LiveStatus   │ │engine.py │ │engine.py│
        │SimpleAI OR    │ │ENGINE        │ │ Intent   │ │Hidden   │
        │LLMAdapter     │ │ .get_status()│ │Detection │ │GemsEngi │
        └───────┬───────┘ └──────┬──────┘ └────┬─────┘ └────┬────┘
                │                │              │            │
                │                │              │            │
                │         [Cache 30s TTL]       │            │
                │                │              │            │
                └────────────────┴──────────────┴────────────┘
                                    │
                                    ↓
                        ┌──────────────────────┐
                        │ AI ENGINE SELECTION  │
                        │                      │
                        │ USE_LLM = true/false │
                        │                      │
                        ├─→ Rule-Based AI      │
                        │   (SimpleAI)         │
                        │   [INSTANT]          │
                        │                      │
                        └─→ LLM Mode           │
                            (LLMAdapter)       │
                            [1-2 seconds]      │
                        ┌──────────────────────┐
                            │
                ┌───────────┬─┴────────────┬──────────────┐
                │           │              │              │
                ↓           ↓              ↓              ↓
        ┌─────────────┐ ┌──────┐ ┌──────────────┐ ┌────────────┐
        │ Mistral AI  │ │OpenAI│ │ Hugging Face │ │(Optional)  │
        │             │ │      │ │              │ │ Local LLM  │
        │ $ FAST      │ │ $$$ │ │ FREE         │ │ FREE       │
        │ $ MED COST  │ │ HIGH│ │ MED QUALITY  │ │ BEST LOCAL │
        │ $$ QUALITY  │ │BEST │ │ SLOW         │ │ PRIVACY    │
        └─────┬───────┘ └──┬───┘ └──────┬───────┘ └────┬───────┘
              │            │            │              │
              └────────────┼────────────┼──────────────┘
                           │
                   ┌───────┴──────────┐
                   │  API KEY NEEDED  │
                   │  (From .env)     │
                   │                  │
                   │ MISTRAL_API_KEY  │
                   │ OPENAI_API_KEY   │
                   │ HUGGINGFACE_KEY  │
                   └───────┬──────────┘
                           │
                           ↓
            ┌──────────────────────────────┐
            │  EXTERNAL AI SERVICE         │
            │  (Cloud API Call)            │
            │                              │
            │ Temperature: 0.7             │
            │ Max Tokens: 300              │
            │ Timeout: 5s                  │
            └──────────┬───────────────────┘
                       │
                       ↓
            ┌──────────────────────────────┐
            │  AI RESPONSE                 │
            │  (Intelligent Suggestion)    │
            │                              │
            │ suggestion: "Visit..."       │
            │ reason: "AI analysis..."     │
            │ mode: "llm"                  │
            └──────────┬───────────────────┘
                       │
                       ↓
            ┌──────────────────────────────┐
            │  RETURN JSON TO FRONTEND     │
            │  (HTTP 200)                  │
            └──────────┬───────────────────┘
                       │
                       ↓
            ┌──────────────────────────────┐
            │  FRONTEND DISPLAYS           │
            │  (React State Update)        │
            │                              │
            │ - Animated Message           │
            │ - Show LLM Response          │
            │ - Update UI                  │
            │ - Store in Chat History      │
            └──────────────────────────────┘
```

---

## 📤 What Each Frontend Page Sends

### 1️⃣ CopilotPage.tsx
```json
POST /api/copilot
{
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
**Needs:** LLM Key (Mistral/OpenAI/HF)  
**Returns:** Travel suggestion with AI reasoning

---

### 2️⃣ LiveStatusPage.tsx
```
GET /api/live-status/?place_id=1
```
**Needs:** None (no external API)  
**Returns:** Crowd/noise/wait metrics (cached 30s)  
**Note:** Auto-refreshes every 15s

---

### 3️⃣ VoiceAssistant.tsx
```json
POST /api/voice
{
  "text": "Find me a hotel in Bangalore"
}
```
**Needs:** None (intent detection only)  
**Returns:** Intent, action, extracted params  
**Note:** Keyword-based pattern matching

---

### 4️⃣ HiddenGems.tsx
```json
POST /api/hidden-gems
{
  "location": {
    "lat": 12.97,
    "lng": 77.59
  },
  "radius_km": 10
}
```
**Needs:** None (rule-based selection)  
**Returns:** Array of hidden gem places  
**Note:** Can be enhanced with LLM later

---

## 🔐 Environment Variables Setup

### Backend (.env)

```bash
# ============= BASIC SETUP =============
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=false

# ============= DATABASE (Optional) =============
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/routeaura

# ============= AI CONFIGURATION =============
USE_LLM=false                              # Change to 'true' to enable

# ============= AI API KEYS =============
# Option 1: Mistral (RECOMMENDED)
MISTRAL_API_KEY=sk_your_mistral_key_here

# Option 2: OpenAI
OPENAI_API_KEY=sk_your_openai_key_here

# Option 3: Hugging Face
HUGGINGFACE_API_KEY=hf_your_token_here

# ============= LLM TUNING (Optional) =============
LLM_TEMPERATURE=0.7                        # 0-2, default 0.7
LLM_MAX_TOKENS=300                         # Response length
PRIMARY_LLM=mistral                        # Which to use if multiple
```

### Frontend (.env.local)

```bash
# ============= BACKEND API =============
VITE_AI_API_URL=http://localhost:8000

# ============= OPTIONAL CONFIG =============
VITE_LOG_LEVEL=debug
VITE_CACHE_TTL=30000
```

### Docker (.env)

```bash
# Used by docker-compose.yml
BACKEND_PORT=8000
FRONTEND_PORT=5173
DATABASE_URL=postgresql://user:password@db:5432/routeaura

# Same AI keys as backend
MISTRAL_API_KEY=sk_your_key
OPENAI_API_KEY=sk_your_key
HUGGINGFACE_API_KEY=hf_your_key
```

---

## 🔑 API Key Quick Reference

### Get API Keys

| Provider | Link | Key Format | Cost |
|----------|------|-----------|------|
| Mistral | https://console.mistral.ai | `sk-...` | $0.14/1M in |
| OpenAI | https://platform.openai.com/api-keys | `sk-...` | $0.5/1M in |
| Hugging Face | https://huggingface.co/settings/tokens | `hf_...` | FREE |

### Add to Backend

```bash
# 1. Create/update backend/.env file
cat > backend/.env << EOF
USE_LLM=true
MISTRAL_API_KEY=sk_your_actual_key_here
EOF

# 2. Verify it's set
echo $MISTRAL_API_KEY

# 3. Restart backend
cd backend
uvicorn app.main:app --reload
```

### Test It Works

```bash
# Terminal 1: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Test with curl
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{"preferences":{"travel_style":"adventure"}}'

# Should return:
# {
#   "suggestion": "AI generated response here...",
#   "reason": "AI-generated using mistral",
#   "mode": "llm"
# }
```

---

## ⚡ Quick Setup Script

### One-Command Setup

```bash
#!/bin/bash

# Setup backends and keys
echo "=== RouteAura AI Setup ==="

# 1. Backend environment
cd backend
cat > .env << EOF
USE_LLM=true
MISTRAL_API_KEY=${MISTRAL_API_KEY:-sk_your_key_here}
OPENAI_API_KEY=${OPENAI_API_KEY:-sk_your_key_here}
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/routeaura
EOF
echo "✓ Backend .env created"

# 2. Frontend environment
cd ../
cat > .env.local << EOF
VITE_AI_API_URL=http://localhost:8000
EOF
echo "✓ Frontend .env.local created"

# 3. Install backend dependencies
cd backend
pip install -r requirements.txt
echo "✓ Dependencies installed"

# 4. Start backend
echo "✓ Starting backend on port 8000..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# 5. Start frontend (in new terminal would be better, but for script:)
cd ../
echo "✓ Frontend ready at http://localhost:5173"
echo "✓ Backend ready at http://localhost:8000"
echo ""
echo "Run in another terminal:"
echo "  cd frontend && npm run dev"
```

---

## 📋 Configuration Checklist

### Before Running Backend

- [ ] **API Key Obtained**
  - [ ] Mistral API key from console.mistral.ai
  - [ ] OR OpenAI key from platform.openai.com
  - [ ] OR Hugging Face token

- [ ] **Backend .env Created**
  ```bash
  backend/.env exists
  USE_LLM=true
  [YOUR_KEY_HERE]_API_KEY=sk_your_actual_key
  ```

- [ ] **Frontend .env.local Created**
  ```bash
  .env.local exists
  VITE_AI_API_URL=http://localhost:8000
  ```

- [ ] **Dependencies Installed**
  ```bash
  pip install -r backend/requirements.txt
  npm install  # frontend
  ```

- [ ] **Backend Starts Without Errors**
  ```bash
  cd backend && uvicorn app.main:app --reload
  # Should see: "Uvicorn running on http://0.0.0.0:8000"
  ```

- [ ] **Frontend Connects to Backend**
  ```bash
  npm run dev
  # Should see: "VITE v4.x.x  ready in XXX ms"
  ```

- [ ] **API Works**
  ```bash
  curl http://localhost:8000/api/health
  # Returns: {"status": "ok"}
  ```

- [ ] **LLM Integration Works**
  ```bash
  # Make request to copilot endpoint
  curl -X POST http://localhost:8000/api/copilot/ ...
  # Returns: {"mode": "llm", ...}  # Should say "llm" not "rule-based"
  ```

---

## 🚀 Production Deployment

### Step 1: Set Production API Key

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name routeaura/mistral-api-key \
  --secret-string "sk_your_production_key"

# Then in Lambda/EC2/Docker:
export MISTRAL_API_KEY=$(aws secretsmanager get-secret-value \
  --secret-id routeaura/mistral-api-key | jq -r .SecretString)
```

### Step 2: Update Backend URL

```bash
# In production, set frontend API URL to production backend
export VITE_AI_API_URL=https://api.routeaura.com

# In Vercel dashboard:
# - Set environment variable VITE_AI_API_URL
# - Redeploy
```

### Step 3: Enable CORS for Production

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://routeaura.com"],  # Production URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Set Budget Limits (Important!)

```bash
# Mistral: https://console.mistral.ai/billing
# Set $50/month limit

# OpenAI: https://platform.openai.com/account/billing/limits
# Set $10/month hard limit
```

---

## 📊 Documentation Files Created

| File | Purpose | Key Info |
|------|---------|----------|
| **API_REFERENCE_COMPLETE.md** | Full API docs | All endpoints, request/response |
| **AI_KEYS_SETUP_GUIDE.md** | AI key setup | Step-by-step for each provider |
| **FRONTEND_BACKEND_FLOW.md** | This file | Visual diagrams & quick ref |

---

## 💡 Common Issues & Solutions

### Issue: "Invalid API Key"
```bash
# Solution: Verify key is actually set
echo $MISTRAL_API_KEY  # Should print
grep MISTRAL backend/.env  # Should show
```

### Issue: "Frontend can't reach backend"
```bash
# Solution: Check backend URL
echo $VITE_AI_API_URL  # Should be http://localhost:8000
curl http://localhost:8000/api/health  # Should work
```

### Issue: "LLM responses are slow"
```bash
# Solution: Increase cache TTL
LLM_CACHE_TTL=300  # From 30s to 5min
```

### Issue: "High API bills"
```bash
# Solution: Implement rate limiting
MAX_REQUESTS_PER_USER=100  # Per day
CACHE_RESPONSES=true  # Cache identical requests
```

---

## 🎯 Next: What to Do Now

### 1. **Get API Key Now** (5 min)
   - Pick provider: Mistral (recommended)
   - Sign up: console.mistral.ai
   - Generate key
   - Copy & save safely

### 2. **Add to Backend** (2 min)
   ```bash
   cd backend
   echo "MISTRAL_API_KEY=sk_your_key" >> .env
   echo "USE_LLM=true" >> .env
   ```

### 3. **Restart Backend** (1 min)
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

### 4. **Test It** (2 min)
   ```bash
   curl -X POST http://localhost:8000/api/copilot/ \
     -H "Content-Type: application/json" \
     -d '{"preferences":{"travel_style":"adventure"}}'
   ```

### 5. **Try in Frontend** (1 min)
   - Open http://localhost:5173
   - Click "AI Features" → "Trip Copilot"
   - Type a message
   - See intelligent AI responses! 🎉

---

## 📞 Support

**Issues?**
1. Check backend logs: `tail -f backend.log`
2. Check API key: `echo $MISTRAL_API_KEY`
3. Check connection: `curl http://localhost:8000/api/health`
4. Read documentation file for details

**Ready to deploy?**
1. Update production API key securely (Secrets Manager)
2. Update backend URL to production
3. Enable authentication (JWT)
4. Set rate limits
5. Monitor costs & usage

---

**Version:** 1.0  
**Last Updated:** April 28, 2026  
**Status:** ✅ Ready to Use
