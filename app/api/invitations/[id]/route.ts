import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invitations = await sql`
      SELECT * FROM job_invitations WHERE id = ${params.id}
    `

    if (invitations.length === 0) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    return NextResponse.json(invitations[0])
  } catch (error) {
    console.error("Get invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invitationData = await request.json()

    const result = await sql`
      UPDATE job_invitations 
      SET 
        status = ${invitationData.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
