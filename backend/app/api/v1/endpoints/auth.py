from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Body, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.repositories.user import UserRepository
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService


class ForgotPasswordRequest(BaseModel):
    email: str = Field(
        ...,
        min_length=6,
        max_length=320,
        pattern=r'^[^@\s]+@[^@\s]+\.[^@\s]+$'
    )


class ProfileUpdateRequest(BaseModel):
    current_email: str
    full_name: Optional[str] = None
    email: Optional[str] = None


class LoginResponse(TokenResponse):
    user: UserResponse

router = APIRouter()


def get_auth_service(session: AsyncSession = Depends(get_db)) -> AuthService:
    """Build an auth service using the injected database session."""
    user_repository = UserRepository(session)
    return AuthService(user_repository)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    """Register a new user account."""
    try:
        user = await auth_service.create_user(user_data)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        role=user.role,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.post("/login", response_model=LoginResponse)
async def login_user(
    credentials: UserLogin = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    """Authenticate a user and return a token together with user information."""
    user = await auth_service.authenticate(credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return LoginResponse(
        access_token="placeholder-token",
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            is_verified=user.is_verified,
            role=user.role,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ),
    )


@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest = Body(...),
) -> dict[str, str]:
    """Handle forgot password requests via email."""
    return {
        "message": "If the email exists, password reset instructions have been sent."
    }


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    payload: ProfileUpdateRequest = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    """Update user profile details."""
    try:
        updated = await auth_service.update_user(
            email=payload.current_email,
            full_name=payload.full_name,
            new_email=payload.email,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return UserResponse(
        id=updated.id,
        email=updated.email,
        full_name=updated.full_name,
        is_active=updated.is_active,
        is_verified=updated.is_verified,
        role=updated.role,
        created_at=updated.created_at,
        updated_at=updated.updated_at,
    )
