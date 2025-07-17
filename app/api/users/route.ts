import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcrypt" // Import bcrypt

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
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
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
      "SELECT id, type, email, first_name, last_name, city, state, created_at, profile_complete, experience_level, skills, availability, rating FROM users" +
      (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const users: UserRow[] = await sql(query, params)

    // Convert snake_case → camelCase for client
    const result = users.map((u) => ({
      id: u.id,
      type: u.type,
      email: u.email,
      firstName: u.first_name ?? "",
      lastName: u.last_name ?? "",
      city: u.city ?? "",
      state: u.state ?? "",
      createdAt: u.created_at?.toISOString() ?? new Date().toISOString(),
      profileComplete: u.profile_complete ?? false,
      experienceLevel: u.experience_level ?? "",
      skills: u.skills ?? [],
      availability: u.availability ?? "",
      rating: u.rating ?? 0,
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password, ...userData } = body

    if (!password) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Map camelCase to snake_case for database insertion
    const dbData: Record<string, any> = {
      type: userData.type,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      city: userData.city,
      state: userData.state,
      created_at: new Date().toISOString(),
      profile_complete: true, // Assume complete on signup
      rating: 0,
      jobs_completed: 0,
    }

    if (userData.type === "shop") {
      dbData.business_name = userData.businessName
      dbData.owner_name = userData.ownerName
      dbData.address = userData.address
      dbData.zip_code = userData.zipCode
      dbData.business_type = userData.businessType
      dbData.license_number = userData.licenseNumber
    } else {
      // Apprentice fields
      dbData.first_name = userData.firstName
      dbData.last_name = userData.lastName
      dbData.address = userData.address
      dbData.zip_code = userData.zipCode
      dbData.date_of_birth = userData.dateOfBirth
      dbData.experience_level = userData.experienceLevel
      dbData.education = userData.education
      dbData.school_name = userData.schoolName
      dbData.major = userData.major
      dbData.hours_completed = userData.hoursCompleted ? Number.parseInt(userData.hoursCompleted) : 0
      dbData.availability = userData.availability
      dbData.transportation = userData.transportation || false
      dbData.willing_to_travel = userData.willingToTravel || false
      dbData.skills = userData.skills || []
    }

    const [newUser] = await sql`
      INSERT INTO users ${sql(dbData, Object.keys(dbData))}
      RETURNING id, type, email, first_name, last_name, business_name, owner_name, phone, address, city, state, zip_code, business_type, license_number, date_of_birth, experience_level, education, school_name, major, hours_completed, availability, transportation, willing_to_travel, skills, rating, jobs_completed, goals, bio, profile_image, bank_account, routing_number, created_at, profile_complete
    `

    // Convert snake_case back to camelCase for the response
    const userResponse = {
      id: newUser.id,
      type: newUser.type,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      businessName: newUser.business_name,
      ownerName: newUser.owner_name,
      phone: newUser.phone,
      address: newUser.address,
      city: newUser.city,
      state: newUser.state,
      zipCode: newUser.zip_code,
      businessType: newUser.business_type,
      licenseNumber: newUser.license_number,
      dateOfBirth: newUser.date_of_birth?.toISOString().split("T")[0], // Format date back to YYYY-MM-DD
      experienceLevel: newUser.experience_level,
      education: newUser.education,
      schoolName: newUser.school_name,
      major: newUser.major,
      hoursCompleted: newUser.hours_completed,
      availability: newUser.availability,
      transportation: newUser.transportation,
      willingToTravel: newUser.willing_to_travel,
      skills: newUser.skills,
      rating: newUser.rating,
      jobsCompleted: newUser.jobs_completed,
      goals: newUser.goals,
      bio: newUser.bio,
      profileImage: newUser.profile_image,
      bankAccount: newUser.bank_account,
      routingNumber: newUser.routing_number,
      createdAt: newUser.created_at?.toISOString(),
      profileComplete: newUser.profile_complete,
    }

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    if (error.message.includes('duplicate key value violates unique constraint "users_email_key"')) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
