from __future__ import annotations

from typing import Optional

import bcrypt

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin


def _normalize_password_for_bcrypt(password: str) -> bytes:
    """Truncate passwords to the 72-byte bcrypt limit before hashing or verifying."""
    return password.encode("utf-8")[:72]


class AuthService:
    """Service layer for authentication-related business logic."""

    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a plaintext password against a hashed password."""
        normalized_password = _normalize_password_for_bcrypt(plain_password)
        return bcrypt.checkpw(normalized_password, hashed_password.encode("utf-8"))

    def get_password_hash(self, password: str) -> str:
        """Hash a plaintext password for storage."""
        normalized_password = _normalize_password_for_bcrypt(password)
        return bcrypt.hashpw(normalized_password, bcrypt.gensalt()).decode("utf-8")

    async def authenticate(self, credentials: UserLogin) -> Optional[User]:
        """Authenticate a user using email and password."""
        user = await self.user_repository.get_by_email(credentials.email)
        if not user:
            return None
        if not self.verify_password(credentials.password, user.hashed_password):
            return None
        return user

    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user account after hashing the password."""
        existing_user = await self.user_repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=self.get_password_hash(user_data.password),
        )
        return await self.user_repository.create(user)

    async def update_user(self, email: str, full_name: Optional[str] = None, new_email: Optional[str] = None) -> User:
        """Update profile information for a user."""
        user = await self.user_repository.get_by_email(email)
        if not user:
            raise ValueError("User not found")
        if full_name:
            user.full_name = full_name
        if new_email and new_email != email:
            existing = await self.user_repository.get_by_email(new_email)
            if existing:
                raise ValueError("Email already in use")
            user.email = new_email
        return await self.user_repository.update(user)

