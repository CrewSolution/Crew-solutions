import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userType = searchParams.get("userType")
    const status = searchParams.get("status")

    let activeJobs
    if (userId && userType === "shop") {
      activeJobs = await sql`SELECT * FROM active_jobs WHERE shop_id = ${userId} ORDER BY start_date DESC`
    } else if (userId && userType === "apprentice") {
      activeJobs = await sql`SELECT * FROM active_jobs WHERE apprentice_id = ${userId} ORDER BY start_date DESC`
    } else if (status) {
      activeJobs = await sql`SELECT * FROM active_jobs WHERE status = ${status} ORDER BY start_date DESC`
    } else {
      activeJobs = await sql`SELECT * FROM active_jobs ORDER BY start_date DESC`
    }

    return NextResponse.json(activeJobs, { status: 200 })
  } catch (error) {
    console.error("Error fetching active jobs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const [newActiveJob] = await sql`
      INSERT INTO active_jobs ${sql(
        {
          ...body,
          start_date: body.startDate, // Ensure date format is correct for DB
          end_date: body.endDate || null,
          days_worked: body.daysWorked || 0,
          total_hours: body.totalHours || 0,
          pending_hours: body.pendingHours || 0,
          can_complete: body.canComplete || false,
          can_submit_hours: body.canSubmitHours || true,
        },
        "job_posting_id",
        "shop_id",
        "apprentice_id",
        "title",
        "shop_name",
        "apprentice_name",
        "start_date",
        "end_date",
        "days_worked",
        "total_days",
        "hours_per_day",
        "pay_rate",
        "status",
        "total_hours",
        "pending_hours",
        "can_complete",
        "can_submit_hours",
      )}
      RETURNING *
    `

    return NextResponse.json(newActiveJob, { status: 201 })
  } catch (error) {
    console.error("Error creating active job:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
