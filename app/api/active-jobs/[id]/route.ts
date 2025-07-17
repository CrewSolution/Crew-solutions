import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const jobs = await sql`SELECT * FROM active_jobs WHERE id = ${id}`
    const job = jobs[0]

    if (!job) {
      return NextResponse.json({ message: "Active job not found" }, { status: 404 })
    }

    const result = {
      id: job.id,
      jobPostingId: job.job_posting_id,
      shopId: job.shop_id,
      apprenticeId: job.apprentice_id,
      title: job.title,
      shopName: job.shop_name,
      apprenticeName: job.apprentice_name,
      startDate: job.start_date.toISOString().split("T")[0],
      endDate: job.end_date?.toISOString().split("T")[0],
      daysWorked: job.days_worked,
      totalDays: job.total_days,
      hoursPerDay: job.hours_per_day,
      payRate: job.pay_rate,
      status: job.status,
      totalHours: job.total_hours,
      pendingHours: job.pending_hours,
      canComplete: job.can_complete,
      canSubmitHours: job.can_submit_hours,
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching active job by ID:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updateData = await request.json()

    const dbUpdateData: Record<string, any> = {}
    for (const key in updateData) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        const dbKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        dbUpdateData[dbKey] = updateData[key]
      }
    }

    const [updatedJob] = await sql`
      UPDATE active_jobs
      SET ${sql(dbUpdateData, Object.keys(dbUpdateData))}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedJob) {
      return NextResponse.json({ message: "Active job not found" }, { status: 404 })
    }

    const result = {
      id: updatedJob.id,
      jobPostingId: updatedJob.job_posting_id,
      shopId: updatedJob.shop_id,
      apprenticeId: updatedJob.apprentice_id,
      title: updatedJob.title,
      shopName: updatedJob.shop_name,
      apprenticeName: updatedJob.apprentice_name,
      startDate: updatedJob.start_date.toISOString().split("T")[0],
      endDate: updatedJob.end_date?.toISOString().split("T")[0],
      daysWorked: updatedJob.days_worked,
      totalDays: updatedJob.total_days,
      hoursPerDay: updatedJob.hours_per_day,
      payRate: updatedJob.pay_rate,
      status: updatedJob.status,
      totalHours: updatedJob.total_hours,
      pendingHours: updatedJob.pending_hours,
      canComplete: updatedJob.can_complete,
      canSubmitHours: updatedJob.can_submit_hours,
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating active job:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
