import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs" // Import bcryptjs
import { v4 as uuidv4 } from "uuid"

type UserRow = {
  id: string
  type: "shop" | "apprentice"
  email: string
  password?: string // Only for POST, not returned in GET
  first_name?: string
  last_name?: string
  business_name?: string
  owner_name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  business_type?: string
  license_number?: string
  date_of_birth?: Date
  experience_level?: string
  education?: string
  school_name?: string
  major?: string
  hours_completed?: number
  availability?: string
  transportation?: boolean
  willing_to_travel?: boolean
  skills?: string[]
  rating?: number
  jobs_completed?: number
  goals?: string
  bio?: string
  profile_image?: string
  bank_account?: string
  routing_number?: string
  created_at?: Date
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

    let query = "SELECT * FROM users"
    const params: string[] = []

    if (type) {
      query += " WHERE type = $1"
      params.push(type)
    }

    const { rows } = await sql.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, email, password, ...userData } = body

    if (!type || !email || !password) {
      return NextResponse.json({ message: "Type, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql.query("SELECT id FROM users WHERE email = $1", [email])
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    const query = `
      INSERT INTO users (id, type, email, password, ${Object.keys(userData).join(", ")})
      VALUES ($1, $2, $3, $4, ${Object.keys(userData)
        .map((_, i) => `$${i + 5}`)
        .join(", ")})
      RETURNING id, type, email
    `
    const values = [id, type, email, hashedPassword, ...Object.values(userData)]

    const { rows } = await sql.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Error creating user" }, { status: 500 })
  }
}
