from sqlalchemy import Column, String, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)

    email = Column(String(120), unique=True, nullable=False, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)

    password_hash = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship
    calculations = relationship(
        "Calculation",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"