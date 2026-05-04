"""
app.db.base — SQLAlchemy declarative base.

Single Base instance shared by all models. Separated from session.py
to avoid circular imports (models import Base, session imports engine).
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.

    Using SQLAlchemy 2.0 DeclarativeBase (class-based) instead of the
    legacy declarative_base() function for better type checking and
    IDE support.
    """
    pass
