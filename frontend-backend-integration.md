# Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the FastAPI + Supabase backend for event registrations and forms.

## Overview

The integration enables:
- Fetching events and forms from the backend
- Registering for events with customizable forms
- Submitting standalone forms
- File uploads via Supabase Storage

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root of your project with:

```
# Development - Local Backend
VITE_API_BASE_URL=http://localhost:8000

# Production - Render Backend (uncomment when deploying)
# VITE_API_BASE_URL=https://your-backend.onrender.com
```

### 2. Install Required Dependencies

```bash
npm install react-hook-form @tanstack/react-query
```

### 3. Backend Setup

Follow these steps to set up the backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up your environment variables by copying the template:
   ```bash
   cp env.template .env
   ```
   
4. Edit the `.env` file with your Supabase credentials.

5. Run the development server:
   ```bash
   ./run_dev.sh  # On Windows: python -m uvicorn app.main:app --reload
   ```

6. The backend should now be running at `http://localhost:8000`.

### 4. Testing the Integration

1. Start the frontend development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Events page and try registering for an event.

3. Check the backend logs to confirm the registration was received.

4. Test file uploads by creating a form with a file field.

## Features and Components

### DynamicForm Component

The `DynamicForm` component renders forms based on a schema from the backend. It supports:

- Text, email, number inputs
- Textareas
- Select dropdowns
- Radio buttons
- Checkboxes
- File uploads (with automatic upload to Supabase Storage)

### Registration Flow

1. User clicks "Register Now" on an event card
2. User is directed to `/events/:eventId/register`
3. The form is pre-filled with saved data from localStorage if available
4. On submission, data is sent to the backend.

### Forms System

1. Standalone forms are listed at `/forms`
2. Individual forms are displayed at `/forms/:formId`
3. Forms use the same DynamicForm component as event registrations

## Deployment

### Frontend (Netlify)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`
5. Add the environment variable `VITE_API_BASE_URL` pointing to your deployed backend

### Backend (Render)

1. Push your backend code to GitHub
2. Create a new Web Service on Render
3. Connect to your GitHub repo
4. Set the build command to `pip install -r requirements.txt`
5. Set the start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add all required environment variables from your `.env` file
7. Deploy the service

## Testing

### Manual Testing Checklist

- [ ] Event listing loads correctly
- [ ] Registration form opens when clicking "Register Now"
- [ ] Form validation works for required fields
- [ ] File uploads work correctly
- [ ] Form submissions are saved to the backend
- [ ] Form data is pre-filled from localStorage on return visits

### Automated Testing

Run the backend tests:

```bash
cd backend
./run_tests.sh
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has the correct CORS configuration with your frontend URL.

2. **File Upload Issues**: Check Supabase Storage bucket permissions and ensure the backend has the correct service role key.

3. **Form Validation Errors**: Check that your form schema matches the validation rules in the backend.

## Future Enhancements

- Admin interface for managing events and forms
- User authentication for returning users
- Analytics for event registrations
- Custom email templates for different events 