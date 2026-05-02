from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="RouteAura AI Services")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
from app.routes import copilot, live_status, voice, hidden_gems  # noqa: E402

app.include_router(copilot.router, prefix="/api/copilot")
app.include_router(live_status.router, prefix="/api/live-status")
app.include_router(voice.router, prefix="/api/voice")
app.include_router(hidden_gems.router, prefix="/api/hidden-gems")

@app.get("/api/health")
async def health():
    return {"status": "ok"}
