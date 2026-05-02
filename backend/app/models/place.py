from sqlalchemy import Column, Integer, String, JSON, Float
from app.db.database import Base

class Place(Base):
    __tablename__ = "places"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(JSON, nullable=True)
    category = Column(String, nullable=True)
