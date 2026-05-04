"""
app.routes.feedback — Hotel Feedback / Live Reality Layer API.

Endpoints:
  POST /api/v1/feedback           — Submit feedback for a hotel stay
  GET  /api/v1/feedback           — List all feedback (optional ?hotel_id=)
  GET  /api/v1/feedback/score/:id — Get aggregate score for a hotel
  GET  /api/v1/feedback/dashboard — Dashboard stats for Live Reality
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel, Field
from typing import Optional, List

from app.core.dependencies import get_db

router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])


class FeedbackCreate(BaseModel):
    hotel_id: int
    hotel_name: str
    booking_id: Optional[int] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    overall_score: int = Field(..., ge=1, le=10)
    cleanliness_score: Optional[int] = Field(None, ge=1, le=10)
    service_score: Optional[int] = Field(None, ge=1, le=10)
    amenities_score: Optional[int] = Field(None, ge=1, le=10)
    location_score: Optional[int] = Field(None, ge=1, le=10)
    value_score: Optional[int] = Field(None, ge=1, le=10)
    promised_amenities: Optional[List[str]] = []
    delivered_amenities: Optional[List[str]] = []
    missing_amenities: Optional[List[str]] = []
    review_text: Optional[str] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    would_recommend: Optional[bool] = True
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None


@router.post("", status_code=201)
async def create_feedback(data: FeedbackCreate, db: AsyncSession = Depends(get_db)):
    """Submit hotel feedback."""
    result = await db.execute(
        text("""
            INSERT INTO hotel_feedback
                (user_id, user_name, user_email, hotel_id, hotel_name, booking_id,
                 check_in, check_out, overall_score, cleanliness_score, service_score,
                 amenities_score, location_score, value_score,
                 promised_amenities, delivered_amenities, missing_amenities,
                 review_text, pros, cons, would_recommend)
            VALUES
                (:user_id, :user_name, :user_email, :hotel_id, :hotel_name, :booking_id,
                 :check_in, :check_out, :overall_score, :cleanliness_score, :service_score,
                 :amenities_score, :location_score, :value_score,
                 :promised_amenities, :delivered_amenities, :missing_amenities,
                 :review_text, :pros, :cons, :would_recommend)
            RETURNING id
        """),
        {
            "user_id": data.user_id,
            "user_name": data.user_name,
            "user_email": data.user_email,
            "hotel_id": data.hotel_id,
            "hotel_name": data.hotel_name,
            "booking_id": data.booking_id,
            "check_in": data.check_in,
            "check_out": data.check_out,
            "overall_score": data.overall_score,
            "cleanliness_score": data.cleanliness_score,
            "service_score": data.service_score,
            "amenities_score": data.amenities_score,
            "location_score": data.location_score,
            "value_score": data.value_score,
            "promised_amenities": data.promised_amenities or [],
            "delivered_amenities": data.delivered_amenities or [],
            "missing_amenities": data.missing_amenities or [],
            "review_text": data.review_text,
            "pros": data.pros,
            "cons": data.cons,
            "would_recommend": data.would_recommend,
        }
    )
    await db.commit()
    row = result.fetchone()
    return {"id": row[0], "message": "Feedback submitted successfully"}


@router.get("")
async def list_feedback(hotel_id: Optional[int] = Query(None), db: AsyncSession = Depends(get_db)):
    """List feedback, optionally filtered by hotel_id."""
    if hotel_id:
        result = await db.execute(
            text("SELECT * FROM hotel_feedback WHERE hotel_id = :hid ORDER BY created_at DESC"),
            {"hid": hotel_id}
        )
    else:
        result = await db.execute(
            text("SELECT * FROM hotel_feedback ORDER BY created_at DESC LIMIT 100")
        )
    rows = result.mappings().all()
    return [dict(r) for r in rows]


@router.get("/score/{hotel_id}")
async def get_hotel_score(hotel_id: int, db: AsyncSession = Depends(get_db)):
    """Get aggregate score for a hotel (used during booking to show reality score)."""
    result = await db.execute(
        text("""
            SELECT
                COUNT(*) as total_reviews,
                ROUND(AVG(overall_score)::numeric, 1) as avg_overall,
                ROUND(AVG(cleanliness_score)::numeric, 1) as avg_cleanliness,
                ROUND(AVG(service_score)::numeric, 1) as avg_service,
                ROUND(AVG(amenities_score)::numeric, 1) as avg_amenities,
                ROUND(AVG(location_score)::numeric, 1) as avg_location,
                ROUND(AVG(value_score)::numeric, 1) as avg_value,
                ROUND(
                    (COUNT(*) FILTER (WHERE would_recommend = true)::numeric /
                     NULLIF(COUNT(*), 0)::numeric) * 100, 0
                ) as recommend_pct
            FROM hotel_feedback
            WHERE hotel_id = :hid
        """),
        {"hid": hotel_id}
    )
    row = result.mappings().first()
    if not row or row["total_reviews"] == 0:
        return {"hotel_id": hotel_id, "total_reviews": 0, "avg_overall": None, "message": "No reviews yet"}
    return {
        "hotel_id": hotel_id,
        "total_reviews": row["total_reviews"],
        "avg_overall": float(row["avg_overall"]) if row["avg_overall"] else None,
        "avg_cleanliness": float(row["avg_cleanliness"]) if row["avg_cleanliness"] else None,
        "avg_service": float(row["avg_service"]) if row["avg_service"] else None,
        "avg_amenities": float(row["avg_amenities"]) if row["avg_amenities"] else None,
        "avg_location": float(row["avg_location"]) if row["avg_location"] else None,
        "avg_value": float(row["avg_value"]) if row["avg_value"] else None,
        "recommend_pct": float(row["recommend_pct"]) if row["recommend_pct"] else None,
    }


@router.get("/dashboard")
async def feedback_dashboard(db: AsyncSession = Depends(get_db)):
    """Dashboard stats for Live Reality Layer."""
    # Per-hotel aggregates
    hotels_result = await db.execute(
        text("""
            SELECT
                hotel_id,
                hotel_name,
                COUNT(*) as total_reviews,
                ROUND(AVG(overall_score)::numeric, 1) as avg_score,
                ROUND(AVG(cleanliness_score)::numeric, 1) as avg_cleanliness,
                ROUND(AVG(service_score)::numeric, 1) as avg_service,
                ROUND(AVG(amenities_score)::numeric, 1) as avg_amenities,
                ROUND(
                    (COUNT(*) FILTER (WHERE would_recommend)::numeric /
                     NULLIF(COUNT(*), 0)::numeric) * 100, 0
                ) as recommend_pct
            FROM hotel_feedback
            GROUP BY hotel_id, hotel_name
            ORDER BY avg_score DESC
        """)
    )
    hotels = [dict(r) for r in hotels_result.mappings().all()]

    # Global stats
    global_result = await db.execute(
        text("""
            SELECT
                COUNT(*) as total_reviews,
                COUNT(DISTINCT hotel_id) as hotels_reviewed,
                ROUND(AVG(overall_score)::numeric, 1) as platform_avg
            FROM hotel_feedback
        """)
    )
    g = global_result.mappings().first()

    # Recent reviews
    recent_result = await db.execute(
        text("""
            SELECT id, hotel_name, overall_score, review_text, user_name, 
                   missing_amenities, created_at
            FROM hotel_feedback
            ORDER BY created_at DESC
            LIMIT 10
        """)
    )
    recent = [dict(r) for r in recent_result.mappings().all()]

    return {
        "global": {
            "total_reviews": g["total_reviews"] if g else 0,
            "hotels_reviewed": g["hotels_reviewed"] if g else 0,
            "platform_avg": float(g["platform_avg"]) if g and g["platform_avg"] else 0,
        },
        "hotels": hotels,
        "recent_reviews": recent,
    }
