import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const invitations = await sql`
      SELECT * FROM job_invitations WHERE id = ${id}
    `

    if (invitations.length === 0) {
      return NextResponse.json({ error: "Job invitation not found" }, { status: 404 })
    }

    return NextResponse.json({ jobInvitation: invitations[0] })
  } catch (error) {
    console.error("Get job invitation by ID error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const invitationData = await request.json()

    const updateFields: string[] = []
    const updateValues: any[] = []

    for (const key in invitationData) {
      if (invitationData[key] !== undefined && key !== "id" && key !== "created_at") {
        if (key === "work_days" || key === "requirements" || key === "required_skills") {
          updateFields.push(`${key} = $${updateFields.length + 1}`)
          updateValues.push(invitationData[key] ? sql.array(invitationData[key]) : null)
        } else {
          updateFields.push(`${key} = $${updateFields.length + 1}`)
          updateValues.push(invitationData[key])
        }
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 200 })
    }

    updateValues.push(id) // Add id for WHERE clause

    const query = `
      UPDATE job_invitations
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await sql.query(query, updateValues)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Job invitation not found or no changes made" }, { status: 404 })
    }

    return NextResponse.json({ jobInvitation: result.rows[0] })
  } catch (error) {
    console.error("Update job invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM job_invitations WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Job invitation not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job invitation deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete job invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
