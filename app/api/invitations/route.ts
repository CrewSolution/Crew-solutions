import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")
    const apprenticeId = searchParams.get("apprenticeId")
    const status = searchParams.get("status")

    let query = "SELECT * FROM job_invitations"
    const params: string[] = []
    const conditions: string[] = []
    let paramIndex = 1

    if (shopId) {
      conditions.push(`shop_id = $${paramIndex++}`)
      params.push(shopId)
    }
    if (apprenticeId) {
      conditions.push(`apprentice_id = $${paramIndex++}`)
      params.push(apprenticeId)
    }
    if (status) {
      conditions.push(`status = $${paramIndex++}`)
      params.push(status)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    const { rows } = await sql.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching job invitations:", error)
    return NextResponse.json({ message: "Error fetching job invitations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { userId, userType } = JSON.parse(session)

    if (userType !== "shop") {
      return NextResponse.json({ message: "Only shops can send invitations" }, { status: 403 })
    }

    const body = await request.json()
    const {
      job_posting_id,
      apprentice_id,
      shop_name,
      title,
      description,
      pay_rate,
      days_needed,
      start_date,
      hours_per_day,
      work_days,
      requirements,
      required_skills,
      location,
      priority,
      total_pay,
      weekly_pay,
    } = body

    if (!job_posting_id || !apprentice_id || !shop_name || !title || !description || !pay_rate || !start_date) {
      return NextResponse.json({ message: "Missing required invitation fields" }, { status: 400 })
    }

    const id = uuidv4()
    const status = "pending" // Default status for new invitations
    const sent_at = new Date().toISOString()

    const query = `
      INSERT INTO job_invitations (
        id, job_posting_id, shop_id, apprentice_id, shop_name, title, description,
        pay_rate, days_needed, start_date, hours_per_day, work_days, requirements,
        required_skills, location, priority, total_pay, weekly_pay, status, sent_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `
    const values = [
      id,
      job_posting_id,
      userId,
      apprentice_id,
      shop_name,
      title,
      description,
      pay_rate,
      days_needed,
      start_date,
      hours_per_day,
      work_days || [],
      requirements || [],
      required_skills || [],
      location,
      priority,
      total_pay,
      weekly_pay,
      status,
      sent_at,
    ]

    const { rows } = await sql.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating job invitation:", error)
    return NextResponse.json({ message: "Error creating job invitation" }, { status: 500 })
  }
}
