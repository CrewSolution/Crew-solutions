import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    const [updatedInvitation] = await sql`
      UPDATE job_invitations
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedInvitation) {
      return NextResponse.json({ message: "Job invitation not found" }, { status: 404 })
    }

    const result = {
      id: updatedInvitation.id,
      jobPostingId: updatedInvitation.job_posting_id,
      shopId: updatedInvitation.shop_id,
      apprenticeId: updatedInvitation.apprentice_id,
      shopName: updatedInvitation.shop_name,
      title: updatedInvitation.title,
      description: updatedInvitation.description,
      payRate: updatedInvitation.pay_rate,
      daysNeeded: updatedInvitation.days_needed,
      startDate: updatedInvitation.start_date.toISOString().split("T")[0],
      hoursPerDay: updatedInvitation.hours_per_day,
      workDays: updatedInvitation.work_days,
      requirements: updatedInvitation.requirements,
      requiredSkills: updatedInvitation.required_skills,
      location: updatedInvitation.location,
      priority: updatedInvitation.priority,
      totalPay: updatedInvitation.total_pay,
      weeklyPay: updatedInvitation.weekly_pay,
      status: updatedInvitation.status,
      sentAt: updatedInvitation.sent_at.toISOString(),
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating job invitation status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
