import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

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
  updated_at?: Date
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const query = `SELECT id, email, type, first_name, last_name, phone, city, state, zip_code, 
                        profile_image, rating, jobs_completed, business_name, owner_name, 
                        business_type, years_in_business, license_number, experience_level, 
                        skills, availability, hourly_rate_min, hourly_rate_max, education, 
                        certifications, bio, willing_to_travel, has_own_tools, has_transportation,
                        created_at, updated_at
                 FROM users`

    const users = type ? await sql`SELECT * FROM users WHERE type = ${type}` : await sql`SELECT * FROM users`

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

    // Handle skills array for PostgreSQL
    const skillsArray =
      userData.skills && Array.isArray(userData.skills) && userData.skills.length > 0
        ? sql.array(userData.skills)
        : null

    // Insert user
    const result = await sql`
      INSERT INTO users (
        email, password_hash, type, first_name, last_name, phone, city, state, zip_code,
        business_name, owner_name, business_type, years_in_business, license_number,
        experience_level, skills, availability, hourly_rate_min, hourly_rate_max,
        education, bio, willing_to_travel, has_own_tools, has_transportation
      ) VALUES (
        ${userData.email}, ${hashedPassword}, ${userData.type}, ${userData.first_name || null},
        ${userData.last_name || null}, ${userData.phone || null}, ${userData.city || null},
        ${userData.state || null}, ${userData.zip_code || null}, ${userData.business_name || null},
        ${userData.owner_name || null}, ${userData.business_type || null}, 
        ${userData.years_in_business || null}, ${userData.license_number || null},
        ${userData.experience_level || null}, ${skillsArray}, 
        ${userData.availability || null}, ${userData.hourly_rate_min || null},
        ${userData.hourly_rate_max || null}, ${userData.education || null}, 
        ${userData.bio || null}, ${userData.willing_to_travel || false},
        ${userData.has_own_tools || false}, ${userData.has_transportation || false}
      )
      RETURNING id, email, type, first_name, last_name, phone, city, state, zip_code,
                business_name, owner_name, business_type, years_in_business, license_number,
                experience_level, skills, availability, hourly_rate_min, hourly_rate_max,
                education, bio, willing_to_travel, has_own_tools, has_transportation,
                rating, jobs_completed, created_at, updated_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Create user error:", error)

    if (error.code === "23505") {
      // Unique violation
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
