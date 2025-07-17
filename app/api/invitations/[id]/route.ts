import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql.query("SELECT * FROM job_invitations WHERE id = $1", [id])

    if (rows.length === 0) {
      return NextResponse.json({ message: "Job invitation not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching job invitation:", error)
    return NextResponse.json({ message: "Error fetching job invitation" }, { status: 500 })
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
    const { status, ...updateData } = body

    // Fetch the existing invitation to verify permissions
    const existingInvitation = await sql.query("SELECT shop_id, apprentice_id FROM job_invitations WHERE id = $1", [id])
    if (existingInvitation.rows.length === 0) {
      return NextResponse.json({ message: "Job invitation not found" }, { status: 404 })
    }

    const invitation = existingInvitation.rows[0]

    // Only the apprentice can accept/decline, and only the shop can update other details
    if (status && userType === "apprentice" && userId === invitation.apprentice_id) {
      // Apprentice can only update status
      const { rows } = await sql.query("UPDATE job_invitations SET status = $1 WHERE id = $2 RETURNING *", [status, id])
      return NextResponse.json(rows[0])
    } else if (userType === "shop" && userId === invitation.shop_id) {
      // Shop can update other details (excluding status if apprentice is involved)
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
        UPDATE job_invitations
        SET ${updateQueryParts.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *
      `
      const { rows } = await sql.query(query, updateValues)
      return NextResponse.json(rows[0])
    } else {
      return NextResponse.json(
        { message: "Forbidden: You do not have permission to update this invitation" },
        { status: 403 },
      )
    }
  } catch (error) {
    console.error("Error updating job invitation:", error)
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

    // Fetch the existing invitation to verify ownership/permissions
    const existingInvitation = await sql.query("SELECT shop_id FROM job_invitations WHERE id = $1", [id])
    if (existingInvitation.rows.length === 0) {
      return NextResponse.json({ message: "Job invitation not found" }, { status: 404 })
    }

    const invitation = existingInvitation.rows[0]

    // Only the shop who sent the invitation can delete it
    if (userType === "shop" && userId !== invitation.shop_id) {
      return NextResponse.json({ message: "Forbidden: You can only delete your own invitations" }, { status: 403 })
    }

    const { rowCount } = await sql.query("DELETE FROM job_invitations WHERE id = $1", [id])

    if (rowCount === 0) {
      return NextResponse.json({ message: "Job invitation not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Job invitation deleted successfully" })
  } catch (error) {
    console.error("Error deleting job invitation:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
