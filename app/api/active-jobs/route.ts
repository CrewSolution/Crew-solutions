import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shop_id")
    const apprenticeId = searchParams.get("apprentice_id")
    const status = searchParams.get("status")

    let jobs
    if (shopId && status) {
      jobs = await sql`
        SELECT * FROM active_jobs 
        WHERE shop_id = ${shopId} AND status = ${status}
        ORDER BY created_at DESC
      `
    } else if (apprenticeId && status) {
      jobs = await sql`
        SELECT * FROM active_jobs 
        WHERE apprentice_id = ${apprenticeId} AND status = ${status}
        ORDER BY created_at DESC
      `
    } else if (shopId) {
      jobs = await sql`
        SELECT * FROM active_jobs 
        WHERE shop_id = ${shopId}
        ORDER BY created_at DESC
      `
    } else if (apprenticeId) {
      jobs = await sql`
        SELECT * FROM active_jobs 
        WHERE apprentice_id = ${apprenticeId}
        ORDER BY created_at DESC
      `
    } else {
      jobs = await sql`
        SELECT * FROM active_jobs 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json(jobs)
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
        start_date, total_days, hours_per_day, pay_rate, status, days_worked,
        total_hours, pending_hours, can_complete, can_submit_hours
      ) VALUES (
        ${jobData.job_posting_id || null}, ${jobData.shop_id}, ${jobData.apprentice_id},
        ${jobData.title}, ${jobData.shop_name}, ${jobData.apprentice_name},
        ${jobData.start_date}, ${jobData.total_days}, ${jobData.hours_per_day},
        ${jobData.pay_rate}, ${jobData.status || "in-progress"}, ${jobData.days_worked || 0},
        ${jobData.total_hours || 0}, ${jobData.pending_hours || 0},
        ${jobData.can_complete || false}, ${jobData.can_submit_hours || true}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create active job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
