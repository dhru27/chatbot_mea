from fastapi import APIRouter, File, UploadFile, HTTPException
from app.db.supabase_client import supabase
from app.core.config import settings
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    """
    Accept a single file, upload to Supabase Storage, return public URL.
    """
    try:
        # Generate unique path, e.g., bucket/<uuid>_<filename>
        file_bytes = await file.read()
        
        # Get file extension
        original_filename = file.filename
        ext = original_filename.split(".")[-1] if "." in original_filename else ""
        
        # Create a unique filename with the original extension
        unique_filename = f"{uuid.uuid4()}.{ext}" if ext else f"{uuid.uuid4()}"
        path = unique_filename
        
        # Upload to Supabase Storage
        bucket = settings.STORAGE_BUCKET
        
        logger.info(f"Uploading file {original_filename} as {path} to bucket {bucket}")
        
        res = supabase.storage.from_(bucket).upload(path, file_bytes)
        
        # Check for errors
        if res and isinstance(res, dict) and res.get("error"):
            error_msg = res.get("error", {}).get("message", "Unknown error")
            logger.error(f"Upload error: {error_msg}")
            raise HTTPException(status_code=500, detail=f"Upload error: {error_msg}")
            
        # Get public URL
        url_res = supabase.storage.from_(bucket).get_public_url(path)
        
        # Different versions of supabase-py might return different structures
        public_url = None
        if isinstance(url_res, dict):
            public_url = url_res.get("publicURL") or url_res.get("data", {}).get("publicUrl")
        else:
            # For newer versions that might return the URL directly
            public_url = url_res
            
        if not public_url:
            logger.error("Failed to obtain public URL")
            raise HTTPException(status_code=500, detail="Failed to obtain public URL")
            
        logger.info(f"File uploaded successfully: {public_url}")
        
        return {"url": public_url, "filename": original_filename}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}") 