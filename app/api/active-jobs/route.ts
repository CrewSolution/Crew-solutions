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

    let query = "SELECT * FROM active_jobs"
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
    console.error("Error fetching active jobs:", error)
    return NextResponse.json({ message: "Error fetching active jobs" }, { status: 500 })
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

    const body = await request.json()
    const {
      job_posting_id,
      apprentice_id,
      title,
      shop_name,
      apprentice_name,
      start_date,
      total_days,
      hours_per_day,
      pay_rate,
    } = body

    if (
      !job_posting_id ||
      !apprentice_id ||
      !title ||
      !shop_name ||
      !apprentice_name ||
      !start_date ||
      !total_days ||
      !hours_per_day ||
      !pay_rate
    ) {
      return NextResponse.json({ message: "Missing required active job fields" }, { status: 400 })
    }

    // Ensure the shop_id matches the current user if they are a shop
    if (userType === "shop" && userId !== body.shop_id) {
      return NextResponse.json({ message: "Forbidden: Cannot create active job for another shop" }, { status: 403 })
    }

    const id = uuidv4()
    const status = "in-progress" // Default status for new active jobs

    const query = `
      INSERT INTO active_jobs (
        id, job_posting_id, shop_id, apprentice_id, title, shop_name,
        apprentice_name, start_date, total_days, hours_per_day, pay_rate, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `
    const values = [
      id,
      job_posting_id,
      userId,
      apprentice_id,
      title,
      shop_name,
      apprentice_name,
      start_date,
      total_days,
      hours_per_day,
      pay_rate,
      status,
    ]

    const { rows } = await sql.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating active job:", error)
    return NextResponse.json({ message: "Error creating active job" }, { status: 500 })
  }
}
