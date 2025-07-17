"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  getActiveJobById,
  createReview,
  updateActiveJob,
  updateUser,
  type User,
  type ActiveJob,
} from "@/lib/storage"

export default function JobReviewPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [jobData, setJobData] = useState<ActiveJob | null>(null)
  const [shopUser, setShopUser] = useState<User | null>(null) // To get shop's full name
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const loadJobAndUser = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUserState(user)

    if (!jobId) {
      toast({
        title: "Error",
        description: "Job ID is missing.",
        variant: "destructive",
      })
      router.push("/dashboard/apprentice")
      return
    }

    try {
      const activeJob = await getActiveJobById(jobId)
      if (!activeJob || activeJob.apprenticeId !== user.id) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to review this job.",
          variant: "destructive",
        })
        router.push("/dashboard/apprentice")
        return
      }
      setJobData(activeJob)

      // Fetch shop details
      const shop = await updateUser(activeJob.shopId, {}) // Fetch full shop data
      setShopUser(shop)
    } catch (error) {
      console.error("Failed to load job data:", error)
      toast({
        title: "Error",
        description: "Failed to load job details. Please try again.",
        variant: "destructive",
      })
      router.push("/dashboard/apprentice")
    }
  }, [router, jobId, toast])

  useEffect(() => {
    loadJobAndUser()
  }, [loadJobAndUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!currentUser || !jobData || !shopUser) {
      toast({
        title: "Error",
        description: "Missing user or job data.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (rating === 0) {
      toast({
        title: "Missing Rating",
        description: "Please provide a rating.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Create review
      await createReview({
        jobId: jobData.id,
        reviewerId: currentUser.id,
        revieweeId: jobData.shopId,
        reviewerType: "apprentice",
        rating: rating,
        comment: comment,
        jobTitle: jobData.title,
      })

      // Update active job status to 'reviewed'
      await updateActiveJob(jobData.id, { status: "reviewed", endDate: new Date().toISOString().split("T")[0] })

      // Update shop's average rating (simplified, in real app would be more complex)
      // For now, just mark job as completed for apprentice
      const updatedApprentice = await updateUser(currentUser.id, {
        jobsCompleted: (currentUser.jobsCompleted || 0) + 1,
      })
      setCurrentUserState(updatedApprentice) // Update local state and localStorage

      toast({
        title: "Job Reviewed & Completed",
        description: "Your review has been submitted and the job marked complete.",
      })

      router.push("/dashboard/apprentice?tab=active") // Redirect back to apprentice dashboard
    } catch (error) {
      console.error("Failed to submit review or complete job:", error)
      toast({
        title: "Error",
        description: "Failed to complete job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-lg font-medium">{rating > 0 ? `${rating}/5` : "Click to rate"}</span>
      </div>
    )
  }

  const setCurrentUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user))
    setCurrentUserState(user)
  }

  if (!currentUser || !jobData || !shopUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-bold">Crew Solutions</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Review Job Experience</h1>
                <p className="text-sm text-gray-500">{jobData.title}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Summary</CardTitle>
            <CardDescription>Review your completed work experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Shop</p>
                <p className="text-sm text-muted-foreground">{shopUser.businessName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(jobData.startDate).toLocaleDateString()} - {new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Hours</p>
                <p className="text-sm text-muted-foreground">{jobData.totalHours}h</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Pay</p>
                <p className="text-sm text-green-600">
                  ${(Number.parseFloat(jobData.payRate.replace(/[^0-9.]/g, "")) * jobData.totalHours).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Your Experience</CardTitle>
              <CardDescription>
                How would you rate your overall experience working with {shopUser.businessName}?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                {renderStarRating()}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {rating === 1 && "Poor experience"}
                    {rating === 2 && "Below average experience"}
                    {rating === 3 && "Average experience"}
                    {rating === 4 && "Good experience"}
                    {rating === 5 && "Excellent experience"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>Tell other apprentices about your experience working with this shop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your experience working with this shop. What did you learn? How was the work environment? Would you recommend this shop to other apprentices?"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Your review will help other apprentices make informed decisions about job opportunities.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
              🎉 Congratulations on completing your job!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your payment of $
              {(Number.parseFloat(jobData.payRate.replace(/[^0-9.]/g, "")) * jobData.totalHours).toFixed(2)} will be
              processed and deposited to your account within 1-2 business days.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || rating === 0} className="flex-1">
              {isSubmitting ? "Submitting Review..." : "Submit Review & Complete Job"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
