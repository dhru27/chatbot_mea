from supabase import create_client
from app.core.config import settings

# Initialize the Supabase client with service role key for admin access
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY) 