import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")

    let jobPostings
    if (shopId) {
      jobPostings = await sql`
        SELECT * FROM job_postings WHERE shop_id = ${shopId} ORDER BY posted_date DESC
      `
    } else {
      jobPostings = await sql`
        SELECT * FROM job_postings ORDER BY posted_date DESC
      `
    }

    return NextResponse.json({ jobPostings })
  } catch (error) {
    console.error("Get job postings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()

    const result = await sql`
      INSERT INTO job_postings (
        shop_id, title, description, apprentices_needed, expected_duration,
        days_needed, start_date, hours_per_day, work_days, pay_rate,
        requirements, required_skills, priority, status, applicants, posted_date
      ) VALUES (
        ${jobData.shop_id}, ${jobData.title}, ${jobData.description}, ${jobData.apprentices_needed},
        ${jobData.expected_duration || null}, ${jobData.days_needed}, ${jobData.start_date},
        ${jobData.hours_per_day}, ${sql.array(jobData.work_days)}, ${jobData.pay_rate},
        ${jobData.requirements ? sql.array(jobData.requirements) : null},
        ${jobData.required_skills ? sql.array(jobData.required_skills) : null},
        ${jobData.priority}, ${jobData.status}, ${jobData.applicants}, NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ jobPosting: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create job posting error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
