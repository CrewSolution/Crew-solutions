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

    const result = {
      id: job.id,
      shopId: job.shop_id,
      title: job.title,
      description: job.description,
      apprenticesNeeded: job.apprentices_needed,
      expectedDuration: job.expected_duration,
      daysNeeded: job.days_needed,
      startDate: job.start_date.toISOString().split("T")[0],
      hoursPerDay: job.hours_per_day,
      workDays: job.work_days,
      payRate: job.pay_rate,
      requirements: job.requirements,
      requiredSkills: job.required_skills,
      priority: job.priority,
      status: job.status,
      applicants: job.applicants,
      postedDate: job.posted_date.toISOString(),
      totalCost: job.total_cost,
      weeklyPayment: job.weekly_payment,
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching job posting by ID:", error)
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
      UPDATE job_postings
      SET ${sql(dbUpdateData, Object.keys(dbUpdateData))}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedJob) {
      return NextResponse.json({ message: "Job posting not found" }, { status: 404 })
    }

    const result = {
      id: updatedJob.id,
      shopId: updatedJob.shop_id,
      title: updatedJob.title,
      description: updatedJob.description,
      apprenticesNeeded: updatedJob.apprentices_needed,
      expectedDuration: updatedJob.expected_duration,
      daysNeeded: updatedJob.days_needed,
      startDate: updatedJob.start_date.toISOString().split("T")[0],
      hoursPerDay: updatedJob.hours_per_day,
      workDays: updatedJob.work_days,
      payRate: updatedJob.pay_rate,
      requirements: updatedJob.requirements,
      requiredSkills: updatedJob.required_skills,
      priority: updatedJob.priority,
      status: updatedJob.status,
      applicants: updatedJob.applicants,
      postedDate: updatedJob.posted_date.toISOString(),
      totalCost: updatedJob.total_cost,
      weeklyPayment: updatedJob.weekly_payment,
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
