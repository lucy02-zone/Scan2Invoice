from __future__ import annotations

from typing import Optional

from passlib.context import CryptContext

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service layer for authentication-related business logic."""

    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a plaintext password against a hashed password."""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash a plaintext password for storage."""
        return pwd_context.hash(password)

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
