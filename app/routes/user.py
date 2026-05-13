from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserLogin, Token, UserUpdate, PasswordChange
from app.utils.security import hash_password, verify_password
import logging
from app.utils.security import create_access_token
from app.utils.deps import get_current_user
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


@router.get("/me", response_model=UserRead)
def get_current_logged_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserRead)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # if not payload.first_name or not payload.last_name or not payload.email or not payload.username:
    #     raise HTTPException(status_code=400, detail="All fields are required")

    # payload.first_name = payload.first_name.strip()
    # payload.last_name = payload.last_name.strip()
    # payload.email = payload.email.strip()
    # payload.username = payload.username.strip()

    existing_email = db.query(User).filter(
        User.email == payload.email,
        User.id != current_user.id
    ).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already in use")

    existing_username = db.query(User).filter(
        User.username == payload.username,
        User.id != current_user.id
    ).first()

    if existing_username:
        raise HTTPException(status_code=400, detail="Username already in use")
    
    current_user.first_name = payload.first_name
    current_user.last_name = payload.last_name
    current_user.email = payload.email
    current_user.username = payload.username

    db.commit()
    db.refresh(current_user)

    return current_user

@router.put("/change-password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not payload.current_password or not payload.new_password:
        raise HTTPException(status_code=400, detail="All fields are required")

    if len(payload.new_password) < 12:
        raise HTTPException(status_code=400, detail="Password must be at least 12 characters")

    if verify_password(payload.new_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="New password cannot be same as old password")

    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password incorrect")

    current_user.password_hash = hash_password(payload.new_password)

    db.commit()

    return {"message": "Password updated successfully"}

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