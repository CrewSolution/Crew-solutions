import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const activeJobs = await sql`SELECT * FROM active_jobs WHERE id = ${id}`
    const activeJob = activeJobs[0]

    if (!activeJob) {
      return NextResponse.json({ message: "Active job not found" }, { status: 404 })
    }

    return NextResponse.json(activeJob, { status: 200 })
  } catch (error) {
    console.error("Error fetching active job:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const updateData: Record<string, any> = {}

    // Map camelCase to snake_case for DB columns
    for (const key in body) {
      const snakeCaseKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      updateData[snakeCaseKey] = body[key]
    }

    // Ensure date fields are handled correctly
    if (updateData.start_date) updateData.start_date = new Date(updateData.start_date)
    if (updateData.end_date) updateData.end_date = new Date(updateData.end_date)

    const [updatedJob] = await sql`
      UPDATE active_jobs SET ${sql(
        updateData,
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
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedJob) {
      return NextResponse.json({ message: "Active job not found" }, { status: 404 })
    }

    return NextResponse.json(updatedJob, { status: 200 })
  } catch (error) {
    console.error("Error updating active job:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
