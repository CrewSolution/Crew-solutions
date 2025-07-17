"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  getActiveJobById,
  createReview,
  updateActiveJob,
  type User,
  type ActiveJob,
  type Review,
} from "@/lib/storage"
import Link from "next/link"
import { Zap } from "lucide-react" // Import Zap from lucide-react

export default function ReviewPage({ params }: { params: { id: string } }) {
  const { id: jobId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [job, setJob] = useState<ActiveJob | null>(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(user)
    fetchJobData(user.id, jobId)
  }, [router, jobId])

  const fetchJobData = async (userId: string, currentJobId: string) => {
    setIsLoading(true)
    try {
      const fetchedJob = await getActiveJobById(currentJobId)
      if (fetchedJob.status === "reviewed") {
        toast({
          title: "Already Reviewed",
          description: "This job has already been reviewed.",
          variant: "default",
        })
        router.push(userId === fetchedJob.shopId ? "/dashboard/shop" : "/dashboard/apprentice")
        return
      }
      if (fetchedJob.apprenticeId !== userId && fetchedJob.shopId !== userId) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to review this job.",
          variant: "destructive",
        })
        router.push(userId === fetchedJob.shopId ? "/dashboard/shop" : "/dashboard/apprentice")
        return
      }
      setJob(fetchedJob)
    } catch (error: any) {
      toast({
        title: "Error loading job",
        description: error.message || "Failed to fetch job details for review.",
        variant: "destructive",
      })
      router.push(currentUser?.type === "shop" ? "/dashboard/shop" : "/dashboard/apprentice")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewChange = (field: string, value: any) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !job) return

    try {
      const revieweeId = currentUser.type === "shop" ? job.apprenticeId : job.shopId
      const reviewerType = currentUser.type

      const reviewData: Omit<Review, "id" | "date"> = {
        jobId: job.id,
        reviewerId: currentUser.id,
        revieweeId: revieweeId,
        reviewerType: reviewerType,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        jobTitle: job.title,
      }

      await createReview(reviewData)
      await updateActiveJob(job.id, { status: "reviewed" })

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      })
      router.push(currentUser.type === "shop" ? "/dashboard/shop" : "/dashboard/apprentice")
    } catch (error: any) {
      toast({
        title: "Error submitting review",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading review page...</p>
      </div>
    )
  }

  if (!job || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Job not found or not ready for review.</p>
      </div>
    )
  }

  const isShopReviewingApprentice = currentUser.type === "shop"
  const revieweeName = isShopReviewingApprentice ? job.apprenticeName : job.shopName

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold">Crew Solutions</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={() => router.back()}>
            Back to Job
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Review for {job.title}</CardTitle>
              <p className="text-sm text-gray-500">
                You are reviewing: {revieweeName} ({isShopReviewingApprentice ? "Apprentice" : "Shop"})
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5 Stars)</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={reviewForm.rating}
                    onChange={(e) => handleReviewChange("rating", Number.parseInt(e.target.value))}
                    min="1"
                    max="5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) => handleReviewChange("comment", e.target.value)}
                    placeholder={`Share your feedback on ${revieweeName}'s performance...`}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
