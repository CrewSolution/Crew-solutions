import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type TimeEntryRow = {
  id: string
  job_id: string
  apprentice_id: string
  date: Date
  hours: number
  approved: boolean
  submitted_at: Date
  approved_at?: Date
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const apprenticeId = searchParams.get("apprenticeId")

    const where: string[] = []
    const params: any[] = []

    if (jobId) {
      params.push(jobId)
      where.push(`job_id = $${params.length}`)
    }
    if (apprenticeId) {
      params.push(apprenticeId)
      where.push(`apprentice_id = $${params.length}`)
    }

    const query = "SELECT * FROM time_entries" + (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const entries: TimeEntryRow[] = await sql(query, params)

    const result = entries.map((e) => ({
      id: e.id,
      jobId: e.job_id,
      apprenticeId: e.apprentice_id,
      date: e.date.toISOString().split("T")[0],
      hours: e.hours,
      approved: e.approved,
      submittedAt: e.submitted_at.toISOString(),
      approvedAt: e.approved_at?.toISOString(),
    }))

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const entryData = await request.json()

    const dbData: Record<string, any> = {
      id: `time-entry-${Date.now()}`,
      job_id: entryData.jobId,
      apprentice_id: entryData.apprenticeId,
      date: entryData.date,
      hours: entryData.hours,
      approved: entryData.approved || false,
      submitted_at: new Date().toISOString(),
      approved_at: entryData.approvedAt,
    }

    const [newEntry] = await sql`
      INSERT INTO time_entries ${sql(dbData, Object.keys(dbData))}
      RETURNING *
    `

    const result = {
      id: newEntry.id,
      jobId: newEntry.job_id,
      apprenticeId: newEntry.apprentice_id,
      date: newEntry.date.toISOString().split("T")[0],
      hours: newEntry.hours,
      approved: newEntry.approved,
      submittedAt: newEntry.submitted_at.toISOString(),
      approvedAt: newEntry.approved_at?.toISOString(),
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating time entry:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updateData = await request.json()
    const { id, approved } = updateData

    if (!id || typeof approved !== "boolean") {
      return NextResponse.json({ message: "ID and approved status are required" }, { status: 400 })
    }

    const [updatedEntry] = await sql`
      UPDATE time_entries
      SET approved = ${approved}, approved_at = ${approved ? new Date().toISOString() : null}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedEntry) {
      return NextResponse.json({ message: "Time entry not found" }, { status: 404 })
    }

    const result = {
      id: updatedEntry.id,
      jobId: updatedEntry.job_id,
      apprenticeId: updatedEntry.apprentice_id,
      date: updatedEntry.date.toISOString().split("T")[0],
      hours: updatedEntry.hours,
      approved: updatedEntry.approved,
      submittedAt: updatedEntry.submitted_at.toISOString(),
      approvedAt: updatedEntry.approved_at?.toISOString(),
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating time entry:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
