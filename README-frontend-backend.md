# Frontend-Backend Integration for Event Registration System

This project integrates a React frontend with a FastAPI + Supabase backend to create a comprehensive event registration system with dynamic forms.

## Features

- **Event Registration**: Allow users to register for events with customizable forms
- **Standalone Forms**: Create and submit generic forms not tied to events
- **File Uploads**: Support file uploads via Supabase Storage
- **Theming**: Support dark/light mode and custom color accents
- **Form Pre-filling**: Save and pre-fill form data from localStorage

## Project Structure

### Frontend Components

- `DynamicForm.tsx`: Renders form fields based on a schema, handles validation and file uploads
- `RegisterPage.tsx`: Page for event registration with event details and form
- `FormsListPage.tsx`: Lists all available standalone forms
- `FormPage.tsx`: Displays and handles a specific standalone form

### Backend Structure

- `app/main.py`: Main FastAPI application
- `app/routers/`: API endpoints for events, registrations, forms, uploads, and reminders
- `app/services/`: Services for email sending and reminders
- `app/db/`: Database models and Supabase client

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Python 3.10+
- Supabase account
- Render account (for backend deployment)
- Netlify account (for frontend deployment)

### Frontend Setup

1. Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8000
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Backend Setup

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

3. Copy the environment template and update with your credentials:

```bash
cp env.template .env
```

4. Edit the `.env` file with your:
   - Supabase URL and service role key
   - Admin API key (create a strong random string)
   - Storage bucket name
   - CORS origins

5. Run the development server:

```bash
./run_dev.sh  # On Windows: python -m uvicorn app.main:app --reload
```

## Usage

### Creating Events and Forms

1. Use the Supabase dashboard or API endpoints with admin key to create events and forms
2. Events can have an optional form_id linking to a custom form
3. Forms have a schema defining fields, validation rules, and appearance

### Form Schema Format

```json
{
  "fields": [
    {
      "key": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "placeholder": "your.email@example.com"
    },
    {
      "key": "name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "John Doe"
    },
    {
      "key": "resume",
      "label": "Upload Resume",
      "type": "file",
      "required": false
    },
    {
      "key": "comments",
      "label": "Additional Comments",
      "type": "textarea",
      "required": false
    }
  ],
  "submit_label": "Register Now",
  "success_message": "Thank you for registering! A confirmation email has been sent."
}
```

### Supported Field Types

- `text`: Text input
- `email`: Email input with validation
- `number`: Number input
- `password`: Password input
- `date`: Date picker
- `textarea`: Multiline text input
- `select`: Dropdown selection (requires `options` array)
- `radio`: Radio button group (requires `options` array)
- `checkbox`: Single checkbox
- `file`: File upload (automatically uploads to Supabase Storage)

### Testing

Run frontend tests:

```bash
npm test
```

Run backend tests:

```bash
cd backend
./run_tests.sh
```

For more details on testing, see [testing-setup.md](./testing-setup.md).

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

## API Endpoints

### Events

- `GET /events`: List all events
- `GET /events/{event_id}`: Get event details
- `POST /events`: Create an event (protected)
- `PUT /events/{event_id}`: Update an event (protected)
- `DELETE /events/{event_id}`: Delete an event (protected)

### Registrations

- `POST /registrations`: Register for an event
- `GET /registrations`: List registrations (protected)

### Forms

- `GET /forms`: List all forms
- `GET /forms/{form_id}`: Get form details
- `POST /forms`: Create a form (protected)
- `PUT /forms/{form_id}`: Update a form (protected)
- `DELETE /forms/{form_id}`: Delete a form (protected)
- `POST /forms/{form_id}/responses`: Submit a form response
- `GET /forms/{form_id}/responses`: List form responses (protected)

### Other

- `POST /upload`: Upload a file to Supabase Storage

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has the correct CORS configuration with your frontend URL.

2. **File Upload Issues**: Check Supabase Storage bucket permissions and ensure the backend has the correct service role key.

3. **Email Not Sending**: Verify your SendGrid API key and sender email are correctly set up.

4. **Form Validation Errors**: Check that your form schema matches the validation rules in the backend.

## Future Enhancements

- Admin interface for managing events and forms
- User authentication for returning users
- Analytics for event registrations
- Custom email templates for different events
- Pagination for listing events and forms
- Search functionality for events and forms

## License

This project is licensed under the MIT License - see the LICENSE file for details. 