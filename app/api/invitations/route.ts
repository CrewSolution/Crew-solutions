import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type JobInvitationRow = {
  id: string
  job_posting_id: string
  shop_id: string
  apprentice_id: string
  shop_name: string
  title: string
  description: string
  pay_rate: string
  days_needed: number
  start_date: Date
  hours_per_day: number
  work_days: string[]
  requirements: string[]
  required_skills: string[]
  location: string
  priority: "high" | "medium" | "low"
  total_pay: number
  weekly_pay?: number
  status: "pending" | "accepted" | "declined"
  sent_at: Date
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apprenticeId = searchParams.get("apprenticeId")
    const status = searchParams.get("status")

    const where: string[] = []
    const params: any[] = []

    if (apprenticeId) {
      params.push(apprenticeId)
      where.push(`apprentice_id = $${params.length}`)
    }
    if (status) {
      params.push(status)
      where.push(`status = $${params.length}`)
    }

    const query = "SELECT * FROM job_invitations" + (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const invitations: JobInvitationRow[] = await sql(query, params)

    const result = invitations.map((i) => ({
      id: i.id,
      jobPostingId: i.job_posting_id,
      shopId: i.shop_id,
      apprenticeId: i.apprentice_id,
      shopName: i.shop_name,
      title: i.title,
      description: i.description,
      payRate: i.pay_rate,
      daysNeeded: i.days_needed,
      startDate: i.start_date.toISOString().split("T")[0],
      hoursPerDay: i.hours_per_day,
      workDays: i.work_days,
      requirements: i.requirements,
      requiredSkills: i.required_skills,
      location: i.location,
      priority: i.priority,
      totalPay: i.total_pay,
      weeklyPay: i.weekly_pay,
      status: i.status,
      sentAt: i.sent_at.toISOString(),
    }))

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching job invitations:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const invitationData = await request.json()

    const dbData: Record<string, any> = {
      id: `invitation-${Date.now()}`,
      job_posting_id: invitationData.jobPostingId,
      shop_id: invitationData.shopId,
      apprentice_id: invitationData.apprenticeId,
      shop_name: invitationData.shopName,
      title: invitationData.title,
      description: invitationData.description,
      pay_rate: invitationData.payRate,
      days_needed: invitationData.daysNeeded,
      start_date: invitationData.startDate,
      hours_per_day: invitationData.hoursPerDay,
      work_days: invitationData.workDays,
      requirements: invitationData.requirements,
      required_skills: invitationData.requiredSkills,
      location: invitationData.location,
      priority: invitationData.priority,
      total_pay: invitationData.totalPay,
      weekly_pay: invitationData.weeklyPay,
      status: invitationData.status || "pending",
      sent_at: new Date().toISOString(),
    }

    const [newInvitation] = await sql`
      INSERT INTO job_invitations ${sql(dbData, Object.keys(dbData))}
      RETURNING *
    `

    const result = {
      id: newInvitation.id,
      jobPostingId: newInvitation.job_posting_id,
      shopId: newInvitation.shop_id,
      apprenticeId: newInvitation.apprentice_id,
      shopName: newInvitation.shop_name,
      title: newInvitation.title,
      description: newInvitation.description,
      payRate: newInvitation.pay_rate,
      daysNeeded: newInvitation.days_needed,
      startDate: newInvitation.start_date.toISOString().split("T")[0],
      hoursPerDay: newInvitation.hours_per_day,
      workDays: newInvitation.work_days,
      requirements: newInvitation.requirements,
      requiredSkills: newInvitation.required_skills,
      location: newInvitation.location,
      priority: newInvitation.priority,
      totalPay: newInvitation.total_pay,
      weeklyPay: newInvitation.weekly_pay,
      status: newInvitation.status,
      sentAt: newInvitation.sent_at.toISOString(),
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating job invitation:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
