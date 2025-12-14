
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.auth.routes import router as auth_router
from app.sweets.routes import router as sweets_router
from app.init_db import init_db

Base.metadata.create_all(bind=engine)
# Initialize database with admin user and sample sweets
init_db()

app = FastAPI(title="Sweet Shop API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Sweet Shop API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "sweet-shop-backend"}

app.include_router(auth_router)
app.include_router(sweets_router)
