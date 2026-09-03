import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the existing Ryvora Supabase project.
 *
 * Reads only public, client-safe values:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY   (anon / publishable key)
 *
 * Never put a service-role or secret key in this file — it ships to the browser.
 */
const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const supabasePublishableKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as
  | string
  | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

let client: SupabaseClient | null = null;

/** Returns the Supabase client, or null when the env vars are not configured yet. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl!, supabasePublishableKey!, {
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
      message: "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.",
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
