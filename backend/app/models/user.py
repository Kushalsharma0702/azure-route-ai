from sqlalchemy import Column, Integer, String, JSON
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    preferences = Column(JSON, nullable=True)
    budget = Column(Integer, nullable=True)
    travel_style = Column(String, nullable=True)
