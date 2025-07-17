import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobs = await sql`
      SELECT * FROM job_postings WHERE id = ${params.id}
    `

    if (jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(jobs[0])
  } catch (error) {
    console.error("Get job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobData = await request.json()

    const result = await sql`
      UPDATE job_postings 
      SET 
        title = ${jobData.title},
        description = ${jobData.description},
        apprentices_needed = ${jobData.apprentices_needed},
        expected_duration = ${jobData.expected_duration || null},
        days_needed = ${jobData.days_needed},
        start_date = ${jobData.start_date},
        hours_per_day = ${jobData.hours_per_day},
        work_days = ${jobData.work_days || []},
        pay_rate = ${jobData.pay_rate},
        requirements = ${jobData.requirements || []},
        required_skills = ${jobData.required_skills || []},
        priority = ${jobData.priority || "medium"},
        status = ${jobData.status || "active"},
        total_cost = ${jobData.total_cost || null},
        weekly_payment = ${jobData.weekly_payment || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM job_postings WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
