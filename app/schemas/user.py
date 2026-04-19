from typing import Optional
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, Field

# -------------------------
# CREATE USER
# -------------------------
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str = Field(min_length=6)


# -------------------------
# READ USER (RESPONSE)
# -------------------------
class UserRead(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------------
# LOGIN
# -------------------------
class UserLogin(BaseModel):
    username: str
    password: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "johndoe",
                "password": "SecurePass123"
            }
        }
    )


# -------------------------
# TOKEN RESPONSE
# -------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

    model_config = ConfigDict(from_attributes=True)
# -------------------------
# TOKEN PAYLOAD
# -------------------------
class TokenData(BaseModel):
    user_id: Optional[UUID] = None