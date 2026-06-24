from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.db.models import EventCreate, EventOut, EventUpdate
from app.db.supabase_client import supabase
from app.core.security import verify_admin_key
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[EventOut])
async def list_events():
    """
    List all events, ordered by start_datetime
    """
    try:
        res = supabase.table("events").select("*").order("start_datetime", desc=False).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=500, detail=res.error.message)
        return res.data
    except Exception as e:
        logger.error(f"Error listing events: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: str):
    """
    Get a specific event by ID
    """
    try:
        res = supabase.table("events").select("*").eq("id", event_id).single().execute()
        if hasattr(res, 'error') and res.error or not res.data:
            raise HTTPException(status_code=404, detail="Event not found")
        return res.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting event {event_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=EventOut, dependencies=[Depends(verify_admin_key)])
async def create_event(event: EventCreate):
    """
    Create a new event (admin only)
    """
    try:
        payload = event.dict()
        # Ensure start_datetime < end_datetime if end provided
        if payload.get("end_datetime") and payload["end_datetime"] <= payload["start_datetime"]:
            raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")
            
        res = supabase.table("events").insert(payload).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=res.error.message)
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{event_id}", response_model=EventOut, dependencies=[Depends(verify_admin_key)])
async def update_event(event_id: str, event: EventUpdate):
    """
    Update an existing event (admin only)
    """
    try:
        payload = {k: v for k, v in event.dict().items() if v is not None}
        if "end_datetime" in payload and "start_datetime" in payload:
            if payload["end_datetime"] <= payload["start_datetime"]:
                raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")
                
        res = supabase.table("events").update(payload).eq("id", event_id).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=res.error.message)
            
        updated = supabase.table("events").select("*").eq("id", event_id).single().execute()
        if hasattr(updated, 'error') and updated.error:
            raise HTTPException(status_code=404, detail="Event not found after update")
            
        return updated.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating event {event_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{event_id}", dependencies=[Depends(verify_admin_key)])
async def delete_event(event_id: str):
    """
    Delete an event (admin only)
    """
    try:
        res = supabase.table("events").delete().eq("id", event_id).execute()
        if hasattr(res, 'error') and res.error:
            raise HTTPException(status_code=400, detail=res.error.message)
        return {"detail": "Event deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting event {event_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 