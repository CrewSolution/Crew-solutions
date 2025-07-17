"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  getActiveJobById,
  createReview,
  updateActiveJob,
  updateUser,
  fetchReviews, // Declare fetchReviews here
  type User,
  type ActiveJob,
} from "@/lib/storage"

const skillOptions = [
  "Basic Electrical Theory",
  "Wiring Installation",
  "Circuit Analysis",
  "Motor Controls",
  "Panel Installation",
  "Conduit Bending",
  "Blueprint Reading",
  "Safety Protocols",
  "Hand Tools",
  "Power Tools",
]

export default function JobCompletePage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [jobData, setJobData] = useState<ActiveJob | null>(null)
  const [apprenticeUser, setApprenticeUser] = useState<User | null>(null) // To get apprentice's full name
  const [ratings, setRatings] = useState({
    timeliness: 0,
    workEthic: 0,
    materialKnowledge: 0,
    profileAccuracy: 0,
  })
  const [skillsShown, setSkillsShown] = useState<string[]>([])
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
      router.push("/dashboard/shop")
      return
    }

    try {
      const activeJob = await getActiveJobById(jobId)
      if (!activeJob || activeJob.shopId !== user.id) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to complete this job.",
          variant: "destructive",
        })
        router.push("/dashboard/shop")
        return
      }
      setJobData(activeJob)

      // Fetch apprentice details
      const apprentice = await updateUser(activeJob.apprenticeId, {}) // Fetch full apprentice data
      setApprenticeUser(apprentice)

      // Initialize skillsShown with apprentice's listed skills
      if (apprentice?.skills) {
        setSkillsShown(apprentice.skills)
      }
    } catch (error) {
      console.error("Failed to load job data:", error)
      toast({
        title: "Error",
        description: "Failed to load job details. Please try again.",
        variant: "destructive",
      })
      router.push("/dashboard/shop")
    }
  }, [router, jobId, toast])

  useEffect(() => {
    loadJobAndUser()
  }, [loadJobAndUser])

  const handleRatingChange = (category: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }))
  }

  const handleSkillToggle = (skill: string) => {
    setSkillsShown((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!currentUser || !jobData || !apprenticeUser) {
      toast({
        title: "Error",
        description: "Missing user or job data.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate all ratings are provided
    const allRatingsProvided = Object.values(ratings).every((rating) => rating > 0)
    if (!allRatingsProvided) {
      toast({
        title: "Missing Ratings",
        description: "Please provide ratings for all categories.",
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
        revieweeId: jobData.apprenticeId,
        reviewerType: "shop",
        rating: Math.round(Object.values(ratings).reduce((sum, r) => sum + r, 0) / Object.values(ratings).length), // Overall average rating
        comment: comment,
        ratings: ratings,
        skillsShown: skillsShown,
        jobTitle: jobData.title,
      })

      // Update active job status to 'reviewed'
      await updateActiveJob(jobData.id, { status: "reviewed", endDate: new Date().toISOString().split("T")[0] })

      // Update apprentice's total jobs completed and average rating
      const apprenticeReviews = await fetchReviews(apprenticeUser.id, true)
      const newJobsCompleted = (apprenticeUser.jobsCompleted || 0) + 1
      const newAverageRating =
        apprenticeReviews.length > 0
          ? (apprenticeReviews.reduce((sum, r) => sum + r.rating, 0) + ratings.profileAccuracy) /
            (apprenticeReviews.length + 1)
          : ratings.profileAccuracy

      await updateUser(apprenticeUser.id, {
        jobsCompleted: newJobsCompleted,
        rating: newAverageRating,
        hoursCompleted: (
          Number.parseInt(apprenticeUser.hoursCompleted?.toString() || "0") + jobData.totalHours
        ).toString(),
      })

      toast({
        title: "Job Completed & Reviewed",
        description: "The job has been marked complete and your review submitted.",
      })

      router.push("/dashboard/shop?tab=active") // Redirect back to shop dashboard
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

  const renderStarRating = (category: string, currentRating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {currentRating > 0 ? `${currentRating}/5` : "Not rated"}
        </span>
      </div>
    )
  }

  if (!currentUser || !jobData || !apprenticeUser) {
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complete Job</h1>
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
            <CardDescription>Review the completed work details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Apprentice</p>
                <p className="text-sm text-muted-foreground">
                  {apprenticeUser.firstName} {apprenticeUser.lastName?.charAt(0)}.
                </p>
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
              <CardTitle>Rate Apprentice Performance</CardTitle>
              <CardDescription>Provide ratings for different aspects of their work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Timeliness</Label>
                  <p className="text-sm text-muted-foreground mb-2">How punctual and reliable was the apprentice?</p>
                  {renderStarRating("timeliness", ratings.timeliness)}
                </div>

                <div>
                  <Label className="text-base font-medium">Work Ethic</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How was their attitude, effort, and professionalism?
                  </p>
                  {renderStarRating("workEthic", ratings.workEthic)}
                </div>

                <div>
                  <Label className="text-base font-medium">Material Knowledge</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How well did they understand electrical concepts and materials?
                  </p>
                  {renderStarRating("materialKnowledge", ratings.materialKnowledge)}
                </div>

                <div>
                  <Label className="text-base font-medium">Profile Accuracy</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How accurately did their profile represent their actual skill level?
                  </p>
                  {renderStarRating("profileAccuracy", ratings.profileAccuracy)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Demonstrated</CardTitle>
              <CardDescription>
                Check the skills that {apprenticeUser.firstName} demonstrated on the job site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Apprentice's Listed Skills:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {apprenticeUser.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Skills Shown on Job Site:</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={skillsShown.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm font-normal">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Comments</CardTitle>
              <CardDescription>Share any additional feedback about the apprentice's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the apprentice's performance, areas of strength, and any suggestions for improvement..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || Object.values(ratings).some((rating) => rating === 0)}
              className="flex-1"
            >
              {isSubmitting ? "Submitting Review..." : "Complete Job & Submit Review"}
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
