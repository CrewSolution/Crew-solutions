import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")
    const status = searchParams.get("status")

    let query = "SELECT * FROM job_postings"
    const params: string[] = []
    const conditions: string[] = []
    let paramIndex = 1

    if (shopId) {
      conditions.push(`shop_id = $${paramIndex++}`)
      params.push(shopId)
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
    console.error("Error fetching job postings:", error)
    return NextResponse.json({ message: "Error fetching job postings" }, { status: 500 })
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
      return NextResponse.json({ message: "Only shops can post jobs" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      apprentices_needed,
      expected_duration,
      days_needed,
      start_date,
      hours_per_day,
      work_days,
      pay_rate,
      requirements,
      required_skills,
      priority,
      total_cost,
      weekly_payment,
    } = body

    if (!title || !description || !apprentices_needed || !start_date || !pay_rate || !days_needed || !hours_per_day) {
      return NextResponse.json({ message: "Missing required job posting fields" }, { status: 400 })
    }

    const id = uuidv4()
    const posted_date = new Date().toISOString().split("T")[0] // Current date

    const query = `
      INSERT INTO job_postings (
        id, shop_id, title, description, apprentices_needed, expected_duration,
        days_needed, start_date, hours_per_day, work_days, pay_rate,
        requirements, required_skills, priority, status, applicants, posted_date,
        total_cost, weekly_payment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `
    const values = [
      id,
      userId,
      title,
      description,
      apprentices_needed,
      expected_duration,
      days_needed,
      start_date,
      hours_per_day,
      work_days || [],
      pay_rate,
      requirements || [],
      required_skills || [],
      priority || "medium",
      "active",
      0,
      posted_date,
      total_cost,
      weekly_payment,
    ]

    const { rows } = await sql.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating job posting:", error)
    return NextResponse.json({ message: "Error creating job posting" }, { status: 500 })
  }
}
