import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    const [updatedInvitation] = await sql`
      UPDATE job_invitations
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedInvitation) {
      return NextResponse.json({ message: "Job invitation not found" }, { status: 404 })
    }

    return NextResponse.json(updatedInvitation, { status: 200 })
  } catch (error) {
    console.error("Error updating job invitation:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
