# RouteAura AI Backend

FastAPI backend for RouteAura AI features (Trip Copilot, Live Reality Layer, Voice Assistant, Hidden Gems).

Run locally:

1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Provide `DATABASE_URL` in `.env` (optional for now). Run app:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API endpoints:
- `POST /api/copilot` - Trip Copilot
- `GET /api/live-status?place_id=1` - Live reality layer
- `POST /api/voice` - Voice assistant (simulated STT)
- `POST /api/hidden-gems` - Hidden gems

Switch to LLM mode by setting `USE_LLM=true` in environment.
