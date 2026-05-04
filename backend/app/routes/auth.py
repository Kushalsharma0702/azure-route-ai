"""
app.routes.auth — Authentication endpoints with OTP support.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user
from app.core.security import TokenPayload
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(None, max_length=200)
    phone: str = Field(None, max_length=20)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class SendOTPRequest(BaseModel):
    email: EmailStr

class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/send-otp", status_code=200)
async def send_otp(req: SendOTPRequest):
    from app.services.otp_service import OTPService
    from fastapi import HTTPException
    try:
        otp = await OTPService.generate_otp(req.email)
        return {"message": "OTP sent successfully", "email": req.email, "otp": otp}
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))


@router.post("/signup", status_code=201)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.signup(req.email, req.password, req.name, req.phone)


@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.verify_otp(req.email, req.otp)


@router.post("/resend-otp")
async def resend_otp(req: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.resend_otp(req.email)


@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.login(req.email, req.password)


@router.post("/refresh")
async def refresh(req: RefreshRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.refresh_token(req.refresh_token)


class PreferencesUpdateRequest(BaseModel):
    preferences: dict

@router.put("/preferences")
async def update_preferences(
    req: PreferencesUpdateRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    return await service.update_preferences(current_user.user_id, req.preferences)

@router.get("/me")
async def me(
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    return await service.get_profile(current_user.user_id)
