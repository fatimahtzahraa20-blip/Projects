import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const hasPlaceholder = (value) =>
  !value || value.includes('YOUR_PROJECT_ID') || value.includes('YOUR_SUPABASE_ANON_KEY');

export const isSupabaseConfigured =
  !hasPlaceholder(supabaseUrl) && !hasPlaceholder(supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the development server.',
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

