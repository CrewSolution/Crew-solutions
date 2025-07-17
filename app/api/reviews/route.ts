import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewerId = searchParams.get("reviewerId")
    const revieweeId = searchParams.get("revieweeId")
    const jobId = searchParams.get("jobId")

    let query = "SELECT * FROM reviews"
    const params: string[] = []
    const conditions: string[] = []
    let paramIndex = 1

    if (reviewerId) {
      conditions.push(`reviewer_id = $${paramIndex++}`)
      params.push(reviewerId)
    }
    if (revieweeId) {
      conditions.push(`reviewee_id = $${paramIndex++}`)
      params.push(revieweeId)
    }
    if (jobId) {
      conditions.push(`job_id = $${paramIndex++}`)
      params.push(jobId)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    const { rows } = await sql.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ message: "Error fetching reviews" }, { status: 500 })
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
      job_id,
      reviewee_id,
      rating,
      comment,
      timeliness_rating,
      work_ethic_rating,
      material_knowledge_rating,
      profile_accuracy_rating,
      skills_shown,
      job_title,
    } = body

    if (!job_id || !reviewee_id || !rating || !job_title) {
      return NextResponse.json({ message: "Missing required review fields" }, { status: 400 })
    }

    // Ensure the reviewer is the current logged-in user
    if (userId !== body.reviewer_id) {
      return NextResponse.json({ message: "Forbidden: You can only create reviews as yourself" }, { status: 403 })
    }

    const id = uuidv4()
    const date = new Date().toISOString()

    const query = `
      INSERT INTO reviews (
        id, job_id, reviewer_id, reviewee_id, reviewer_type, rating, comment,
        timeliness_rating, work_ethic_rating, material_knowledge_rating,
        profile_accuracy_rating, skills_shown, job_title, date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `
    const values = [
      id,
      job_id,
      userId,
      reviewee_id,
      userType,
      rating,
      comment,
      timeliness_rating,
      work_ethic_rating,
      material_knowledge_rating,
      profile_accuracy_rating,
      skills_shown || [],
      job_title,
      date,
    ]

    const { rows } = await sql.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ message: "Error creating review" }, { status: 500 })
  }
}
