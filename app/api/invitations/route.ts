import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apprenticeId = searchParams.get("apprenticeId")
    const status = searchParams.get("status")

    let invitations
    if (apprenticeId) {
      invitations = await sql`SELECT * FROM job_invitations WHERE apprentice_id = ${apprenticeId} ORDER BY sent_at DESC`
    } else if (status) {
      invitations = await sql`SELECT * FROM job_invitations WHERE status = ${status} ORDER BY sent_at DESC`
    } else {
      invitations = await sql`SELECT * FROM job_invitations ORDER BY sent_at DESC`
    }

    return NextResponse.json(invitations, { status: 200 })
  } catch (error) {
    console.error("Error fetching job invitations:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { workDays, requiredSkills, ...invitationData } = body

    const [newInvitation] = await sql`
      INSERT INTO job_invitations ${sql(
        {
          ...invitationData,
          work_days: sql.array(workDays, "text"),
          required_skills: sql.array(requiredSkills, "text"),
          sent_at: new Date().toISOString(),
        },
        "job_posting_id",
        "shop_id",
        "apprentice_id",
        "shop_name",
        "title",
        "description",
        "pay_rate",
        "days_needed",
        "start_date",
        "hours_per_day",
        "work_days",
        "requirements",
        "required_skills",
        "location",
        "priority",
        "total_pay",
        "weekly_pay",
        "status",
        "sent_at",
      )}
      RETURNING *
    `

    return NextResponse.json(newInvitation, { status: 201 })
  } catch (error) {
    console.error("Error creating job invitation:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
