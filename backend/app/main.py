"""
app.main — FastAPI application factory with lifespan management.

This is the production entry point. It:
1. Initializes logging
2. Creates the FastAPI app with lifespan (startup/shutdown hooks)
3. Registers all routers
4. Adds middleware (CORS, exception handlers)
5. Connects Redis and DB on startup, closes on shutdown

Run with: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core import settings
from app.core.exceptions import AppException
from app.cache.redis_client import get_redis, close_redis
from app.utils.logging import setup_logging

# Initialize logging before anything else
setup_logging()
logger = logging.getLogger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan: startup and shutdown hooks.

    - Startup: connect to Redis, log config
    - Shutdown: close Redis pool, cleanup
    """
    # ── Startup ───────────────────────────────────────────
    logger.info("Starting %s [env=%s]", settings.APP_NAME, settings.APP_ENV)

    # Initialize Redis connection pool
    redis = await get_redis()
    if redis:
        logger.info("Redis connected")
    else:
        logger.warning("Redis not available — caching disabled")

    yield

    # ── Shutdown ──────────────────────────────────────────
    logger.info("Shutting down %s", settings.APP_NAME)
    await close_redis()


# ── App Factory ───────────────────────────────────────────────
app = FastAPI(
    title="RouteAura AI Travel Assistant",
    description="Production-ready AI-powered travel assistant backend",
    version="2.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# ── CORS Middleware ───────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Exception Handlers ───────────────────────────────────────
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Map domain exceptions to HTTP responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "detail": exc.detail,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions (500)."""
    logger.exception("Unhandled exception: %s", str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else None,
        },
    )


# ── Register Routers ─────────────────────────────────────────
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.copilot import router as copilot_router
from app.routes.voice import router as voice_router
from app.routes.hidden_gems import router as hidden_gems_router
from app.routes.live_status import router as travel_router
from app.routes.payments import router as payments_router
from app.routes.activity import router as activity_router
from app.routes.hotel import router as hotel_router
from app.routes.hotels import router as hotels_router
from app.routes.packages import router as packages_router
from app.routes.package_inventory import router as package_inventory_router
from app.routes.feedback import router as feedback_router
from app.routes.weather import router as weather_router
from app.routes.trip import router as trip_router
from app.routes.gems_data import router as gems_data_router

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(copilot_router)
app.include_router(voice_router)
app.include_router(hidden_gems_router)
app.include_router(travel_router)
app.include_router(payments_router)
app.include_router(activity_router)
app.include_router(hotel_router)
app.include_router(hotels_router)
app.include_router(packages_router)
app.include_router(package_inventory_router)
app.include_router(feedback_router)
app.include_router(weather_router)
app.include_router(trip_router)
app.include_router(gems_data_router)

logger.info(
    "Registered %d routes",
    len([r for r in app.routes if hasattr(r, "methods")]),
)
