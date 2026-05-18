from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.db.models import FormCreate, FormOut, FormUpdate, FormResponseCreate, FormResponseOut
from app.db.supabase_client import supabase
from app.core.security import verify_admin_key
import logging
from jsonschema import ValidationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/forms", tags=["forms"])

@router.get("/", response_model=List[FormOut])
async def list_forms():
    """
    List all forms
    """
    try:
        res = supabase.table("forms").select("*").execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=500, detail=str(res.error))
        return res.data
    except Exception as e:
        logger.error(f"Error listing forms: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{form_id}", response_model=FormOut)
async def get_form(form_id: str):
    """
    Get a specific form by ID
    """
    try:
        res = supabase.table("forms").select("*").eq("id", form_id).single().execute()
        if hasattr(res, 'error') and res.error or not res.data:
            raise HTTPException(status_code=404, detail="Form not found")
        return res.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting form {form_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=FormOut, dependencies=[Depends(verify_admin_key)])
async def create_form(form: FormCreate):
    """
    Create a new form (admin only)
    """
    try:
        # Validate schema format
        schema = form.schema
        if not isinstance(schema, dict) or "fields" not in schema or not isinstance(schema["fields"], list):
            raise HTTPException(status_code=400, detail="Invalid schema format: must contain 'fields' array")
        
        # Validate each field has required keys
        for i, field in enumerate(schema["fields"]):
            if "key" not in field or "type" not in field:
                raise HTTPException(status_code=400, detail=f"Field at index {i} missing required 'key' or 'type'")
            
        res = supabase.table("forms").insert(form.dict()).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating form: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{form_id}", response_model=FormOut, dependencies=[Depends(verify_admin_key)])
async def update_form(form_id: str, form: FormUpdate):
    """
    Update an existing form (admin only)
    """
    try:
        payload = {k: v for k, v in form.dict().items() if v is not None}
        
        # If schema is being updated, validate it
        if "schema" in payload:
            schema = payload["schema"]
            if not isinstance(schema, dict) or "fields" not in schema or not isinstance(schema["fields"], list):
                raise HTTPException(status_code=400, detail="Invalid schema format: must contain 'fields' array")
            
            # Validate each field has required keys
            for i, field in enumerate(schema["fields"]):
                if "key" not in field or "type" not in field:
                    raise HTTPException(status_code=400, detail=f"Field at index {i} missing required 'key' or 'type'")
        
        res = supabase.table("forms").update(payload).eq("id", form_id).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
            
        updated = supabase.table("forms").select("*").eq("id", form_id).single().execute()
        if hasattr(updated, 'error') and updated.error or not updated.data:
            raise HTTPException(status_code=404, detail="Form not found after update")
            
        return updated.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating form {form_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{form_id}", dependencies=[Depends(verify_admin_key)])
async def delete_form(form_id: str):
    """
    Delete a form (admin only)
    """
    try:
        res = supabase.table("forms").delete().eq("id", form_id).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
        return {"detail": "Form deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting form {form_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Form responses
@router.post("/{form_id}/responses", response_model=FormResponseOut)
async def create_form_response(form_id: str, resp: FormResponseCreate):
    """
    Submit a response to a form
    """
    try:
        data = resp.data
        email = data.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Field 'email' is required")
            
        name = data.get("name")
        
        # Validate against form schema
        frm = supabase.table("forms").select("schema, name").eq("id", form_id).single().execute()
        if hasattr(frm, 'error') and frm.error or not frm.data:
            raise HTTPException(status_code=404, detail="Form not found")
            
        schema = frm.data["schema"]
        form_name = frm.data.get("name", "Form")
        
        # Custom validation
        try:
            for field in schema.get("fields", []):
                key = field["key"]
                if field.get("required") and key not in data:
                    raise ValidationError(f"Missing required field: {key}")
                    
                if key in data:
                    val = data[key]
                    t = field.get("type")
                    
                    # Type validations
                    if t == "email":
                        if not isinstance(val, str) or "@" not in val:
                            raise ValidationError(f"Invalid email format for field {key}")
                            
                    elif t == "number":
                        if not isinstance(val, (int, float)):
                            raise ValidationError(f"Field {key} must be a number")
                            
                    elif t == "file":
                        if not isinstance(val, str) or not val.startswith("http"):
                            raise ValidationError(f"Field {key} must be a valid file URL")
                            
                    # Check select/radio options
                    if t in ("select", "radio") and "options" in field:
                        options = [opt["value"] for opt in field.get("options", [])]
                        if val not in options:
                            raise ValidationError(f"Field {key} has invalid option '{val}'")
                            
        except ValidationError as e:
            raise HTTPException(status_code=422, detail=f"Invalid data: {str(e)}")
        
        # Insert form response
        payload = {
            "form_id": form_id,
            "email": email,
            "name": name,
            "data": data
        }
        
        res = supabase.table("form_responses").insert(payload).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=str(res.error))
            
        created = res.data[0]
        
        # Send confirmation email
        subject = f"Submission received: {form_name}"
        html = f"""
            <p>Hi {name or 'there'},</p>
            <p>Thank you for submitting the form '{form_name}'.</p>
            <p>We have received your submission and will process it shortly.</p>
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
        logger.error(f"Error creating form response: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{form_id}/responses", response_model=List[FormResponseOut], dependencies=[Depends(verify_admin_key)])
async def list_form_responses(form_id: str):
    """
    List all responses for a specific form (admin only)
    """
    try:
        res = supabase.table("form_responses").select("*").eq("form_id", form_id).order("created_at", desc=False).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=500, detail=str(res.error))
        return res.data
    except Exception as e:
        logger.error(f"Error listing form responses for form {form_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 