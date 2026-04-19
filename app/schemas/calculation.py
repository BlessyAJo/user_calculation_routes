from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


# -------------------------
# CREATE
# -------------------------
class CalculationCreate(BaseModel):
    a: float
    b: float
    type: Literal["addition", "subtraction", "multiplication", "division"]


# -------------------------
# UPDATE
# -------------------------
class CalculationUpdate(BaseModel):
    a: float | None = None
    b: float | None = None
    type: Literal["addition", "subtraction", "multiplication", "division"] | None = None


# -------------------------
# READ
# -------------------------
class CalculationRead(BaseModel):
    id: UUID
    user_id: UUID | None = None

    a: float
    b: float
    type: Literal["addition", "subtraction", "multiplication", "division"]
    result: float | None = None

    model_config = ConfigDict(from_attributes=True)