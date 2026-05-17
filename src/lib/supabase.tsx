import { createClient } from "@supabase/supabase-js"
import { getEnv } from "./env"

const { NEXT_PUBLIC_SUPABASE_URL: supabaseUrl, NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey } = getEnv()

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
