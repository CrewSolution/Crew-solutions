import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const revieweeId = searchParams.get("revieweeId")
    const reviewerId = searchParams.get("reviewerId")

    let reviews
    if (revieweeId) {
      reviews = await sql`SELECT * FROM reviews WHERE reviewee_id = ${revieweeId} ORDER BY date DESC`
    } else if (reviewerId) {
      reviews = await sql`SELECT * FROM reviews WHERE reviewer_id = ${reviewerId} ORDER BY date DESC`
    } else {
      reviews = await sql`SELECT * FROM reviews ORDER BY date DESC`
    }

    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { skillsShown, ratings, ...reviewData } = body

    const [newReview] = await sql`
      INSERT INTO reviews ${sql(
        {
          ...reviewData,
          skills_shown: skillsShown ? sql.array(skillsShown, "text") : null,
          timeliness_rating: ratings?.timeliness || null,
          work_ethic_rating: ratings?.workEthic || null,
          material_knowledge_rating: ratings?.materialKnowledge || null,
          profile_accuracy_rating: ratings?.profileAccuracy || null,
          date: new Date().toISOString(),
        },
        "job_id",
        "reviewer_id",
        "reviewee_id",
        "reviewer_type",
        "rating",
        "comment",
        "timeliness_rating",
        "work_ethic_rating",
        "material_knowledge_rating",
        "profile_accuracy_rating",
        "skills_shown",
        "job_title",
        "date",
      )}
      RETURNING *
    `

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
