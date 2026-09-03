import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabaseConfig";

/**
 * Browser Supabase client for the existing Ryvora Supabase project
 * (hfczfnaaqwsmvgahiygc).
 *
 * Values come from src/lib/supabaseConfig.ts, which prefers VITE_ env vars and
 * otherwise falls back to committed public values — so the deployed app works
 * without any secrets feature.
 *
 * Never put a service-role or secret key in this file — it ships to the browser.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

let client: SupabaseClient | null = null;

/** Returns the Supabase client, or null when the publishable key is not set yet. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    });
  }
  return client;
}

/**
 * Reads the `users` table to confirm the connection and RLS policies work.
 * Returns a plain result object instead of throwing, so UI can show status.
 */
export async function checkUsersTable(): Promise<{
  ok: boolean;
  count: number | null;
  message: string;
}> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      ok: false,
      count: null,
      message:
        "Supabase publishable key missing — set SUPABASE_PUBLISHABLE_KEY_FALLBACK in src/lib/supabaseConfig.ts (or VITE_SUPABASE_PUBLISHABLE_KEY).",
    };
  }

  const { data, error, count } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .limit(1);

  if (error) {
    return { ok: false, count: null, message: error.message };
  }

  return {
    ok: true,
    count: count ?? data?.length ?? 0,
    message: "Connected — users table is readable.",
  };
}
