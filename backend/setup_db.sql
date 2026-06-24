-- Forms table (create first since events references it)
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  schema jsonb not null,  -- custom schema format (fields array)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

-- Optional: Create triggers to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_events_updated_at
before update on public.events
for each row
execute function update_updated_at_column();

create trigger update_forms_updated_at
before update on public.forms
for each row
execute function update_updated_at_column();

-- Sample data (optional, remove in production)
-- Uncomment to create sample data

/*
-- Sample form
insert into public.forms (name, description, schema)
values (
  'Sample Registration Form',
  'A sample registration form for events',
  '{
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
        "key": "phone",
        "label": "Phone Number",
        "type": "text",
        "required": false
      }
    ],
    "submit_label": "Register",
    "success_message": "Thank you for registering!"
  }'
);

-- Sample event
insert into public.events (
  title, 
  description, 
  start_datetime, 
  end_datetime, 
  location, 
  capacity, 
  form_id
)
values (
  'Sample Event',
  'A sample event for testing',
  now() + interval '7 days',
  now() + interval '7 days 2 hours',
  'Sample Location',
  50,
  (select id from public.forms where name = 'Sample Registration Form')
);
*/ 