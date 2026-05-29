from fastapi import APIRouter, HTTPException, Depends, Header, Query
from typing import List, Optional
from app.db.models import RegistrationCreate, RegistrationOut
from app.db.supabase_client import supabase
from app.core.security import verify_admin_key
from app.core.config import settings
from datetime import datetime
import logging
from jsonschema import validate, ValidationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/registrations", tags=["registrations"])

@router.post("/", response_model=RegistrationOut)
async def create_registration(reg: RegistrationCreate):
    """
    Create a new registration for an event
    """
    try:
        # Validate mandatory email in data
        data = reg.data
        email = data.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Field 'email' is required")
            
        name = data.get("name")
        
        # Check event exists
        evt = supabase.table("events").select("capacity, title, start_datetime, form_id").eq("id", reg.event_id).single().execute()
        if hasattr(evt, 'error') and evt.error or not evt.data:
            raise HTTPException(status_code=404, detail="Event not found")
            
        event_data = evt.data
        cap = event_data.get("capacity")
        event_title = event_data.get("title", "Event")
        event_start = event_data.get("start_datetime")
        form_id = event_data.get("form_id")
        
        # Capacity check
        if cap is not None:
            cnt = supabase.table("registrations").select("id", count="exact").eq("event_id", reg.event_id).execute()
            if hasattr(cnt, 'error') and cnt.error:
                raise HTTPException(status_code=500, detail="Error checking capacity")
                
            if cnt.count and cnt.count >= cap:
                raise HTTPException(status_code=400, detail="Event capacity full")
        
        # Validate form schema if event.form_id exists
        if form_id:
            # fetch form schema
            frm = supabase.table("forms").select("schema").eq("id", form_id).single().execute()
            if hasattr(frm, 'error') and frm.error or not frm.data:
                raise HTTPException(status_code=500, detail="Associated form schema not found")
                
            schema = frm.data["schema"]
            
            # Validate data against schema
            try:
                # Custom validation for our schema format
                for field in schema.get("fields", []):
                    key = field["key"]
                    if field.get("required") and key not in data:
                        raise ValidationError(f"Missing required field: {key}")
                        
                    if key in data:
                        val = data[key]
                        t = field.get("type")
                        
                        # Type validations
                        if t == "email":
                            # Basic email format check
                            if not isinstance(val, str) or "@" not in val:
                                raise ValidationError(f"Invalid email format for field {key}")
                                
                        elif t == "number":
                            if not isinstance(val, (int, float)):
                                raise ValidationError(f"Field {key} must be a number")
                                
                        elif t == "file":
                            # Expect a string URL
                            if not isinstance(val, str) or not val.startswith("http"):
                                raise ValidationError(f"Field {key} must be a valid file URL")
                                
                        # Check select/radio options
                        if t in ("select", "radio") and "options" in field:
                            options = [opt["value"] for opt in field.get("options", [])]
                            if val not in options:
                                raise ValidationError(f"Field {key} has invalid option '{val}'")
                                
            except ValidationError as e:
                raise HTTPException(status_code=422, detail=f"Invalid data: {str(e)}")
        
        # Insert registration
        payload = {
            "event_id": reg.event_id,
            "email": email,
            "name": name,
            "data": data
        }
        
        res = supabase.table("registrations").insert(payload).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
            
        created = res.data[0]
        
        # Send confirmation email
        subject = f"Registration Confirmation: {event_title}"
        html = f"""
            <p>Hi {name or 'there'},</p>
            <p>Thank you for registering for <strong>{event_title}</strong> scheduled at {event_start} UTC.</p>
            <p>We will send you a reminder before the event.</p>
        """
        
        # Send email asynchronously (fire-and-forget)
        try:
            pass # Removed send_email call
        except Exception as e:
            logger.error(f"Failed to send confirmation email: {str(e)}")
            # Continue even if email fails
            
        return created
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating registration: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/", response_model=List[RegistrationOut])
async def list_registrations(
    event_id: Optional[str] = None,
    admin_key: Optional[str] = Query(None),
    x_admin_api_key: Optional[str] = Header(None)
):
    """
    List registrations (admin only)
    Can filter by event_id
    """
    # Check admin key from query param or header
    api_key = admin_key or x_admin_api_key
    if api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    try:
        query = supabase.table("registrations").select("*")
        if event_id:
            query = query.eq("event_id", event_id)
            
        res = query.order("created_at", desc=False).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=500, detail=str(res.error))
            
        return res.data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing registrations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Alternative approach with dependency
@router.get("/admin", response_model=List[RegistrationOut], dependencies=[Depends(verify_admin_key)])
async def admin_list_registrations(event_id: Optional[str] = None):
    """
    Alternative admin endpoint for listing registrations
    Uses the verify_admin_key dependency
    """
    try:
        query = supabase.table("registrations").select("*")
        if event_id:
            query = query.eq("event_id", event_id)
            
        res = query.order("created_at", desc=False).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=500, detail=str(res.error))
            
        return res.data
        
    except Exception as e:
        logger.error(f"Error listing registrations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 