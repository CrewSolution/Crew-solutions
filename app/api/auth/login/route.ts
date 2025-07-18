import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Convert snake_case keys to camelCase for client-side consistency
    const camelCaseUser = {
      id: user.id,
      type: user.type,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      businessName: user.business_name,
      ownerName: user.owner_name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zip_code,
      businessType: user.business_type,
      licenseNumber: user.license_number,
      dateOfBirth: user.date_of_birth,
      experienceLevel: user.experience_level,
      education: user.education,
      schoolName: user.school_name,
      major: user.major,
      hoursCompleted: user.hours_completed,
      availability: user.availability,
      transportation: user.transportation,
      willingToTravel: user.willing_to_travel,
      skills: user.skills,
      rating: user.rating,
      jobsCompleted: user.jobs_completed,
      goals: user.goals,
      bio: user.bio,
      profileImage: user.profile_image,
      bankAccount: user.bank_account,
      routingNumber: user.routing_number,
      createdAt: user.created_at,
      profileComplete: user.profile_complete,
    }

    return NextResponse.json({ user: camelCaseUser }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
