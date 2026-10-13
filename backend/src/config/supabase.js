import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://nmdutiisiejzconbdshu.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHV0aWlzaWVqemNvbmJkc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODgwMzMsImV4cCI6MjEwNzM2NDAzM30.umxkv-XRFgJsisxxONSn3BsF8QkNPqvsIY7Tl-10LCI';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Client with Anon Key (for verifying user tokens & public queries)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Admin Client with Service Role Key (bypasses RLS for trusted backend operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Helper to get a Supabase client scoped to the authenticated user's JWT
export function getScopedClient(req) {
  if (req?.headers?.authorization) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.authorization
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return supabaseAdmin;
}
