import dotenv from "dotenv";

import {
    createClient
} from "@supabase/supabase-js";

import type { EnvConfig } from "./types";
import type { SupabaseClientType } from "./types";


dotenv.config();


// ========================================
// Environment Configuration
// ========================================

const env: EnvConfig = {

    SUPABASE_URL:
        process.env.SUPABASE_URL ?? "",

    SUPABASE_SECRET_KEY:
        process.env.SUPABASE_SECRET_KEY ?? ""

};


// ========================================
// Environment Validation
// ========================================

if (!env.SUPABASE_URL) {

    throw new Error(
        "SUPABASE_URL is missing"
    );

}


if (!env.SUPABASE_SECRET_KEY) {

    throw new Error(
        "SUPABASE_SECRET_KEY is missing"
    );

}


// ========================================
// Supabase Client
// ========================================

export const supabase: SupabaseClientType =
    createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SECRET_KEY
    );