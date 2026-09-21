export type EnvConfig = {
    SUPABASE_URL: string,
    SUPABASE_SECRET_KEY: string
}
import type { SupabaseClient } from "@supabase/supabase-js";

export type SupabaseClientType = SupabaseClient;