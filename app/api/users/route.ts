import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET /api/users?type=shop|apprentice&email=foo@bar.com
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const email = searchParams.get("email")

    // Basic query — replace with proper schema once tables exist
    let query = "SELECT * FROM users"
    const filters: string[] = []
    const params: (string | null)[] = []

    if (type) {
      filters.push("type = $1")
      params.push(type)
    }
    if (email) {
      filters.push(`${params.length ? "AND " : ""}email = $${params.length + 1}`)
      params.push(email)
    }
    if (filters.length) query += " WHERE " + filters.join(" ")

    // If the users table doesn’t exist yet, return demo data instead of 500
    let rows
    try {
      rows = await sql(query, params)
    } catch {
      rows = [
        {
          id: "demo-1",
          type: "apprentice",
          email: "demo@crew.dev",
          firstName: "Demo",
          lastName: "User",
          city: "Nowhere",
          state: "NA",
          createdAt: new Date().toISOString(),
          profileComplete: false,
        },
      ]
    }

    return NextResponse.json(rows, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message ?? "Unhandled error" }, { status: 500 })
  }
}
