import { createClient } from '@supabase/supabase-js'

// Supabase configuration - these will be set in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)