import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const users = await sql`
      SELECT id, email, type, first_name, last_name, phone, city, state, zip_code,
             profile_image, rating, jobs_completed, business_name, owner_name,
             business_type, years_in_business, license_number, experience_level,
             skills, availability, hourly_rate_min, hourly_rate_max, education,
             certifications, bio, willing_to_travel, has_own_tools, has_transportation,
             created_at, updated_at
      FROM users 
      WHERE id = ${params.id}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()

    const result = await sql`
      UPDATE users 
      SET 
        first_name = ${userData.first_name || null},
        last_name = ${userData.last_name || null},
        phone = ${userData.phone || null},
        city = ${userData.city || null},
        state = ${userData.state || null},
        zip_code = ${userData.zip_code || null},
        profile_image = ${userData.profile_image || null},
        business_name = ${userData.business_name || null},
        owner_name = ${userData.owner_name || null},
        business_type = ${userData.business_type || null},
        years_in_business = ${userData.years_in_business || null},
        license_number = ${userData.license_number || null},
        experience_level = ${userData.experience_level || null},
        skills = ${userData.skills || null},
        availability = ${userData.availability || null},
        hourly_rate_min = ${userData.hourly_rate_min || null},
        hourly_rate_max = ${userData.hourly_rate_max || null},
        education = ${userData.education || null},
        bio = ${userData.bio || null},
        willing_to_travel = ${userData.willing_to_travel || false},
        has_own_tools = ${userData.has_own_tools || false},
        has_transportation = ${userData.has_transportation || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING id, email, type, first_name, last_name, phone, city, state, zip_code,
                profile_image, rating, jobs_completed, business_name, owner_name,
                business_type, years_in_business, license_number, experience_level,
                skills, availability, hourly_rate_min, hourly_rate_max, education,
                certifications, bio, willing_to_travel, has_own_tools, has_transportation,
                created_at, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
