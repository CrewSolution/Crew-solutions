import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcrypt"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql.query("SELECT * FROM users WHERE id = $1", [id])

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { password, ...updateData } = body

    const updateQueryParts: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    for (const key in updateData) {
      updateQueryParts.push(`${key} = $${paramIndex++}`)
      updateValues.push(updateData[key])
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQueryParts.push(`password = $${paramIndex++}`)
      updateValues.push(hashedPassword)
    }

    if (updateQueryParts.length === 0) {
      return NextResponse.json({ message: "No update data provided" }, { status: 400 })
    }

    updateValues.push(id) // Add ID for WHERE clause

    const query = `
      UPDATE users
      SET ${updateQueryParts.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const { rows } = await sql.query(query, updateValues)

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found or no changes made" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Error updating user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rowCount } = await sql.query("DELETE FROM users WHERE id = $1", [id])

    if (rowCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 })
  }
}
