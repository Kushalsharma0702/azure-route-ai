# RouteAura AI Features Integration Guide

Your AI-powered travel intelligence module is now fully integrated into RouteAura! 🎉

## 🎯 What's New

4 AI features are now available in the navigation bar under **"AI Features"** dropdown:

1. **Trip Copilot** (`/copilot`) - AI-powered personalized travel suggestions
2. **Live Reality Layer** (`/live-status`) - Real-time crowd, noise & wait times  
3. **Voice Travel Assistant** (`/voice-assistant`) - Chat with AI about travel needs
4. **Hidden Gems** (`/hidden-gems`) - Discover underrated travel destinations

## 🚀 How to Run

### 1. Start the Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run on:** `http://localhost:8000`

✅ Test health: `curl http://localhost:8000/api/health`

### 2. Start the Frontend (React + Vite)

```bash
# From project root
export VITE_AI_API_URL=http://localhost:8000
npm run dev
# or
pnpm dev
```

**Frontend will run on:** `http://localhost:5173` (or displayed URL)

### 3. Access AI Features

- **In Browser:** Click `AI Features` dropdown in navbar
- **Direct URLs:**
  - http://localhost:5173/copilot
  - http://localhost:5173/live-status
  - http://localhost:5173/voice-assistant
  - http://localhost:5173/hidden-gems

## 📁 File Structure

### Backend
```
backend/
├── app/
│   ├── main.py                 # FastAPI app + routes
│   ├── routes/
│   │   ├── copilot.py          # Trip Copilot endpoint
│   │   ├── live_status.py      # Live Reality endpoint
│   │   ├── voice.py            # Voice Assistant endpoint
│   │   └── hidden_gems.py      # Hidden Gems endpoint
│   ├── services/
│   │   ├── ai_engine.py        # AI logic (rule-based + LLM adapter)
│   │   ├── copilot_service.py  # Copilot logic
│   │   └── voice_engine.py     # Voice intent detection
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   └── db/
│       └── database.py         # DB connection & session
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
└── README.md                  # Backend docs
```

### Frontend
```
src/
├── pages/
│   ├── CopilotPage.tsx        # Trip Copilot page
│   ├── LiveStatusPage.tsx     # Live Reality page
│   ├── VoiceAssistant.tsx     # Voice Assistant page
│   └── HiddenGems.tsx         # Hidden Gems page
├── components/
│   ├── CopilotWidget.tsx      # Copilot input & suggestion UI
│   ├── LiveStatusCard.tsx     # Real-time metrics card
│   ├── VoiceButton.tsx        # Voice chat interface
│   ├── GemsCard.tsx           # Hidden gems listing
│   └── Navbar.tsx             # Updated with AI Features dropdown
└── services/
    └── api.ts                 # API client (auto-detects backend URL)
```

### Database Schema
```
sql/
└── schema.sql                 # PostgreSQL tables
    ├── users
    ├── places
    ├── live_metrics
    └── user_activity
```

## 🔌 API Endpoints

### 1. Trip Copilot
**POST** `/api/copilot/`  
Generates AI suggestions with reasoning.

```bash
curl -X POST http://localhost:8000/api/copilot/ \
  -H "Content-Type: application/json" \
  -d '{"preferences":{"travel_style":"adventure"},"weather":{"type":"rain"}}'
```

**Response:**
```json
{
  "suggestion": "Visit indoor cafes and museums",
  "reason": "Rain expected in your area; you prefer adventure activities",
  "mode": "rule-based"
}
```

### 2. Live Reality Layer
**GET** `/api/live-status/?place_id=1`  
Returns live crowd, noise, and wait time metrics.

```bash
curl http://localhost:8000/api/live-status/?place_id=1
```

**Response:**
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

### 3. Voice Assistant
**POST** `/api/voice/`  
Detects intent from text input (simulates STT).

```bash
curl -X POST http://localhost:8000/api/voice/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Find me a hotel in Bangalore"}'
```

**Response:**
```json
{
  "intent": "hotel",
  "action": "search_hotels",
  "params": {"query": "Find me a hotel in Bangalore"},
  "response_text": "I can help find hotels — what city or dates?"
}
```

### 4. Hidden Gems
**POST** `/api/hidden-gems/`  
Returns underrated places with explanations.

```bash
curl -X POST http://localhost:8000/api/hidden-gems/ \
  -H "Content-Type: application/json" \
  -d '{"location":{"lat":12.97,"lng":77.59}}'
```

**Response:**
```json
{
  "gems": [
    {
      "id": "gem_1",
      "name": "Local Hidden Spot 1",
      "category": "park",
      "location": {"lat": 12.971, "lng": 77.589},
      "reason": "Most tourists miss this because..."
    }
  ]
}
```

## 🎨 UI Features

- **Responsive Design:** Works on all screen sizes
- **Live Updates:** Live Status auto-refreshes every 15 seconds
- **Glassmorphism Theme:** Matches RouteAura's existing design
- **Error Handling:** Graceful error messages for API failures
- **Loading States:** Loading indicators during API calls
- **Color-coded Metrics:** Green (Low), Yellow (Medium), Red (High)

## 🧠 AI Engine Modes

### Current: Rule-based (Default)
Simple pattern matching + static suggestions.

### Future: LLM Mode
Switch to advanced AI by setting environment variable:

```bash
export USE_LLM=true
```

Then implement LLM adapter in `backend/app/services/ai_engine.py`:

```python
# Example with Mistral
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

## 🗄️ Database Setup (Optional)

If using PostgreSQL for persistence:

```bash
# Create database
createdb routeaura

# Load schema
psql routeaura < sql/schema.sql

# Set connection string
export DATABASE_URL="postgresql://user:password@localhost:5432/routeaura"
```

## 🔐 Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/routeaura
USE_LLM=false
MISTRAL_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

**Frontend (.env.local)**
```
VITE_AI_API_URL=http://localhost:8000
```

## ⚡ Performance Notes

- **Live Status:** Cached for 30 seconds (configurable)
- **Hidden Gems:** Generated on-the-fly
- **Copilot:** Rule-based (instant) or LLM (depends on model)
- **Voice:** Intent detection (instant)

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version (3.8+)
python --version

# Reinstall dependencies
pip install -r backend/requirements.txt -U

# Check port 8000 is free
lsof -i :8000
```

### Frontend can't reach backend
```bash
# Ensure backend URL is correct
export VITE_AI_API_URL=http://localhost:8000

# Check CORS is enabled (should be in main.py)
curl -H "Origin: http://localhost:5173" http://localhost:8000/api/health
```

### TypeScript errors
```bash
# Rebuild and clear cache
npm install
npm run build
```

## 📊 Next Steps

1. **Database Integration:** Uncomment SQLAlchemy models and connect to PostgreSQL
2. **LLM Integration:** Swap rule-based logic for Mistral/OpenAI
3. **Real-time Updates:** Add WebSocket for live metrics push-updates
4. **User Preferences:** Store travel style & preferences per user
5. **Analytics:** Track which suggestions users prefer
6. **Rate Limiting:** Add API rate limiting for production

## 🎯 Production Deployment

### Backend (Example: AWS EC2)
```bash
# Use gunicorn instead of uvicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app

# Or Docker
docker build -t routeaura-ai-backend .
docker run -p 8000:8000 -e DATABASE_URL=... routeaura-ai-backend
```

### Frontend (Example: Vercel)
```bash
# Already deployed at https://routeaura.vercel.app
# Update VITE_AI_API_URL to production backend
vercel deploy --prod
```

## 📚 Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- AsyncPG (PostgreSQL driver)
- Pydantic (validation)

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion (animations)

**Database:**
- PostgreSQL (optional)
- In-memory cache (default)

## 🙌 Support

For issues or feature requests:
- Check logs: `tail -f /path/to/logs`
- Report: GitHub Issues
- Contact: support@routeaura.com

---

**Ready to explore?** Start both servers and visit `/copilot` to begin! 🚀
