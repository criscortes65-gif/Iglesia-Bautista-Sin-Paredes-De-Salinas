/* Supabase project connection. The publishable key is safe to expose in
   client-side code — access is enforced by the Row Level Security policies
   in supabase/schema.sql, not by keeping this key secret. */

const SUPABASE_URL = "https://nekhgpxsvrjsvcichixg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7_L_qc490VSY9qPYtTAt3A_GN9BhH4F";

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
