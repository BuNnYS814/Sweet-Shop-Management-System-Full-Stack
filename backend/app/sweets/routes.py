from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Sweet, User
from app.auth.utils import decode_access_token
from typing import Optional

router = APIRouter(prefix="/api/sweets")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(401, "Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(401, "User not found")
    return user

@router.get("")
def get_sweets(db: Session = Depends(get_db)):
    sweets = db.query(Sweet).all()
    return [{"id": s.id, "name": s.name, "category": s.category, "price": s.price, "quantity": s.quantity} for s in sweets]

@router.post("")
def create_sweet(sweet: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(403, "Admin only")
    s = Sweet(name=sweet["name"], category=sweet["category"], price=sweet["price"], quantity=sweet.get("quantity", 0))
    db.add(s); db.commit(); db.refresh(s)
    return {"id": s.id, "name": s.name, "category": s.category, "price": s.price, "quantity": s.quantity}

@router.put("/{sweet_id}")
def update_sweet(sweet_id: int, sweet: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(403, "Admin only")
    s = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not s:
        raise HTTPException(404, "Sweet not found")
    if "name" in sweet: s.name = sweet["name"]
    if "category" in sweet: s.category = sweet["category"]
    if "price" in sweet: s.price = sweet["price"]
    if "quantity" in sweet: s.quantity = sweet["quantity"]
    db.commit()
    return {"id": s.id, "name": s.name, "category": s.category, "price": s.price, "quantity": s.quantity}

@router.delete("/{sweet_id}")
def delete_sweet(sweet_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(403, "Admin only")
    s = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not s:
        raise HTTPException(404, "Sweet not found")
    db.delete(s); db.commit()
    return {"msg": "deleted"}

@router.post("/{sweet_id}/purchase")
def purchase_sweet(sweet_id: int, purchase: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    s = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not s:
        raise HTTPException(404, "Sweet not found")
    quantity = purchase.get("quantity", 1)
    if s.quantity < quantity:
        raise HTTPException(400, "Insufficient quantity")
    s.quantity -= quantity
    db.commit()
    return {"id": s.id, "name": s.name, "quantity": s.quantity, "purchased": quantity}

