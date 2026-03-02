import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-side client (uses service role key — full access, bypasses RLS)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(url, key);
}

// Client-side client (uses anon key — respects RLS)
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(url, key);
}
