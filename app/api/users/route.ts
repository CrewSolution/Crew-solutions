import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const email = searchParams.get("email")

    let users
    if (type) {
      users = await sql`SELECT * FROM users WHERE type = ${type}`
    } else if (email) {
      users = await sql`SELECT * FROM users WHERE email = ${email}`
    } else {
      users = await sql`SELECT * FROM users`
    }

    // Remove passwords before sending
    const usersWithoutPasswords = users.map(({ password: _, ...user }) => user)

    return NextResponse.json(usersWithoutPasswords, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password, ...userData } = body

    if (!password) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [newUser] = await sql`
      INSERT INTO users ${sql(
        {
          ...userData,
          password: hashedPassword,
          created_at: new Date().toISOString(),
          profile_complete: true,
          hours_completed: userData.hoursCompleted ? Number.parseInt(userData.hoursCompleted) : 0,
          rating: userData.rating || 0,
          jobs_completed: userData.jobsCompleted || 0,
          transportation: userData.transportation || false,
          willing_to_travel: userData.willingToTravel || false,
          skills: userData.skills || [],
        },
        "type",
        "email",
        "password",
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
        "created_at",
        "profile_complete",
      )}
      RETURNING *
    `

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    if (error.message.includes('duplicate key value violates unique constraint "users_email_key"')) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
