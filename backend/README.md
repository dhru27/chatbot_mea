# Events & Forms API

A FastAPI backend for managing events, forms, registrations, and form responses. This backend integrates with Supabase for data storage.

## Features

- Event management (create, read, update, delete)
- Dynamic form creation and management
- File uploads via Supabase Storage

## Prerequisites

- Python 3.10+
- Supabase account
- Render.com account (for deployment)

## Setup

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Create the following tables in the SQL Editor:

```sql
-- Events table
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  location text,
  capacity integer default null,  -- null = unlimited
  form_id uuid references public.forms(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Forms table
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  schema jsonb not null,  -- custom schema format (fields array)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Registrations table
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  email text not null,       -- extracted from submitted data
  name text,                 -- optional, if form has a "name" field
  data jsonb not null,       -- full submitted form payload
  created_at timestamptz default now()
);
create index on public.registrations (event_id);
create index on public.registrations (email);

-- Form responses table
create table public.form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references public.forms(id) on delete cascade,
  email text not null,
  name text,
  data jsonb not null,
  created_at timestamptz default now()
);
create index on public.form_responses (form_id);
create index on public.form_responses (email);
```

3. Create a Storage bucket:
   - Go to Storage in the Supabase dashboard
   - Create a new bucket named `uploads` (or any name you prefer)
   - Set the bucket's privacy setting to "Public" to allow public access to uploaded files
   - Note: You'll need to use this bucket name in your `.env` file

4. Get your Supabase URL and service role key:
   - Go to Project Settings > API
   - Copy the URL and service_role key (NOT the anon key)

### 2. Local Development Setup

1. Clone this repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file from the template:
   ```bash
   cp env.template .env
   ```

5. Edit the `.env` file with your actual values:
   - Supabase URL and service role key
   - CORS origins (frontend URLs)
   - Admin API key (create a strong secret)
   - Storage bucket name

6. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

7. Access the API documentation at http://localhost:8000/docs

## Deployment on Render

### 1. Web Service Setup

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Sign in to [Render.com](https://render.com)
3. Create a new Web Service:
   - Connect to your Git repository
   - Select the branch to deploy
   - Set the build command: `pip install -r requirements.txt`
   - Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add all environment variables from your `.env` file

### 2. Cron Job Setup for Reminders

1. In Render dashboard, create a new Cron Job:
   - Set a name for your job
   - Schedule: `0 * * * *` for hourly execution (adjust as needed)
   - Command: `curl -X POST https://your-backend-url.onrender.com/reminders/send -H "X-ADMIN-API-KEY: ${ADMIN_API_KEY}"`
   - Add the `ADMIN_API_KEY` environment variable with the same value as in your Web Service

## API Usage

### Authentication

- Public endpoints: No authentication required
- Admin endpoints: Require `X-ADMIN-API-KEY` header with your admin API key

### Example Requests

#### Create an Event (Admin)

```bash
curl -X POST https://your-backend.onrender.com/events/ \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-API-KEY: your-admin-key" \
  -d '{
    "title": "Tech Workshop",
    "description": "Learn about new technologies",
    "start_datetime": "2023-12-01T14:00:00Z",
    "end_datetime": "2023-12-01T16:00:00Z",
    "location": "Main Hall",
    "capacity": 50
  }'
```

#### Create a Form (Admin)

```bash
curl -X POST https://your-backend.onrender.com/forms/ \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-API-KEY: your-admin-key" \
  -d '{
    "name": "Registration Form",
    "description": "Event registration form",
    "schema": {
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "email",
          "required": true
        },
        {
          "key": "name",
          "label": "Full Name",
          "type": "text",
          "required": true
        },
        {
          "key": "phone",
          "label": "Phone Number",
          "type": "text",
          "required": false
        }
      ],
      "submit_label": "Register",
      "success_message": "Thank you for registering!"
    }
  }'
```

#### Register for an Event (Public)

```bash
curl -X POST https://your-backend.onrender.com/registrations/ \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "event-uuid-here",
    "data": {
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "123-456-7890"
    }
  }'
```

#### Upload a File (Public)

```bash
curl -X POST https://your-backend.onrender.com/upload/ \
  -F "file=@/path/to/your/file.pdf"
```

### Example Schema Format

Forms and events use a custom schema format for defining form fields:

```json
{
  "fields": [
    {
      "key": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "placeholder": "you@example.com"
    },
    {
      "key": "name",
      "label": "Full Name",
      "type": "text",
      "required": true
    },
    {
      "key": "resume",
      "label": "Upload Resume",
      "type": "file",
      "required": false
    },
    {
      "key": "year",
      "label": "Year of Study",
      "type": "select",
      "required": true,
      "options": [
        {"label": "1st Year", "value": "1"},
        {"label": "2nd Year", "value": "2"},
        {"label": "3rd Year", "value": "3"},
        {"label": "4th Year", "value": "4"}
      ]
    }
  ],
  "submit_label": "Register",
  "success_message": "Thank you for registering!"
}
```

## Testing

### Manual Testing

1. Use the Swagger UI at `/docs` to test endpoints
2. For protected endpoints, add the `X-ADMIN-API-KEY` header with your admin key

### Automated Testing

Run the tests with pytest:

```bash
./run_tests.sh
```

Or manually:

```bash
pytest --cov=app tests/ --cov-report=term-missing
```

## Frontend Integration

To integrate with your React frontend:

1. Set the environment variable in your frontend:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

2. For file uploads, first upload the file to get a URL:
   ```javascript
   const uploadFile = async (file) => {
     const formData = new FormData();
     formData.append("file", file);
     
     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/`, {
       method: "POST",
       body: formData,
     });
     
     if (response.ok) {
       const data = await response.json();
       return data.url;
     }
     throw new Error("Upload failed");
   };
   ```

3. Then include the URL in your form submission:
   ```javascript
   const submitForm = async (formData) => {
     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/registrations/`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         event_id: "event-id-here",
         data: formData
       }),
     });
     
     if (response.ok) {
       return await response.json();
     }
     throw new Error("Submission failed");
   };
   ```

## Troubleshooting

- **CORS issues**: Ensure your frontend domain is included in the `BACKEND_CORS_ORIGINS` environment variable
- **Upload errors**: Check that your Supabase bucket exists and is properly configured
- **Database errors**: Check your Supabase URL and service role key

## License

MIT 