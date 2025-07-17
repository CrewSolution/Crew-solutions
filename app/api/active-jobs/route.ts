import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type ActiveJobRow = {
  id: string
  job_posting_id: string
  shop_id: string
  apprentice_id: string
  title: string
  shop_name: string
  apprentice_name: string
  start_date: Date
  end_date?: Date
  days_worked: number
  total_days: number
  hours_per_day: number
  pay_rate: string
  status: "in-progress" | "completed" | "reviewed"
  total_hours: number
  pending_hours: number
  can_complete: boolean
  can_submit_hours: boolean
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userType = searchParams.get("userType")
    const status = searchParams.get("status")

    const where: string[] = []
    const params: any[] = []

    if (userId && userType === "shop") {
      params.push(userId)
      where.push(`shop_id = $${params.length}`)
    } else if (userId && userType === "apprentice") {
      params.push(userId)
      where.push(`apprentice_id = $${params.length}`)
    }
    if (status) {
      params.push(status)
      where.push(`status = $${params.length}`)
    }

    const query = "SELECT * FROM active_jobs" + (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const activeJobs: ActiveJobRow[] = await sql(query, params)

    const result = activeJobs.map((j) => ({
      id: j.id,
      jobPostingId: j.job_posting_id,
      shopId: j.shop_id,
      apprenticeId: j.apprentice_id,
      title: j.title,
      shopName: j.shop_name,
      apprenticeName: j.apprentice_name,
      startDate: j.start_date.toISOString().split("T")[0],
      endDate: j.end_date?.toISOString().split("T")[0],
      daysWorked: j.days_worked,
      totalDays: j.total_days,
      hoursPerDay: j.hours_per_day,
      payRate: j.pay_rate,
      status: j.status,
      totalHours: j.total_hours,
      pendingHours: j.pending_hours,
      canComplete: j.can_complete,
      canSubmitHours: j.can_submit_hours,
    }))

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching active jobs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json()

    const dbData: Record<string, any> = {
      id: `active-job-${Date.now()}`,
      job_posting_id: jobData.jobPostingId,
      shop_id: jobData.shopId,
      apprentice_id: jobData.apprenticeId,
      title: jobData.title,
      shop_name: jobData.shopName,
      apprentice_name: jobData.apprenticeName,
      start_date: jobData.startDate,
      end_date: jobData.endDate,
      days_worked: jobData.daysWorked || 0,
      total_days: jobData.totalDays,
      hours_per_day: jobData.hoursPerDay,
      pay_rate: jobData.payRate,
      status: jobData.status || "in-progress",
      total_hours: jobData.totalHours || 0,
      pending_hours: jobData.pendingHours || 0,
      can_complete: jobData.canComplete || false,
      can_submit_hours: jobData.canSubmitHours || false,
    }

    const [newJob] = await sql`
      INSERT INTO active_jobs ${sql(dbData, Object.keys(dbData))}
      RETURNING *
    `

    const result = {
      id: newJob.id,
      jobPostingId: newJob.job_posting_id,
      shopId: newJob.shop_id,
      apprenticeId: newJob.apprentice_id,
      title: newJob.title,
      shopName: newJob.shop_name,
      apprenticeName: newJob.apprentice_name,
      startDate: newJob.start_date.toISOString().split("T")[0],
      endDate: newJob.end_date?.toISOString().split("T")[0],
      daysWorked: newJob.days_worked,
      totalDays: newJob.total_days,
      hoursPerDay: newJob.hours_per_day,
      payRate: newJob.pay_rate,
      status: newJob.status,
      totalHours: newJob.total_hours,
      pendingHours: newJob.pending_hours,
      canComplete: newJob.can_complete,
      canSubmitHours: newJob.can_submit_hours,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating active job:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
