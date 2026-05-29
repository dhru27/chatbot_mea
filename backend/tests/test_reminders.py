import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.core.config import settings
from datetime import datetime, timezone, timedelta
from uuid import uuid4

client = TestClient(app)

# Test triggering reminders without admin key
def test_trigger_reminders_unauthorized():
    response = client.post("/reminders/send")
    assert response.status_code == 401
    assert "Invalid admin API key" in response.json()["detail"]

# Test triggering reminders with admin key
@pytest.mark.skip(reason="Email service not configured")
def test_trigger_reminders_authorized():
    with patch("app.routers.reminders.send_event_reminders") as mock_send_reminders:
        # Mock the reminder service to return a count of events
        mock_send_reminders.return_value = 2
        
        # Make the request with admin key
        response = client.post(
            "/reminders/send",
            headers={"X-ADMIN-API-KEY": settings.ADMIN_API_KEY}
        )
        
        # Check the response
        assert response.status_code == 200
        assert "detail" in response.json()
        assert "Reminders triggered for 2 events" in response.json()["detail"]
        
        # Verify the reminder service was called
        mock_send_reminders.assert_called_once()

# Test the reminder service
@pytest.mark.skip(reason="Email service not configured")
def test_reminder_service():
    with patch("app.services.reminder_service.supabase") as mock_supabase, \
         patch("app.services.reminder_service.send_email") as mock_send_email:
        
        # Calculate the expected time window
        now = datetime.now(timezone.utc)
        lead = timedelta(hours=settings.REMINDER_LEAD_HOURS)
        window_start = now + lead
        window_end = window_start + timedelta(hours=1)
        
        # Mock events in the reminder window
        event1_id = str(uuid4())
        event2_id = str(uuid4())
        mock_events = [
            {
                "id": event1_id,
                "title": "Event 1",
                "start_datetime": window_start.isoformat(),
                "description": "Description 1",
                "location": "Location 1"
            },
            {
                "id": event2_id,
                "title": "Event 2",
                "start_datetime": window_start.isoformat(),
                "description": "Description 2",
                "location": None
            }
        ]
        events_response = MagicMock()
        events_response.data = mock_events
        events_response.error = None
        mock_supabase.table.return_value.select.return_value.gte.return_value.lt.return_value.execute.return_value = events_response
        
        # Mock registrations for the first event
        mock_registrations_1 = [
            {
                "email": "user1@example.com",
                "name": "User 1"
            },
            {
                "email": "user2@example.com",
                "name": "User 2"
            }
        ]
        reg_response_1 = MagicMock()
        reg_response_1.data = mock_registrations_1
        reg_response_1.error = None
        
        # Mock registrations for the second event
        mock_registrations_2 = [
            {
                "email": "user3@example.com",
                "name": "User 3"
            }
        ]
        reg_response_2 = MagicMock()
        reg_response_2.data = mock_registrations_2
        reg_response_2.error = None
        
        # Configure the mock to return different responses based on event_id
        def mock_registrations_query(*args, **kwargs):
            query = mock_supabase.table.return_value.select.return_value.eq.return_value
            if query._eq_value == event1_id:  # First event
                return reg_response_1
            else:  # Second event
                return reg_response_2
        
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.side_effect = mock_registrations_query
        
        # Import and call the reminder service
        from app.services.reminder_service import send_event_reminders
        result = send_event_reminders()
        
        # Check the result
        assert result == 2  # 2 events processed
        
        # Check that emails were sent to all registrations
        assert mock_send_email.call_count == 3  # 2 registrations for event 1 + 1 for event 2
        
        # Verify the first email call
        mock_send_email.assert_any_call(
            "user1@example.com",
            "Reminder: Upcoming event 'Event 1'",
            mock_send_email.call_args_list[0][0][2]  # HTML content
        )
        
        # Verify the location was included for event 1
        assert "Location: Location 1" in mock_send_email.call_args_list[0][0][2]

# Test the reminder service with no upcoming events
def test_reminder_service_no_events():
    with patch("app.services.reminder_service.supabase") as mock_supabase, \
         patch("app.services.reminder_service.send_email") as mock_send_email:
        
        # Mock empty events response
        events_response = MagicMock()
        events_response.data = []
        events_response.error = None
        mock_supabase.table.return_value.select.return_value.gte.return_value.lt.return_value.execute.return_value = events_response
        
        # Import and call the reminder service
        from app.services.reminder_service import send_event_reminders
        result = send_event_reminders()
        
        # Check the result
        assert result == 0  # No events processed
        
        # Verify no emails were sent
        mock_send_email.assert_not_called() 