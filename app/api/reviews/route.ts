import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const revieweeId = searchParams.get("revieweeId")
    const reviewerId = searchParams.get("reviewerId")
    const jobId = searchParams.get("jobId")

    let reviews
    if (revieweeId) {
      reviews = await sql`
        SELECT * FROM reviews WHERE reviewee_id = ${revieweeId} ORDER BY date DESC
      `
    } else if (reviewerId) {
      reviews = await sql`
        SELECT * FROM reviews WHERE reviewer_id = ${reviewerId} ORDER BY date DESC
      `
    } else if (jobId) {
      reviews = await sql`
        SELECT * FROM reviews WHERE job_id = ${jobId} ORDER BY date DESC
      `
    } else {
      reviews = await sql`
        SELECT * FROM reviews ORDER BY date DESC
      `
    }

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()

    const result = await sql`
      INSERT INTO reviews (
        job_id, reviewer_id, reviewee_id, reviewer_type, rating, comment, job_title, date
      ) VALUES (
        ${reviewData.job_id}, ${reviewData.reviewer_id}, ${reviewData.reviewee_id},
        ${reviewData.reviewer_type}, ${reviewData.rating}, ${reviewData.comment},
        ${reviewData.job_title}, NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ review: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
