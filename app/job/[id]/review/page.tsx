"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getActiveJob, getCurrentUser, createReview, updateActiveJob } from "@/lib/storage"
import type { ActiveJob, User } from "@/lib/types"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function ReviewJobPage({ params }: { params: { id: string } }) {
  const { id: jobId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<ActiveJob | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    timeliness_rating: 0,
    work_ethic_rating: 0,
    material_knowledge_rating: 0,
    profile_accuracy_rating: 0,
    skills_shown: [] as string[],
  })
  const [revieweeId, setRevieweeId] = useState<string | null>(null)
  const [reviewerType, setReviewerType] = useState<string | null>(null)
  const [jobTitle, setJobTitle] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUser = await getCurrentUser()
        if (!fetchedUser) {
          router.push("/login")
          return
        }
        setCurrentUser(fetchedUser)

        const fetchedJob = await getActiveJob(jobId)
        if (!fetchedJob) {
          toast({
            title: "Error",
            description: "Job not found.",
            variant: "destructive",
          })
          router.push(fetchedUser.type === "shop" ? "/dashboard/shop" : "/dashboard/apprentice")
          return
        }
        setJob(fetchedJob)
        setJobTitle(fetchedJob.title)

        // Determine reviewee based on current user type
        if (fetchedUser.type === "shop") {
          setRevieweeId(fetchedJob.apprentice_id)
          setReviewerType("shop")
        } else if (fetchedUser.type === "apprentice") {
          setRevieweeId(fetchedJob.shop_id)
          setReviewerType("apprentice")
        } else {
          toast({
            title: "Error",
            description: "Invalid user type for reviewing.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Failed to fetch data for review:", error)
        toast({
          title: "Error",
          description: "Failed to load review page data.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setReviewData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRatingChange = (id: string, value: number) => {
    setReviewData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setReviewData((prev) => ({ ...prev, skills_shown: value.split(",").map((s) => s.trim()) }))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !job || !revieweeId || !reviewerType || !jobTitle) {
      toast({
        title: "Error",
        description: "Missing necessary data to submit review.",
        variant: "destructive",
      })
      return
    }

    if (reviewData.rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide an overall rating.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const reviewPayload = {
        job_id: job.id,
        reviewer_id: currentUser.id,
        reviewee_id: revieweeId,
        reviewer_type: reviewerType,
        rating: reviewData.rating,
        comment: reviewData.comment,
        timeliness_rating: reviewData.timeliness_rating,
        work_ethic_rating: reviewData.work_ethic_rating,
        material_knowledge_rating: reviewData.material_knowledge_rating,
        profile_accuracy_rating: reviewData.profile_accuracy_rating,
        skills_shown: reviewData.skills_shown,
        job_title: jobTitle,
      }
      await createReview(reviewPayload)

      // Update active job status to 'reviewed'
      await updateActiveJob(job.id, { status: "reviewed" })

      toast({
        title: "Review Submitted!",
        description: "Your review has been successfully submitted.",
      })
      router.push(currentUser.type === "shop" ? "/dashboard/shop" : "/dashboard/apprentice")
    } catch (error: any) {
      toast({
        title: "Error Submitting Review",
        description: error.message || "An error occurred while submitting your review.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-crew-accent" />
      </div>
    )
  }

  if (!job || !currentUser) {
    return <p className="p-4">Could not load job or user data for review.</p>
  }

  const isShopReviewingApprentice = currentUser.type === "shop"
  const revieweeName = isShopReviewingApprentice ? job.apprentice_name : job.shop_name

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800">
        <h1 className="text-xl font-semibold">Review {jobTitle}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Review {revieweeName}</CardTitle>
            <CardDescription>
              Share your experience with {revieweeName} for the job "{job.title}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="rating">Overall Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-8 w-8 cursor-pointer",
                        reviewData.rating >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600",
                      )}
                      onClick={() => handleRatingChange("rating", star)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your detailed feedback..."
                  value={reviewData.comment}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              {isShopReviewingApprentice && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="timeliness_rating">Timeliness Rating</Label>
                    <Select onValueChange={(value) => handleRatingChange("timeliness_rating", Number.parseInt(value))}>
                      <SelectTrigger id="timeliness_rating">
                        <SelectValue placeholder="Rate timeliness" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={String(val)}>
                            {val} Star{val > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="work_ethic_rating">Work Ethic Rating</Label>
                    <Select onValueChange={(value) => handleRatingChange("work_ethic_rating", Number.parseInt(value))}>
                      <SelectTrigger id="work_ethic_rating">
                        <SelectValue placeholder="Rate work ethic" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={String(val)}>
                            {val} Star{val > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="material_knowledge_rating">Material Knowledge Rating</Label>
                    <Select
                      onValueChange={(value) => handleRatingChange("material_knowledge_rating", Number.parseInt(value))}
                    >
                      <SelectTrigger id="material_knowledge_rating">
                        <SelectValue placeholder="Rate material knowledge" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={String(val)}>
                            {val} Star{val > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile_accuracy_rating">Profile Accuracy Rating</Label>
                    <Select
                      onValueChange={(value) => handleRatingChange("profile_accuracy_rating", Number.parseInt(value))}
                    >
                      <SelectTrigger id="profile_accuracy_rating">
                        <SelectValue placeholder="Rate profile accuracy" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={String(val)}>
                            {val} Star{val > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="skills_shown">Skills Observed (comma-separated)</Label>
                    <Input
                      id="skills_shown"
                      placeholder="e.g., Wiring, Pipe Fitting"
                      value={reviewData.skills_shown.join(", ")}
                      onChange={handleSkillsChange}
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting Review..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
