import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.core.config import settings
from uuid import uuid4
from datetime import datetime, timezone

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

# Test listing forms (public endpoint)
def test_list_forms(mock_supabase):
    test_id = str(uuid4())
    now = datetime.now(timezone.utc)
    # Configure mock to return sample forms
    mock_forms = [
        {
            "id": test_id,
            "name": "Test Form",
            "description": "Test Description",
            "schema": {
                "fields": [
                    {
                        "key": "email",
                        "label": "Email",
                        "type": "email",
                        "required": True
                    }
                ]
            },
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
    ]
    mock_response = MagicMock()
    mock_response.data = mock_forms
    mock_response.error = None
    mock_supabase.table.return_value.select.return_value.execute.return_value = mock_response
    
    response = client.get("/forms/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Test Form"

# Test getting a specific form
def test_get_form(mock_supabase):
    test_id = str(uuid4())
    now = datetime.now(timezone.utc)
    # Configure mock to return a sample form
    mock_form = {
        "id": test_id,
        "name": "Test Form",
        "description": "Test Description",
        "schema": {
            "fields": [
                {
                    "key": "email",
                    "label": "Email",
                    "type": "email",
                    "required": True
                }
            ]
        },
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    mock_response = MagicMock()
    mock_response.data = mock_form
    mock_response.error = None
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_response
    
    response = client.get(f"/forms/{test_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Test Form"
    assert "fields" in response.json()["schema"]

# Test creating a form (protected endpoint)
def test_create_form_unauthorized():
    # Test without admin key
    form_data = {
        "name": "New Form",
        "description": "New Description",
        "schema": {
            "fields": [
                {
                    "key": "email",
                    "label": "Email",
                    "type": "email",
                    "required": True
                }
            ]
        }
    }
    response = client.post("/forms/", json=form_data)
    assert response.status_code == 401  # Unauthorized

def test_create_form_authorized(mock_supabase):
    test_id = str(uuid4())
    now = datetime.now(timezone.utc)
    # Configure mock to return a created form
    created_form = {
        "id": test_id,
        "name": "New Form",
        "description": "New Description",
        "schema": {
            "fields": [
                {
                    "key": "email",
                    "label": "Email",
                    "type": "email",
                    "required": True
                }
            ]
        },
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    mock_response = MagicMock()
    mock_response.data = [created_form]
    mock_response.error = None
    mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_response
    
    # Test with admin key
    form_data = {
        "name": "New Form",
        "description": "New Description",
        "schema": {
            "fields": [
                {
                    "key": "email",
                    "label": "Email",
                    "type": "email",
                    "required": True
                }
            ]
        }
    }
    response = client.post(
        "/forms/",
        json=form_data,
        headers={"X-ADMIN-API-KEY": settings.ADMIN_API_KEY}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "New Form"

# Test creating a form with invalid schema
def test_create_form_invalid_schema(mock_supabase):
    # Test with admin key but invalid schema
    form_data = {
        "name": "Invalid Form",
        "description": "Invalid Schema",
        "schema": {
            "not_fields": []  # Missing "fields" key
        }
    }
    response = client.post(
        "/forms/", 
        json=form_data,
        headers={"X-ADMIN-API-KEY": settings.ADMIN_API_KEY}
    )
    assert response.status_code == 400
    assert "Invalid schema format" in response.json()["detail"]

# Test submitting a form response
@pytest.mark.skip(reason="Email service not configured")
def test_submit_form_response(mock_supabase, mock_sendgrid):
    test_id = str(uuid4())
    now = datetime.now(timezone.utc)
    # Mock the form lookup
    form_data = {
        "id": test_id,
        "name": "Test Form",
        "schema": {
            "fields": [
                {
                    "key": "email",
                    "label": "Email",
                    "type": "email",
                    "required": True
                },
                {
                    "key": "name",
                    "label": "Name",
                    "type": "text",
                    "required": True
                }
            ]
        }
    }
    form_response = MagicMock()
    form_response.data = form_data
    form_response.error = None
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = form_response
    
    # Mock the response creation
    response_id = str(uuid4())
    created_response = {
        "id": response_id,
        "form_id": test_id,
        "email": "test@example.com",
        "name": "Test User",
        "data": {"email": "test@example.com", "name": "Test User"},
        "created_at": now.isoformat()
    }
    resp_response = MagicMock()
    resp_response.data = [created_response]
    resp_response.error = None
    mock_supabase.table.return_value.insert.return_value.execute.return_value = resp_response
    
    # Test form submission
    response_data = {
        "data": {
            "email": "test@example.com",
            "name": "Test User"
        }
    }
    response = client.post(f"/forms/{test_id}/responses", json=response_data)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

# Test submitting a form response with missing required field
def test_submit_form_response_missing_field(mock_supabase):
    test_id = str(uuid4())
    # Mock the form lookup
    form_data = {
        "id": test_id,
        "name": "Test Form",
        "schema": {
            "fields": [
                {
                    "key": "email",
                    "label": "Email",
                    "type": "email",
                    "required": True
                },
                {
                    "key": "name",
                    "label": "Name",
                    "type": "text",
                    "required": True
                }
            ]
        }
    }
    form_response = MagicMock()
    form_response.data = form_data
    form_response.error = None
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = form_response
    
    # Test form submission with missing name field
    response_data = {
        "data": {
            "email": "test@example.com"
            # Missing "name" which is required
        }
    }
    response = client.post(f"/forms/{test_id}/responses", json=response_data)
    assert response.status_code == 422
    assert "Missing required field" in response.json()["detail"] 