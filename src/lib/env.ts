import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
})

export function validateEnv() {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten().fieldErrors)
    return false
  }
  return true
}

export function getEnv() {
  return envSchema.parse(process.env)
}
