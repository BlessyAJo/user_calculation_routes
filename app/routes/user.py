from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserLogin, Token
from app.utils.security import hash_password, verify_password
import logging
from app.utils.security import create_access_token
router = APIRouter()


logger = logging.getLogger(__name__)
# -------------------------
# REGISTER USER
# -------------------------
@router.post("/register", response_model=UserRead)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Register attempt: {user.username}")
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()

    if existing_user:
        logger.warning(f"Duplicate user: {user.username}")
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        username=user.username,
        password_hash=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    # db.refresh(new_user)
    logger.info(f"User created: id={new_user.id}")
    return new_user


# -------------------------
# LOGIN USER
# -------------------------
@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt: {user.username}")
    db_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.username)
    ).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        logger.warning(f"Login failed: {user.username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    logger.info(f"Login success: user_id={db_user.id}")
    token = create_access_token({"sub": str(db_user.id)})
    return {
        "access_token": token,  # simple token for assignment
        "token_type": "bearer",
        "user": UserRead.model_validate(db_user)
    }


# -------------------------
# GET ALL USERS (optional)
# -------------------------
@router.get("/", response_model=list[UserRead])
def get_users(db: Session = Depends(get_db)):
    logger.info("Fetching all users")
    return db.query(User).all()


# -------------------------
# GET USER BY ID
# -------------------------
@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: str, db: Session = Depends(get_db)):
    logger.info(f"Fetching user: {user_id}")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        logger.warning(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    return user