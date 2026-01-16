from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.auth.routes import router as google_auth_router
from app.gmail.routes import router as gmail_router
from app.db.mongodb import connect_db, close_db
from app.phishing.analyzer import initialize_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    initialize_model()
    print("✅ App started")
    yield
    # Shutdown
    await close_db()
    print("🛑 App shutdown")


app = FastAPI(
    title="PhishBuster API",
    description="Gmail Phishing Detection API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS for React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers: ONLY Google auth + Gmail
app.include_router(google_auth_router, prefix="/auth", tags=["Auth (Google)"])
app.include_router(gmail_router,       prefix="/api",  tags=["Gmail"])


@app.get("/")
async def root():
    return {"message": "PhishBuster API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
