import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.core.config import settings
from uuid import uuid4
from datetime import datetime, timezone, timedelta

client = TestClient(app)

# Mock the Supabase client
@pytest.fixture(autouse=True)
def mock_supabase():
    with patch("app.db.supabase_client.supabase") as mock_supabase:
        # Create a mock response for successful operations
        mock_response = MagicMock()
        mock_response.data = []
        mock_response.error = None
        
        # Configure mock methods to return the mock response
        mock_supabase.table.return_value.select.return_value.execute.return_value = mock_response
        mock_supabase.table.return_value.select.return_value.order.return_value.execute.return_value = mock_response
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_response
        mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_response
        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value = mock_response
        
        yield mock_supabase

# Mock the SendGrid client
@pytest.fixture(autouse=True)
def mock_sendgrid():
    with patch("app.services.email_service.SendGridAPIClient") as mock_sendgrid:
        mock_instance = MagicMock()
        mock_instance.send.return_value = MagicMock(status_code=202)
        mock_sendgrid.return_value = mock_instance
        yield mock_sendgrid

# Test the root endpoint
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "ok"

# Test the health check endpoint
def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"

# Test listing events (public endpoint)
def test_list_events(mock_supabase):
    test_id = str(uuid4())
    start_time = datetime.now(timezone.utc)
    # Configure mock to return sample events
    mock_events = [
        {
            "id": test_id,
            "title": "Test Event",
            "description": "Test Description",
            "start_datetime": start_time.isoformat(),
            "created_at": start_time.isoformat(),
            "updated_at": start_time.isoformat()
        }
    ]
    mock_response = MagicMock()
    mock_response.data = mock_events
    mock_response.error = None
    mock_supabase.table.return_value.select.return_value.order.return_value.execute.return_value = mock_response
    
    response = client.get("/events/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Test Event"

# Test creating an event (protected endpoint)
def test_create_event_unauthorized():
    # Test without admin key
    event_data = {
        "title": "New Event",
        "description": "New Description",
        "start_datetime": datetime.now(timezone.utc).isoformat()
    }
    response = client.post("/events/", json=event_data)
    assert response.status_code == 401  # Unauthorized

def test_create_event_authorized(mock_supabase):
    test_id = str(uuid4())
    start_time = datetime.now(timezone.utc)
    # Configure mock to return a created event
    created_event = {
        "id": test_id,
        "title": "New Event",
        "description": "New Description",
        "start_datetime": start_time.isoformat(),
        "created_at": start_time.isoformat(),
        "updated_at": start_time.isoformat()
    }
    mock_response = MagicMock()
    mock_response.data = [created_event]
    mock_response.error = None
    mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_response
    
    # Test with admin key
    event_data = {
        "title": "New Event",
        "description": "New Description",
        "start_datetime": start_time.isoformat()
    }
    response = client.post(
        "/events/",
        json=event_data,
        headers={"X-ADMIN-API-KEY": settings.ADMIN_API_KEY}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Event"

# Test creating a registration
@pytest.mark.skip(reason="Email service not configured")
def test_create_registration(mock_supabase, mock_sendgrid):
    test_id = str(uuid4())
    start_time = datetime.now(timezone.utc)
    # Mock the event lookup
    event_data = {
        "id": test_id,
        "title": "Test Event",
        "start_datetime": start_time.isoformat(),
        "capacity": 10
    }
    event_response = MagicMock()
    event_response.data = event_data
    event_response.error = None
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = event_response
    
    # Mock the capacity check
    capacity_response = MagicMock()
    capacity_response.count = 5  # 5 out of 10 spots taken
    capacity_response.error = None
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = capacity_response
    
    # Mock the registration creation
    reg_id = str(uuid4())
    created_reg = {
        "id": reg_id,
        "event_id": test_id,
        "email": "test@example.com",
        "name": "Test User",
        "data": {"email": "test@example.com", "name": "Test User"},
        "created_at": start_time.isoformat()
    }
    reg_response = MagicMock()
    reg_response.data = [created_reg]
    reg_response.error = None
    mock_supabase.table.return_value.insert.return_value.execute.return_value = reg_response
    
    # Test registration
    reg_data = {
        "event_id": test_id,
        "data": {
            "email": "test@example.com",
            "name": "Test User"
        }
    }
    response = client.post("/registrations/", json=reg_data)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

# Add more tests for other endpoints as needed 