import { neon, neonConfig } from "@neondatabase/serverless"

neonConfig.fetchConnectionCache = true

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// This is for Prisma, if you decide to use it later.
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const adapter = new PrismaNeon(pool);
// export const prisma = new PrismaClient({ adapter });
