import { neon } from "@neondatabase/serverless"

// Use the DATABASE_URL environment variable provided by Vercel
// This client is for server-side use (e.g., API routes)
export const sql = neon(process.env.DATABASE_URL!)

// Optional: If you need a connection pool for more complex scenarios
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export { pool };
