import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const jobs = await sql`SELECT * FROM job_postings WHERE id = ${id}`
    const job = jobs[0]

    if (!job) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }

    return NextResponse.json(job, { status: 200 })
  } catch (error) {
    console.error("Error fetching job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { requiredSkills, workDays, ...updateData } = body

    if (requiredSkills && Array.isArray(requiredSkills)) {
      updateData.required_skills = sql.array(requiredSkills, "text")
    }
    if (workDays && Array.isArray(workDays)) {
      updateData.work_days = sql.array(workDays, "text")
    }

    const [updatedJob] = await sql`
      UPDATE job_postings SET ${sql(
        updateData,
        "title",
        "description",
        "apprentices_needed",
        "expected_duration",
        "days_needed",
        "start_date",
        "hours_per_day",
        "work_days",
        "pay_rate",
        "requirements",
        "required_skills",
        "priority",
        "status",
        "applicants",
        "total_cost",
        "weekly_payment",
      )}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedJob) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }

    return NextResponse.json(updatedJob, { status: 200 })
  } catch (error) {
    console.error("Error updating job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
