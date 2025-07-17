import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shop_id")
    const status = searchParams.get("status")

    let jobs
    if (shopId && status) {
      jobs = await sql`
        SELECT * FROM job_postings 
        WHERE shop_id = ${shopId} AND status = ${status}
        ORDER BY created_at DESC
      `
    } else if (shopId) {
      jobs = await sql`
        SELECT * FROM job_postings 
        WHERE shop_id = ${shopId}
        ORDER BY created_at DESC
      `
    } else if (status) {
      jobs = await sql`
        SELECT * FROM job_postings 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
    } else {
      jobs = await sql`
        SELECT * FROM job_postings 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Get jobs error:", error)
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
        requirements, required_skills, priority, status, applicants,
        total_cost, weekly_payment
      ) VALUES (
        ${jobData.shop_id}, ${jobData.title}, ${jobData.description},
        ${jobData.apprentices_needed}, ${jobData.expected_duration || null},
        ${jobData.days_needed}, ${jobData.start_date}, ${jobData.hours_per_day},
        ${jobData.work_days || []}, ${jobData.pay_rate}, ${jobData.requirements || []},
        ${jobData.required_skills || []}, ${jobData.priority || "medium"},
        ${jobData.status || "active"}, ${jobData.applicants || 0},
        ${jobData.total_cost || null}, ${jobData.weekly_payment || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
