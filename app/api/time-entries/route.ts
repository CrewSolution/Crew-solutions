import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const apprenticeId = searchParams.get("apprenticeId")
    const approved = searchParams.get("approved")

    let query = "SELECT * FROM time_entries"
    const params: any[] = []
    const conditions: string[] = []
    let paramIndex = 1

    if (jobId) {
      conditions.push(`job_id = $${paramIndex++}`)
      params.push(jobId)
    }
    if (apprenticeId) {
      conditions.push(`apprentice_id = $${paramIndex++}`)
      params.push(apprenticeId)
    }
    if (approved !== null) {
      conditions.push(`approved = $${paramIndex++}`)
      params.push(approved === "true")
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    const { rows } = await sql.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json({ message: "Error fetching time entries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { userId, userType } = JSON.parse(session)

    if (userType !== "apprentice") {
      return NextResponse.json({ message: "Only apprentices can submit time entries" }, { status: 403 })
    }

    const body = await request.json()
    const { job_id, date, hours } = body

    if (!job_id || !date || !hours) {
      return NextResponse.json({ message: "Missing required time entry fields" }, { status: 400 })
    }

    // Ensure the apprentice_id matches the current user
    if (userId !== body.apprentice_id) {
      return NextResponse.json({ message: "Forbidden: You can only submit time for yourself" }, { status: 403 })
    }

    const id = uuidv4()
    const submitted_at = new Date().toISOString()
    const approved = false // Default to not approved

    const query = `
      INSERT INTO time_entries (id, job_id, apprentice_id, date, hours, approved, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    const values = [id, job_id, userId, date, hours, approved, submitted_at]

    const { rows } = await sql.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating time entry:", error)
    return NextResponse.json({ message: "Error creating time entry" }, { status: 500 })
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
    const { approved } = body

    // Fetch the time entry to verify permissions
    const existingEntry = await sql.query("SELECT job_id, apprentice_id FROM time_entries WHERE id = $1", [id])
    if (existingEntry.rows.length === 0) {
      return NextResponse.json({ message: "Time entry not found" }, { status: 404 })
    }

    const timeEntry = existingEntry.rows[0]

    // Only the shop associated with the job can approve time entries
    const job = await sql.query("SELECT shop_id FROM active_jobs WHERE id = $1", [timeEntry.job_id])
    if (job.rows.length === 0 || job.rows[0].shop_id !== userId || userType !== "shop") {
      return NextResponse.json(
        { message: "Forbidden: Only the associated shop can approve time entries" },
        { status: 403 },
      )
    }

    if (typeof approved !== "boolean") {
      return NextResponse.json({ message: 'Invalid "approved" value' }, { status: 400 })
    }

    const approved_at = approved ? new Date().toISOString() : null

    const { rows } = await sql.query(
      "UPDATE time_entries SET approved = $1, approved_at = $2 WHERE id = $3 RETURNING *",
      [approved, approved_at, id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ message: "Time entry not found or no changes made" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating time entry:", error)
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

    // Fetch the time entry to verify permissions
    const existingEntry = await sql.query("SELECT job_id, apprentice_id FROM time_entries WHERE id = $1", [id])
    if (existingEntry.rows.length === 0) {
      return NextResponse.json({ message: "Time entry not found" }, { status: 404 })
    }

    const timeEntry = existingEntry.rows[0]

    // Only the apprentice who submitted it or the associated shop can delete it
    const job = await sql.query("SELECT shop_id FROM active_jobs WHERE id = $1", [timeEntry.job_id])
    const isShopOfJob = job.rows.length > 0 && job.rows[0].shop_id === userId && userType === "shop"
    const isApprenticeOfEntry = timeEntry.apprentice_id === userId && userType === "apprentice"

    if (!isShopOfJob && !isApprenticeOfEntry) {
      return NextResponse.json(
        { message: "Forbidden: You do not have permission to delete this time entry" },
        { status: 403 },
      )
    }

    const { rowCount } = await sql.query("DELETE FROM time_entries WHERE id = $1", [id])

    if (rowCount === 0) {
      return NextResponse.json({ message: "Time entry not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Time entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting time entry:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
