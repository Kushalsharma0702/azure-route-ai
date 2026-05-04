"""
app.schemas.auth — Authentication request/response schemas.

Strict validation on passwords and emails to prevent garbage data
from reaching the service layer.
"""

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Password must be 8-128 characters",
    )

    model_config = {"json_schema_extra": {"examples": [{"email": "user@example.com", "password": "SecureP@ss1"}]}}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserProfileResponse(BaseModel):
    id: str
    email: str
    role: str
    preferences: dict = {}
    created_at: str

    model_config = {"from_attributes": True}
