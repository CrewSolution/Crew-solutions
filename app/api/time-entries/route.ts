import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const apprenticeId = searchParams.get("apprenticeId")

    let timeEntries
    if (jobId) {
      timeEntries = await sql`SELECT * FROM time_entries WHERE job_id = ${jobId} ORDER BY date DESC`
    } else if (apprenticeId) {
      timeEntries = await sql`SELECT * FROM time_entries WHERE apprentice_id = ${apprenticeId} ORDER BY date DESC`
    } else {
      timeEntries = await sql`SELECT * FROM time_entries ORDER BY date DESC`
    }

    return NextResponse.json(timeEntries, { status: 200 })
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const [newEntry] = await sql`
      INSERT INTO time_entries ${sql(
        {
          ...body,
          submitted_at: new Date().toISOString(),
        },
        "job_id",
        "apprentice_id",
        "date",
        "hours",
        "approved",
        "submitted_at",
        "approved_at",
      )}
      RETURNING *
    `

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error) {
    console.error("Error creating time entry:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, approved } = await request.json()

    if (!id || typeof approved !== "boolean") {
      return NextResponse.json({ message: "ID and approved status are required" }, { status: 400 })
    }

    const [updatedEntry] = await sql`
      UPDATE time_entries
      SET approved = ${approved}, approved_at = ${new Date().toISOString()}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedEntry) {
      return NextResponse.json({ message: "Time entry not found" }, { status: 404 })
    }

    return NextResponse.json(updatedEntry, { status: 200 })
  } catch (error) {
    console.error("Error updating time entry:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
