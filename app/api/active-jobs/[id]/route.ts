import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobs = await sql`
      SELECT * FROM active_jobs WHERE id = ${params.id}
    `

    if (jobs.length === 0) {
      return NextResponse.json({ error: "Active job not found" }, { status: 404 })
    }

    return NextResponse.json(jobs[0])
  } catch (error) {
    console.error("Get active job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobData = await request.json()

    const result = await sql`
      UPDATE active_jobs 
      SET 
        status = ${jobData.status || "in-progress"},
        days_worked = ${jobData.days_worked || 0},
        total_hours = ${jobData.total_hours || 0},
        pending_hours = ${jobData.pending_hours || 0},
        can_complete = ${jobData.can_complete || false},
        can_submit_hours = ${jobData.can_submit_hours || true},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Active job not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update active job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
