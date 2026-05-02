from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class UserActivity(Base):
    __tablename__ = "user_activity"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    location = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class LiveMetrics(Base):
    __tablename__ = "live_metrics"
    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, nullable=False)
    crowd_level = Column(String, nullable=True)
    noise_level = Column(String, nullable=True)
    waiting_time = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
