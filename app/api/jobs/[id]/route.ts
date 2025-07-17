import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const jobPostings = await sql`
      SELECT * FROM job_postings WHERE id = ${id}
    `

    if (jobPostings.length === 0) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 })
    }

    return NextResponse.json({ jobPosting: jobPostings[0] })
  } catch (error) {
    console.error("Get job posting by ID error:", error)
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
      if (jobData[key] !== undefined && key !== "id" && key !== "shop_id" && key !== "posted_date") {
        if (key === "work_days" || key === "requirements" || key === "required_skills") {
          updateFields.push(`${key} = $${updateFields.length + 1}`)
          updateValues.push(jobData[key] ? sql.array(jobData[key]) : null)
        } else {
          updateFields.push(`${key} = $${updateFields.length + 1}`)
          updateValues.push(jobData[key])
        }
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 200 })
    }

    updateValues.push(id) // Add id for WHERE clause

    const query = `
      UPDATE job_postings
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await sql.query(query, updateValues)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Job posting not found or no changes made" }, { status: 404 })
    }

    return NextResponse.json({ jobPosting: result.rows[0] })
  } catch (error) {
    console.error("Update job posting error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM job_postings WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job posting deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete job posting error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
