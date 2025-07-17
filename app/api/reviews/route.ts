import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type ReviewRow = {
  id: string
  job_id: string
  reviewer_id: string
  reviewee_id: string
  reviewer_type: "shop" | "apprentice"
  rating: number
  comment: string
  ratings?: Record<string, number> // JSONB type in DB
  skills_shown?: string[]
  job_title: string
  date: Date
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const revieweeId = searchParams.get("revieweeId")
    const reviewerId = searchParams.get("reviewerId")

    const where: string[] = []
    const params: any[] = []

    if (revieweeId) {
      params.push(revieweeId)
      where.push(`reviewee_id = $${params.length}`)
    }
    if (reviewerId) {
      params.push(reviewerId)
      where.push(`reviewer_id = $${params.length}`)
    }

    const query = "SELECT * FROM reviews" + (where.length ? ` WHERE ${where.join(" AND ")}` : "")

    const reviews: ReviewRow[] = await sql(query, params)

    const result = reviews.map((r) => ({
      id: r.id,
      jobId: r.job_id,
      reviewerId: r.reviewer_id,
      revieweeId: r.reviewee_id,
      reviewerType: r.reviewer_type,
      rating: r.rating,
      comment: r.comment,
      ratings: r.ratings,
      skillsShown: r.skills_shown,
      jobTitle: r.job_title,
      date: r.date.toISOString(),
    }))

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const reviewData = await request.json()

    const dbData: Record<string, any> = {
      id: `review-${Date.now()}`,
      job_id: reviewData.jobId,
      reviewer_id: reviewData.reviewerId,
      reviewee_id: reviewData.revieweeId,
      reviewer_type: reviewData.reviewerType,
      rating: reviewData.rating,
      comment: reviewData.comment,
      ratings: reviewData.ratings, // JSONB will handle this
      skills_shown: reviewData.skillsShown,
      job_title: reviewData.jobTitle,
      date: new Date().toISOString(),
    }

    const [newReview] = await sql`
      INSERT INTO reviews ${sql(dbData, Object.keys(dbData))}
      RETURNING *
    `

    const result = {
      id: newReview.id,
      jobId: newReview.job_id,
      reviewerId: newReview.reviewer_id,
      revieweeId: newReview.reviewee_id,
      reviewerType: newReview.reviewer_type,
      rating: newReview.rating,
      comment: newReview.comment,
      ratings: newReview.ratings,
      skillsShown: newReview.skills_shown,
      jobTitle: newReview.job_title,
      date: newReview.date.toISOString(),
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
