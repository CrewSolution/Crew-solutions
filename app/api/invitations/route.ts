import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apprenticeId = searchParams.get("apprenticeId")
    const shopId = searchParams.get("shopId")
    const status = searchParams.get("status")

    let invitations
    if (apprenticeId) {
      invitations = await sql`
        SELECT * FROM job_invitations WHERE apprentice_id = ${apprenticeId} ${status ? sql`AND status = ${status}` : sql``} ORDER BY created_at DESC
      `
    } else if (shopId) {
      invitations = await sql`
        SELECT * FROM job_invitations WHERE shop_id = ${shopId} ${status ? sql`AND status = ${status}` : sql``} ORDER BY created_at DESC
      `
    } else {
      invitations = await sql`
        SELECT * FROM job_invitations ORDER BY created_at DESC
      `
    }

    return NextResponse.json({ jobInvitations: invitations })
  } catch (error) {
    console.error("Get job invitations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const invitationData = await request.json()

    const result = await sql`
      INSERT INTO job_invitations (
        job_posting_id, shop_id, apprentice_id, shop_name, title, description,
        pay_rate, days_needed, start_date, hours_per_day, work_days,
        requirements, required_skills, location, priority, total_pay, weekly_pay, status
      ) VALUES (
        ${invitationData.job_posting_id}, ${invitationData.shop_id}, ${invitationData.apprentice_id},
        ${invitationData.shop_name}, ${invitationData.title}, ${invitationData.description},
        ${invitationData.pay_rate}, ${invitationData.days_needed}, ${invitationData.start_date},
        ${invitationData.hours_per_day}, ${sql.array(invitationData.work_days)},
        ${invitationData.requirements ? sql.array(invitationData.requirements) : null},
        ${invitationData.required_skills ? sql.array(invitationData.required_skills) : null},
        ${invitationData.location || null}, ${invitationData.priority},
        ${invitationData.total_pay || null}, ${invitationData.weekly_pay || null},
        ${invitationData.status}
      )
      RETURNING *
    `

    return NextResponse.json({ jobInvitation: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create job invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
