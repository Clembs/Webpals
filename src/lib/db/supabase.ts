import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_URL } from '$env/static/public';

export const clientSupabase = createClient(PUBLIC_SUPABASE_PROJECT_URL, PUBLIC_SUPABASE_ANON_KEY);
