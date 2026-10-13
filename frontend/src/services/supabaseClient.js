import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nmdutiisiejzconbdshu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHV0aWlzaWVqemNvbmJkc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODgwMzMsImV4cCI6MjEwNzM2NDAzM30.umxkv-XRFgJsisxxONSn3BsF8QkNPqvsIY7Tl-10LCI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
