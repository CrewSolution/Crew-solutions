import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

// Helper to convert snake_case to camelCase recursively
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v))
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
      acc[camelKey] = toCamelCase(obj[key])
      return acc
    }, {})
  }
  return obj
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password hash and convert to camelCase
    const { password_hash, ...userWithoutPasswordHash } = user
    const camelCaseUser = toCamelCase(userWithoutPasswordHash)

    return NextResponse.json({
      user: camelCaseUser,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
