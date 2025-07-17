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

    // Remove sensitive data and convert snake_case to camelCase
    const { password: _, ...userWithoutPassword } = user
    const result = Object.fromEntries(
      Object.entries(userWithoutPassword).map(([key, value]) => [
        key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()),
        value,
      ]),
    )

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updateData = await request.json()

    // Convert camelCase to snake_case for database update
    const dbUpdateData: Record<string, any> = {}
    for (const key in updateData) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        const dbKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        dbUpdateData[dbKey] = updateData[key]
      }
    }

    const [updatedUser] = await sql`
      UPDATE users
      SET ${sql(dbUpdateData, Object.keys(dbUpdateData))}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Remove sensitive data and convert snake_case back to camelCase for response
    const { password: _, ...userWithoutPassword } = updatedUser
    const result = Object.fromEntries(
      Object.entries(userWithoutPassword).map(([key, value]) => [
        key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()),
        value,
      ]),
    )

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
