import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shop_id")
    const apprenticeId = searchParams.get("apprentice_id")
    const status = searchParams.get("status")

    let invitations
    if (shopId && status) {
      invitations = await sql`
        SELECT * FROM job_invitations 
        WHERE shop_id = ${shopId} AND status = ${status}
        ORDER BY created_at DESC
      `
    } else if (apprenticeId && status) {
      invitations = await sql`
        SELECT * FROM job_invitations 
        WHERE apprentice_id = ${apprenticeId} AND status = ${status}
        ORDER BY created_at DESC
      `
    } else if (shopId) {
      invitations = await sql`
        SELECT * FROM job_invitations 
        WHERE shop_id = ${shopId}
        ORDER BY created_at DESC
      `
    } else if (apprenticeId) {
      invitations = await sql`
        SELECT * FROM job_invitations 
        WHERE apprentice_id = ${apprenticeId}
        ORDER BY created_at DESC
      `
    } else {
      invitations = await sql`
        SELECT * FROM job_invitations 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json(invitations)
  } catch (error) {
    console.error("Get invitations error:", error)
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
        requirements, required_skills, location, priority, total_pay,
        weekly_pay, status
      ) VALUES (
        ${invitationData.job_posting_id}, ${invitationData.shop_id}, 
        ${invitationData.apprentice_id}, ${invitationData.shop_name},
        ${invitationData.title}, ${invitationData.description},
        ${invitationData.pay_rate}, ${invitationData.days_needed},
        ${invitationData.start_date}, ${invitationData.hours_per_day},
        ${invitationData.work_days || []}, ${invitationData.requirements || []},
        ${invitationData.required_skills || []}, ${invitationData.location || null},
        ${invitationData.priority || "medium"}, ${invitationData.total_pay || null},
        ${invitationData.weekly_pay || null}, ${invitationData.status || "pending"}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
