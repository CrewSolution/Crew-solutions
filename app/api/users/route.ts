import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const {
      type,
      email,
      password,
      firstName,
      lastName,
      businessName,
      ownerName,
      phone,
      address,
      city,
      state,
      zipCode,
      businessType,
      licenseNumber,
      dateOfBirth,
      experienceLevel,
      education,
      schoolName,
      major,
      hoursCompleted,
      availability,
      transportation,
      willingToTravel,
      skills,
      goals,
      bio,
      profileImage,
      bankAccount,
      routingNumber,
    } = userData

    if (!email || !password || !type) {
      return NextResponse.json({ error: "Email, password, and user type are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()
    const createdAt = new Date().toISOString()
    const profileComplete = false // Default to false, can be updated later

    let newUser
    if (type === "shop") {
      if (!businessName || !ownerName || !phone || !city || !state) {
        return NextResponse.json({ error: "Missing required fields for shop signup" }, { status: 400 })
      }
      newUser = await sql`
        INSERT INTO users (
          id, type, email, password_hash, business_name, owner_name, phone, address, city, state, zip_code,
          business_type, license_number, created_at, profile_complete
        ) VALUES (
          ${id}, ${type}, ${email}, ${hashedPassword}, ${businessName}, ${ownerName}, ${phone}, ${address}, ${city}, ${state}, ${zipCode},
          ${businessType}, ${licenseNumber}, ${createdAt}, ${profileComplete}
        ) RETURNING *
      `
    } else if (type === "apprentice") {
      if (!firstName || !lastName || !phone || !city || !state || !experienceLevel || !availability) {
        return NextResponse.json({ error: "Missing required fields for apprentice signup" }, { status: 400 })
      }
      newUser = await sql`
        INSERT INTO users (
          id, type, email, password_hash, first_name, last_name, phone, address, city, state, zip_code,
          date_of_birth, experience_level, education, school_name, major, hours_completed, availability,
          transportation, willing_to_travel, skills, goals, bio, profile_image, bank_account, routing_number,
          created_at, profile_complete
        ) VALUES (
          ${id}, ${type}, ${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${phone}, ${address}, ${city}, ${state}, ${zipCode},
          ${dateOfBirth}, ${experienceLevel}, ${education}, ${schoolName}, ${major}, ${hoursCompleted}, ${availability},
          ${transportation}, ${willingToTravel}, ${sql.array(skills || [], "text")}, ${goals}, ${bio}, ${profileImage}, ${bankAccount}, ${routingNumber},
          ${createdAt}, ${profileComplete}
        ) RETURNING *
      `
    } else {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }

    // Convert snake_case keys to camelCase for client-side consistency
    const createdUser = newUser[0]
    const camelCaseUser = {
      id: createdUser.id,
      type: createdUser.type,
      email: createdUser.email,
      firstName: createdUser.first_name,
      lastName: createdUser.last_name,
      businessName: createdUser.business_name,
      ownerName: createdUser.owner_name,
      phone: createdUser.phone,
      address: createdUser.address,
      city: createdUser.city,
      state: createdUser.state,
      zipCode: createdUser.zip_code,
      businessType: createdUser.business_type,
      licenseNumber: createdUser.license_number,
      dateOfBirth: createdUser.date_of_birth,
      experienceLevel: createdUser.experience_level,
      education: createdUser.education,
      schoolName: createdUser.school_name,
      major: createdUser.major,
      hoursCompleted: createdUser.hours_completed,
      availability: createdUser.availability,
      transportation: createdUser.transportation,
      willingToTravel: createdUser.willing_to_travel,
      skills: createdUser.skills,
      rating: createdUser.rating,
      jobsCompleted: createdUser.jobs_completed,
      goals: createdUser.goals,
      bio: createdUser.bio,
      profileImage: createdUser.profile_image,
      bankAccount: createdUser.bank_account,
      routingNumber: createdUser.routing_number,
      createdAt: createdUser.created_at,
      profileComplete: createdUser.profile_complete,
    }

    return NextResponse.json({ user: camelCaseUser }, { status: 201 })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    let users
    if (id) {
      users = await sql`SELECT * FROM users WHERE id = ${id}`
    } else if (email) {
      users = await sql`SELECT * FROM users WHERE email = ${email}`
    } else {
      users = await sql`SELECT * FROM users`
    }

    const camelCaseUsers = users.map((user: any) => ({
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
    }))

    return NextResponse.json({ users: camelCaseUsers }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
