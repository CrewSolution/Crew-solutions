import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const users = await sql`
      SELECT id, email, type, first_name, last_name, phone, city, state, zip_code, 
             profile_image, rating, jobs_completed, business_name, owner_name, 
             business_type, years_in_business, license_number, experience_level, 
             skills, availability, hourly_rate_min, hourly_rate_max, education, 
             certifications, bio, willing_to_travel, has_own_tools, has_transportation,
             created_at, updated_at
      FROM users
      WHERE id = ${id}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Get user by ID error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const userData = await request.json()

    const updateFields: string[] = []
    const updateValues: any[] = []

    for (const key in userData) {
      if (userData[key] !== undefined && key !== "id" && key !== "email" && key !== "type" && key !== "password") {
        updateFields.push(`${key} = $${updateFields.length + 1}`)
        updateValues.push(userData[key])
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 200 })
    }

    updateValues.push(id) // Add id for WHERE clause

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${updateValues.length}
      RETURNING id, email, type, first_name, last_name, phone, city, state, zip_code,
                profile_image, rating, jobs_completed, business_name, owner_name,
                business_type, years_in_business, license_number, experience_level,
                skills, availability, hourly_rate_min, hourly_rate_max, education,
                certifications, bio, willing_to_travel, has_own_tools, has_transportation,
                created_at, updated_at
    `

    const result = await sql.query(query, updateValues)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
