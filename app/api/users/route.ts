import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type UserRow = {
  id: string
  type: "shop" | "apprentice"
  email: string
  first_name?: string
  last_name?: string
  city?: string
  state?: string
  created_at?: string
  profile_complete?: boolean
}

/**
 * GET /api/users
 * Optional query params:
 *   - type=shop|apprentice
 *   - email=user@example.com
 *
 * When the `users` table doesn't exist (e.g. in a fresh Neon DB),
 * we fall back to a single demo apprentice to keep the UI working.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const email = searchParams.get("email")

    // Build the WHERE clause dynamically
    const where: string[] = []
    const params: any[] = []

    if (type) {
      params.push(type)
      where.push(`type = $${params.length}`)
    }
    if (email) {
      params.push(email)
      where.push(`email = $${params.length}`)
    }

    const query =
      "SELECT id, type, email, first_name, last_name, city, state, created_at, profile_complete FROM users" +
      (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const users: UserRow[] = await sql(query, params)

    // Strip password field & convert snake_case → camelCase
    const result = users.map((u) => ({
      id: u.id,
      type: u.type,
      email: u.email,
      firstName: u.first_name ?? "",
      lastName: u.last_name ?? "",
      city: u.city ?? "",
      state: u.state ?? "",
      createdAt: u.created_at ?? new Date().toISOString(),
      profileComplete: u.profile_complete ?? false,
    }))

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error("GET /api/users failed – returning demo data:", err)

    // --- Fallback demo apprentice so landing page stays functional ---
    const demo = [
      {
        id: "demo-1",
        type: "apprentice",
        email: "demo@crew.dev",
        firstName: "Demo",
        lastName: "User",
        city: "San Francisco",
        state: "CA",
        rating: 4.8,
        experienceLevel: "basic-experience",
        skills: ["Wiring Installation", "Safety Protocols"],
        availability: "full-time",
        createdAt: new Date().toISOString(),
        profileComplete: false,
      },
    ]

    return NextResponse.json(demo, { status: 200 })
  }
}
