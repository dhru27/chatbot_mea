import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from io import BytesIO

client = TestClient(app)

# Test file upload
def test_upload_file():
    # Mock the Supabase storage client
    with patch("app.routers.upload.supabase") as mock_supabase:
        # Mock the upload method
        mock_upload = MagicMock()
        mock_upload.return_value = {}  # No error
        mock_supabase.storage.from_.return_value.upload = mock_upload
        
        # Mock the get_public_url method
        mock_get_url = MagicMock()
        mock_get_url.return_value = "https://example.com/uploads/test-file.pdf"
        mock_supabase.storage.from_.return_value.get_public_url = mock_get_url
        
        # Create a test file
        test_file = BytesIO(b"test file content")
        
        # Make the request
        response = client.post(
            "/upload/",
            files={"file": ("test-file.pdf", test_file, "application/pdf")}
        )
        
        # Check the response
        assert response.status_code == 200
        assert "url" in response.json()
        assert response.json()["url"] == "https://example.com/uploads/test-file.pdf"
        assert "filename" in response.json()
        assert response.json()["filename"] == "test-file.pdf"
        
        # Verify the upload was called
        mock_upload.assert_called_once()
        mock_get_url.assert_called_once()

# Test file upload with error
def test_upload_file_error():
    # Mock the Supabase storage client
    with patch("app.routers.upload.supabase") as mock_supabase:
        # Mock the upload method to return an error
        mock_upload = MagicMock()
        mock_upload.return_value = {"error": {"message": "Upload failed"}}
        mock_supabase.storage.from_.return_value.upload = mock_upload
        
        # Create a test file
        test_file = BytesIO(b"test file content")
        
        # Make the request
        response = client.post(
            "/upload/",
            files={"file": ("test-file.pdf", test_file, "application/pdf")}
        )
        
        # Check the response
        assert response.status_code == 500
        assert "detail" in response.json()
        assert "Upload error" in response.json()["detail"]
        
        # Verify the upload was called
        mock_upload.assert_called_once()

# Test file upload with URL retrieval error
def test_upload_file_url_error():
    # Mock the Supabase storage client
    with patch("app.routers.upload.supabase") as mock_supabase:
        # Mock the upload method
        mock_upload = MagicMock()
        mock_upload.return_value = {}  # No error
        mock_supabase.storage.from_.return_value.upload = mock_upload
        
        # Mock the get_public_url method to return None
        mock_get_url = MagicMock()
        mock_get_url.return_value = None
        mock_supabase.storage.from_.return_value.get_public_url = mock_get_url
        
        # Create a test file
        test_file = BytesIO(b"test file content")
        
        # Make the request
        response = client.post(
            "/upload/",
            files={"file": ("test-file.pdf", test_file, "application/pdf")}
        )
        
        # Check the response
        assert response.status_code == 500
        assert "detail" in response.json()
        assert "Failed to obtain public URL" in response.json()["detail"]
        
        # Verify the upload was called
        mock_upload.assert_called_once()
        mock_get_url.assert_called_once() 