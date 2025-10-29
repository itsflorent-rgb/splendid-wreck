// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

/**
 * We use NEXT_PUBLIC_* env vars so the browser can access them.
 * Supabase's anon key is safe to expose (DB access is controlled by RLS policies).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Helpful error in dev if env isn't set up yet
  throw new Error("Missing Supabase env vars. Check .env.local");
}

export const supabase = createClient(url, anon);
