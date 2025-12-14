
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth.utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):
    u = User(email=user["email"], hashed_password=hash_password(user["password"]))
    db.add(u); db.commit()
    return {"msg": "ok"}

@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == user["email"]).first()
    if not u or not verify_password(user["password"], u.hashed_password):
        raise HTTPException(401, "Invalid")
    return {
        "access_token": create_access_token({"sub": u.email}),
        "email": u.email,
        "is_admin": u.is_admin
    }
