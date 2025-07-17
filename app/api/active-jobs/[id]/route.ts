import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const activeJobs = await sql`
      SELECT * FROM active_jobs WHERE id = ${id}
    `

    if (activeJobs.length === 0) {
      return NextResponse.json({ error: "Active job not found" }, { status: 404 })
    }

    return NextResponse.json({ activeJob: activeJobs[0] })
  } catch (error) {
    console.error("Get active job by ID error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const jobData = await request.json()

    const updateFields: string[] = []
    const updateValues: any[] = []

    for (const key in jobData) {
      if (jobData[key] !== undefined && key !== "id" && key !== "created_at") {
        updateFields.push(`${key} = $${updateFields.length + 1}`)
        updateValues.push(jobData[key])
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 200 })
    }

    updateValues.push(id) // Add id for WHERE clause

    const query = `
      UPDATE active_jobs
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await sql.query(query, updateValues)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Active job not found or no changes made" }, { status: 404 })
    }

    return NextResponse.json({ activeJob: result.rows[0] })
  } catch (error) {
    console.error("Update active job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM active_jobs WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Active job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Active job deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete active job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
