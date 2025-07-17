import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const users = await sql`SELECT * FROM users WHERE id = ${id}`
    const user = users[0]

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { password, ...updateData } = body // Don't allow password update via this route directly

    // Convert skills array to PostgreSQL array literal if present
    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills = sql.array(updateData.skills, "text")
    }

    // Convert hours_completed to integer if present
    if (updateData.hoursCompleted !== undefined) {
      updateData.hours_completed = Number.parseInt(updateData.hoursCompleted)
      delete updateData.hoursCompleted // Remove original key
    }

    // Convert rating and jobs_completed to numbers
    if (updateData.rating !== undefined) {
      updateData.rating = Number.parseFloat(updateData.rating)
    }
    if (updateData.jobsCompleted !== undefined) {
      updateData.jobs_completed = Number.parseInt(updateData.jobsCompleted)
      delete updateData.jobsCompleted
    }

    const [updatedUser] = await sql`
      UPDATE users SET ${sql(
        updateData,
        "first_name",
        "last_name",
        "business_name",
        "owner_name",
        "phone",
        "address",
        "city",
        "state",
        "zip_code",
        "business_type",
        "license_number",
        "date_of_birth",
        "experience_level",
        "education",
        "school_name",
        "major",
        "hours_completed",
        "availability",
        "transportation",
        "willing_to_travel",
        "skills",
        "rating",
        "jobs_completed",
        "goals",
        "bio",
        "profile_image",
        "bank_account",
        "routing_number",
      )}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
