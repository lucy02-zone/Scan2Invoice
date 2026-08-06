from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class UserBase(BaseModel):
    """Shared user schema fields."""

    email: str
    full_name: str = Field(min_length=1, max_length=255)

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        return value.strip()


class UserCreate(UserBase):
    """Schema for creating a new user."""

    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Schema for user login requests."""

    email: str
    password: str = Field(min_length=8, max_length=128)


class UserResponse(UserBase):
    """Schema for returning a user through the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    is_verified: bool
    role: str
    created_at: datetime
    updated_at: datetime


class TokenPayload(BaseModel):
    """Schema for JWT payload data."""

    sub: str
    exp: int


class TokenResponse(BaseModel):
    """Schema for returning JWT access tokens."""

    access_token: str
    token_type: str = "bearer"
