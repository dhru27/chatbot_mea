from fastapi import Header, HTTPException, status
from app.core.config import settings

async def verify_admin_key(x_admin_api_key: str | None = Header(None)):
    """
    Dependency function to verify admin API key in request headers
    
    Args:
        x_admin_api_key: The API key from the X-ADMIN-API-KEY header
        
    Raises:
        HTTPException: If the API key is missing or invalid
    """
    if not x_admin_api_key or x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid admin API key"
        ) 