"""
app.db.session — Async SQLAlchemy engine and session factory.

Design decisions:
- Pool size 20 with max overflow 10: handles 30 concurrent connections
  which is suitable for a FastAPI app behind a load balancer.
- pool_pre_ping=True: detects stale connections before use (important
  when PostgreSQL restarts or network blips occur).
- expire_on_commit=False: objects remain usable after commit without
  needing a refresh — critical for returning data in FastAPI responses.
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core import settings

# ── Engine ────────────────────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG and not settings.is_production,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,       # Detect dead connections
    pool_recycle=3600,         # Recycle connections every hour
    connect_args={
        "server_settings": {
            "application_name": settings.APP_NAME,
        }
    },
)

# ── Session Factory ───────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)
