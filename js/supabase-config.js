/* Supabase project connection. The publishable key is safe to expose in
   client-side code — access is enforced by the Row Level Security policies
   in supabase/schema.sql, not by keeping this key secret. */

const SUPABASE_URL = "https://nekhgpxsvrjsvcichixg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7_L_qc490VSY9qPYtTAt3A_GN9BhH4F";

// If the Supabase library didn't load (blocked script, offline, slow
// network), keep sbClient as null instead of throwing — the rest of the
// app must still render without accounts/announcements from the database.
let sbClient = null;
try {
  sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
} catch (e) {
  console.error("No se pudo conectar con Supabase:", e);
}
