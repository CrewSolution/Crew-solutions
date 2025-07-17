import { neon } from "@neondatabase/serverless"
import type { NeonQueryFunction } from "@neondatabase/serverless"

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.")
}

// Create a singleton Neon client
const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL)

export { sql }
