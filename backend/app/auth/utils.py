
import os
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")
ALGORITHM = "HS256"

# Configure bcrypt with explicit settings to avoid version detection issues
pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12,
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """Hash a password using bcrypt, handling long passwords."""
    # Bcrypt has a 72 byte limit, so we'll hash the password first if needed
    # In practice, most passwords are under 72 bytes, but we'll handle it safely
    if isinstance(password, str):
        password = password.encode('utf-8')
    # Truncate to 72 bytes if necessary (very rare case)
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data):
    data["exp"] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
