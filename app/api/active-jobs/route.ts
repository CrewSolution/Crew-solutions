import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")
    const apprenticeId = searchParams.get("apprenticeId")
    const status = searchParams.get("status")

    let activeJobs
    if (shopId) {
      activeJobs = await sql`
        SELECT * FROM active_jobs WHERE shop_id = ${shopId} ${status ? sql`AND status = ${status}` : sql``} ORDER BY created_at DESC
      `
    } else if (apprenticeId) {
      activeJobs = await sql`
        SELECT * FROM active_jobs WHERE apprentice_id = ${apprenticeId} ${status ? sql`AND status = ${status}` : sql``} ORDER BY created_at DESC
      `
    } else {
      activeJobs = await sql`
        SELECT * FROM active_jobs ORDER BY created_at DESC
      `
    }

    return NextResponse.json({ activeJobs })
  } catch (error) {
    console.error("Get active jobs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()

    const result = await sql`
      INSERT INTO active_jobs (
        job_posting_id, shop_id, apprentice_id, title, shop_name, apprentice_name,
        start_date, total_days, hours_per_day, pay_rate, status,
        days_worked, total_hours, pending_hours, can_complete, can_submit_hours
      ) VALUES (
        ${jobData.job_posting_id || null}, ${jobData.shop_id}, ${jobData.apprentice_id},
        ${jobData.title}, ${jobData.shop_name}, ${jobData.apprentice_name},
        ${jobData.start_date}, ${jobData.total_days}, ${jobData.hours_per_day},
        ${jobData.pay_rate}, ${jobData.status}, ${jobData.days_worked},
        ${jobData.total_hours}, ${jobData.pending_hours}, ${jobData.can_complete},
        ${jobData.can_submit_hours}
      )
      RETURNING *
    `

    return NextResponse.json({ activeJob: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create active job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
