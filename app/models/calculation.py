from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class Calculation(Base):
    __tablename__ = "calculations"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Optional user link (kept nullable for simplicity in assignment)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    # Operation type: addition, subtraction, multiplication, division
    type = Column(String(50), nullable=False, index=True)

    # Inputs
    a = Column(Float, nullable=False)
    b = Column(Float, nullable=False)

    # Computed result stored in DB
    result = Column(Float, nullable=True)

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to user
    user = relationship("User", back_populates="calculations")

    def __repr__(self):
        return f"<Calculation(type={self.type}, a={self.a}, b={self.b}, result={self.result})>"