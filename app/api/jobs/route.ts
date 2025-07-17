import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")
    const status = searchParams.get("status")

    let jobs
    if (shopId) {
      jobs = await sql`SELECT * FROM job_postings WHERE shop_id = ${shopId} ORDER BY posted_date DESC`
    } else if (status) {
      jobs = await sql`SELECT * FROM job_postings WHERE status = ${status} ORDER BY posted_date DESC`
    } else {
      jobs = await sql`SELECT * FROM job_postings ORDER BY posted_date DESC`
    }

    return NextResponse.json(jobs, { status: 200 })
  } catch (error) {
    console.error("Error fetching job postings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { requiredSkills, workDays, ...jobData } = body

    const [newJob] = await sql`
      INSERT INTO job_postings ${sql(
        {
          ...jobData,
          required_skills: sql.array(requiredSkills, "text"),
          work_days: sql.array(workDays, "text"),
          posted_date: new Date().toISOString().split("T")[0],
        },
        "shop_id",
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
        "posted_date",
        "total_cost",
        "weekly_payment",
      )}
      RETURNING *
    `

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
