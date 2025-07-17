import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql.query("SELECT * FROM job_postings WHERE id = $1", [id])

    if (rows.length === 0) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching job posting:", error)
    return NextResponse.json({ message: "Error fetching job posting" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { userId, userType } = JSON.parse(session)

    const { id } = params
    const body = await request.json()
    const { applicants, ...updateData } = body // Exclude applicants from direct update

    // Fetch the existing job posting to verify ownership
    const existingJob = await sql.query("SELECT shop_id FROM job_postings WHERE id = $1", [id])
    if (existingJob.rows.length === 0) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }
    if (existingJob.rows[0].shop_id !== userId || userType !== "shop") {
      return NextResponse.json({ message: "Forbidden: You can only update your own job postings" }, { status: 403 })
    }

    const updateQueryParts: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    for (const key in updateData) {
      updateQueryParts.push(`${key} = $${paramIndex++}`)
      updateValues.push(updateData[key])
    }

    if (updateQueryParts.length === 0) {
      return NextResponse.json({ message: "No update data provided" }, { status: 400 })
    }

    updateValues.push(id) // Add ID for WHERE clause

    const query = `
      UPDATE job_postings
      SET ${updateQueryParts.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const { rows } = await sql.query(query, updateValues)

    if (rows.length === 0) {
      return NextResponse.json({ message: "Job posting not found or no changes made" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { userId, userType } = JSON.parse(session)

    const { id } = params

    // Fetch the existing job posting to verify ownership
    const existingJob = await sql.query("SELECT shop_id FROM job_postings WHERE id = $1", [id])
    if (existingJob.rows.length === 0) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }
    if (existingJob.rows[0].shop_id !== userId || userType !== "shop") {
      return NextResponse.json({ message: "Forbidden: You can only delete your own job postings" }, { status: 403 })
    }

    const { rowCount } = await sql.query("DELETE FROM job_postings WHERE id = $1", [id])

    if (rowCount === 0) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Job posting deleted successfully" })
  } catch (error) {
    console.error("Error deleting job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
