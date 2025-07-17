import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const apprenticeId = searchParams.get("apprenticeId")

    let timeEntries
    if (jobId) {
      timeEntries = await sql`
        SELECT * FROM time_entries WHERE job_id = ${jobId} ORDER BY date DESC
      `
    } else if (apprenticeId) {
      timeEntries = await sql`
        SELECT * FROM time_entries WHERE apprentice_id = ${apprenticeId} ORDER BY date DESC
      `
    } else {
      timeEntries = await sql`
        SELECT * FROM time_entries ORDER BY date DESC
      `
    }

    return NextResponse.json({ timeEntries })
  } catch (error) {
    console.error("Get time entries error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const timeEntryData = await request.json()

    const result = await sql`
      INSERT INTO time_entries (
        job_id, apprentice_id, date, hours, approved
      ) VALUES (
        ${timeEntryData.job_id}, ${timeEntryData.apprentice_id}, ${timeEntryData.date},
        ${timeEntryData.hours}, ${timeEntryData.approved}
      )
      RETURNING *
    `

    return NextResponse.json({ timeEntry: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create time entry error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
