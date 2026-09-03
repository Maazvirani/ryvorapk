/**
 * Ryvora — Supabase connection config (browser-safe only).
 *
 * These two values are PUBLIC by design (the same pair Supabase prints in
 * "Project Settings → API" under Project URL + anon/publishable key). They are
 * safe to commit: row-level security, not secrecy, protects your data.
 *
 * NEVER put a service-role / secret key here — it would ship to the browser.
 *
 * Resolution order:
 *   1. VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (if env vars exist)
 *   2. the committed fallbacks below (works without any secrets feature)
 */

/** Existing Ryvora Supabase project — do not point this at another database. */
export const SUPABASE_URL_FALLBACK = "https://hfczfnaaqwsmvgahiygc.supabase.co";

/**
 * Paste the project's anon / publishable key here (starts with `eyJ...` or
 * `sb_publishable_...`). Found in Supabase → Project Settings → API.
 */
export const SUPABASE_PUBLISHABLE_KEY_FALLBACK =
  "sb_publishable_AfyF3k8-uEzorkoYC98D-Q_QRlgkuvS";

const envUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const envKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined;

export const SUPABASE_URL = (envUrl && envUrl.trim()) || SUPABASE_URL_FALLBACK;
export const SUPABASE_PUBLISHABLE_KEY =
  (envKey && envKey.trim()) || SUPABASE_PUBLISHABLE_KEY_FALLBACK;
