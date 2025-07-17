import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type JobPostingRow = {
  id: string
  shop_id: string
  title: string
  description: string
  apprentices_needed: number
  expected_duration: string
  days_needed: number
  start_date: Date
  hours_per_day: number
  work_days: string[]
  pay_rate: string
  requirements: string[]
  required_skills: string[]
  priority: "high" | "medium" | "low"
  status: "active" | "filled" | "paused"
  applicants: number
  posted_date: Date
  total_cost?: number
  weekly_payment?: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")
    const status = searchParams.get("status")

    const where: string[] = []
    const params: any[] = []

    if (shopId) {
      params.push(shopId)
      where.push(`shop_id = $${params.length}`)
    }
    if (status) {
      params.push(status)
      where.push(`status = $${params.length}`)
    }

    const query = "SELECT * FROM job_postings" + (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const jobs: JobPostingRow[] = await sql(query, params)

    const result = jobs.map((j) => ({
      id: j.id,
      shopId: j.shop_id,
      title: j.title,
      description: j.description,
      apprenticesNeeded: j.apprentices_needed,
      expectedDuration: j.expected_duration,
      daysNeeded: j.days_needed,
      startDate: j.start_date.toISOString().split("T")[0],
      hoursPerDay: j.hours_per_day,
      workDays: j.work_days,
      payRate: j.pay_rate,
      requirements: j.requirements,
      requiredSkills: j.required_skills,
      priority: j.priority,
      status: j.status,
      applicants: j.applicants,
      postedDate: j.posted_date.toISOString(),
      totalCost: j.total_cost,
      weeklyPayment: j.weekly_payment,
    }))

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching job postings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json()

    const dbData: Record<string, any> = {
      id: `job-${Date.now()}`, // Generate a simple ID
      shop_id: jobData.shopId,
      title: jobData.title,
      description: jobData.description,
      apprentices_needed: jobData.apprenticesNeeded,
      expected_duration: jobData.expectedDuration,
      days_needed: jobData.daysNeeded,
      start_date: jobData.startDate,
      hours_per_day: jobData.hoursPerDay,
      work_days: jobData.workDays,
      pay_rate: jobData.payRate,
      requirements: jobData.requirements,
      required_skills: jobData.requiredSkills,
      priority: jobData.priority,
      status: jobData.status || "active",
      applicants: jobData.applicants || 0,
      posted_date: new Date().toISOString(),
      total_cost: jobData.totalCost,
      weekly_payment: jobData.weeklyPayment,
    }

    const [newJob] = await sql`
      INSERT INTO job_postings ${sql(dbData, Object.keys(dbData))}
      RETURNING *
    `

    const result = {
      id: newJob.id,
      shopId: newJob.shop_id,
      title: newJob.title,
      description: newJob.description,
      apprenticesNeeded: newJob.apprentices_needed,
      expectedDuration: newJob.expected_duration,
      daysNeeded: newJob.days_needed,
      startDate: newJob.start_date.toISOString().split("T")[0],
      hoursPerDay: newJob.hours_per_day,
      workDays: newJob.work_days,
      payRate: newJob.pay_rate,
      requirements: newJob.requirements,
      requiredSkills: newJob.required_skills,
      priority: newJob.priority,
      status: newJob.status,
      applicants: newJob.applicants,
      postedDate: newJob.posted_date.toISOString(),
      totalCost: newJob.total_cost,
      weeklyPayment: newJob.weekly_payment,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating job posting:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
