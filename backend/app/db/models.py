from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

class EventBase(BaseModel):
    """Base model for event data"""
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    start_datetime: datetime
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    form_id: Optional[str] = None

class EventCreate(EventBase):
    """Model for creating a new event"""
    pass

class EventUpdate(BaseModel):
    """Model for updating an existing event"""
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    form_id: Optional[str] = None

class EventOut(EventBase):
    """Model for event response data"""
    id: str
    created_at: datetime
    updated_at: datetime

class RegistrationCreate(BaseModel):
    """Model for creating a new registration"""
    event_id: str
    data: Dict[str, Any]  # entire form payload; must include "email" key

class RegistrationOut(BaseModel):
    """Model for registration response data"""
    id: str
    event_id: str
    email: EmailStr
    name: Optional[str] = None
    data: Dict[str, Any]
    created_at: datetime

class FormBase(BaseModel):
    """Base model for form data"""
    name: str
    description: Optional[str] = None
    schema: Dict[str, Any]  # custom schema with fields array

class FormCreate(FormBase):
    """Model for creating a new form"""
    pass

class FormUpdate(BaseModel):
    """Model for updating an existing form"""
    name: Optional[str] = None
    description: Optional[str] = None
    schema: Optional[Dict[str, Any]] = None

class FormOut(FormBase):
    """Model for form response data"""
    id: str
    created_at: datetime
    updated_at: datetime

class FormResponseCreate(BaseModel):
    """Model for creating a new form response"""
    data: Dict[str, Any]  # must include "email" key

class FormResponseOut(BaseModel):
    """Model for form response response data"""
    id: str
    form_id: str
    email: EmailStr
    name: Optional[str] = None
    data: Dict[str, Any]
    created_at: datetime 