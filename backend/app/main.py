
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import Base, engine
from app.auth.routes import router as auth_router
from app.sweets.routes import router as sweets_router
from app.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and initialize data
    Base.metadata.create_all(bind=engine)
    init_db()
    yield
    # Shutdown (if needed)

app = FastAPI(title="Sweet Shop API", version="1.0.0", lifespan=lifespan)

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

@app.post("/init-db")
def initialize_database():
    """Manually initialize database (useful for troubleshooting)"""
    try:
        init_db()
        return {"status": "success", "message": "Database initialized"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

app.include_router(auth_router)
app.include_router(sweets_router)
