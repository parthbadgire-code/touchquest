import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceRoleKey &&
  !supabaseUrl.includes("your-project") &&
  !supabaseServiceRoleKey.includes("your-service-role")
);

/**
 * Server-only admin client utilizing SUPABASE_SERVICE_ROLE_KEY for trusted operations.
 * NEVER expose or import this file in client components.
 */
export function getAdminSupabase() {
  if (!isSupabaseAdminConfigured) {
    throw new Error(
      "[TouchQuest Server Auth] Supabase Admin Service Key is pending configuration. Check .env.local"
    );
  }
  return createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
