from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.models.calculation import Calculation
from app.schemas.calculation import (
    CalculationCreate,
    CalculationRead,
    CalculationUpdate
)
from app.factory.calculation_factory import CalculationFactory
from app.utils.deps import get_current_user
from app.models.user import User
router = APIRouter()
logger = logging.getLogger(__name__)


# -------------------------
# CREATE CALCULATION
# -------------------------
@router.post("/", response_model=CalculationRead)
def create_calculation(calc: CalculationCreate, db: Session = Depends(get_db), 
                       current_user: User = Depends(get_current_user)):

    logger.info(f"Create calculation: {calc.type} ({calc.a}, {calc.b})")
    try:
        result = CalculationFactory.create(calc.a, calc.b, calc.type)
    except Exception as e:
        logger.error(f"Calculation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    db_calc = Calculation(
        user_id=current_user.id,
        a=calc.a,
        b=calc.b,
        type=calc.type,
        result=result
    )
    print("SAVING USER ID:", db_calc.user_id)
    db.add(db_calc)
    db.commit()
    db.refresh(db_calc)
    logger.info(f"Calculation created: id={db_calc.id}, result={result}")

    return db_calc


# -------------------------
# GET ALL CALCULATIONS
# -------------------------
@router.get("/", response_model=list[CalculationRead])
def get_calculations(db: Session = Depends(get_db), 
                     current_user: User = Depends(get_current_user)):
    logger.info("Fetching all calculations")
    return db.query(Calculation).filter(Calculation.user_id == current_user.id).all()


# -------------------------
# GET BY ID
# -------------------------
@router.get("/{calc_id}", response_model=CalculationRead)
def get_calculation(calc_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    logger.info(f"Fetching calculation: {calc_id}")

    calc = db.query(Calculation).filter(Calculation.id == calc_id, Calculation.user_id == current_user.id).first()

    if not calc:
        logger.warning(f"Calculation not found: {calc_id}")
        raise HTTPException(status_code=404, detail="Calculation not found")

    return calc


# -------------------------
# UPDATE CALCULATION
# -------------------------
@router.put("/{calc_id}", response_model=CalculationRead)
def update_calculation(
    calc_id: str,
    update: CalculationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    logger.info(f"Updating calculation: {calc_id}")

    calc = db.query(Calculation).filter(Calculation.id == calc_id, Calculation.user_id == current_user.id).first()

    if not calc:
        logger.warning(f"Update failed, not found: {calc_id}")
        raise HTTPException(status_code=404, detail="Calculation not found")

    if update.a is not None:
        calc.a = update.a
    if update.b is not None:
        calc.b = update.b
    if update.type is not None:
        calc.type = update.type

    try:
        calc.result = CalculationFactory.create(calc.a, calc.b, calc.type)
    except Exception as e:
        logger.error(f"Update calculation error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))

    db.commit()
    db.refresh(calc)

    logger.info(f"Calculation updated: id={calc.id}, result={calc.result}")

    return calc


# -------------------------
# DELETE CALCULATION
# -------------------------
@router.delete("/{calc_id}")
def delete_calculation(calc_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    logger.info(f"Deleting calculation: {calc_id}")

    calc = db.query(Calculation).filter(Calculation.id == calc_id, Calculation.user_id == current_user.id).first()

    if not calc:
        logger.warning(f"Delete failed, not found: {calc_id}")
        raise HTTPException(status_code=404, detail="Calculation not found")

    db.delete(calc)
    db.commit()

    logger.info(f"Calculation deleted: {calc_id}")

    return {"message": "Calculation deleted successfully"}