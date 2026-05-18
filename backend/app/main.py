from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import events, registrations, forms, upload, reminders
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Create FastAPI app
app = FastAPI(
    title="Events & Forms API",
    description="API for managing events, forms, registrations, and form responses",
    version="1.0.0",
)

# Configure CORS
origins = settings.BACKEND_CORS_ORIGINS or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events.router)
app.include_router(registrations.router)
app.include_router(forms.router)
app.include_router(upload.router)

@app.get("/")
async def root():
    """
    Root endpoint to check if the API is running
    """
    return {
        "status": "ok",
        "message": "Events & Forms API is running"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"} 