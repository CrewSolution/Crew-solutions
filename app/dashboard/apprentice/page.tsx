"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  getJobInvitations,
  updateJobInvitationStatus,
  getActiveJobs,
  createReview,
  updateActiveJob,
  createActiveJob,
  type User,
  type JobInvitation,
  type ActiveJob,
  type Review,
} from "@/lib/storage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function ApprenticeDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [incomingJobs, setIncomingJobs] = useState<JobInvitation[]>([])
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [jobToReview, setJobToReview] = useState<ActiveJob | null>(null)
  const [reviewForm, setReviewForm] = useState({
    jobId: "",
    revieweeId: "",
    reviewerType: "apprentice" as "shop" | "apprentice",
    rating: 5,
    comment: "",
    jobTitle: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.type !== "apprentice") {
      router.push("/login")
      return
    }
    setCurrentUser(user)
    fetchData(user.id)
  }, [router])

  const fetchData = async (apprenticeId: string) => {
    setIsLoading(true)
    try {
      const invitations = await getJobInvitations(apprenticeId, "pending")
      setIncomingJobs(invitations)

      const active = await getActiveJobs(apprenticeId, "apprentice", "in-progress")
      setActiveJobs(active)
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message || "Failed to fetch dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptJob = async (invitation: JobInvitation) => {
    if (!currentUser) return
    try {
      await updateJobInvitationStatus(invitation.id, "accepted")
      // Create an active job entry
      await createActiveJob({
        jobPostingId: invitation.jobPostingId,
        shopId: invitation.shopId,
        apprenticeId: currentUser.id,
        title: invitation.title,
        shopName: invitation.shopName,
        apprenticeName: `${currentUser.firstName} ${currentUser.lastName?.charAt(0)}.`,
        startDate: invitation.startDate,
        totalDays: invitation.daysNeeded,
        hoursPerDay: invitation.hoursPerDay,
        payRate: invitation.payRate,
        status: "in-progress",
        daysWorked: 0,
        totalHours: 0,
        pendingHours: 0,
        canComplete: false,
        canSubmitHours: true, // Apprentice can submit hours
      })
      toast({ title: "Job accepted!", description: `You've accepted ${invitation.title}.` })
      fetchData(currentUser.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error accepting job",
        description: error.message || "Failed to accept job.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineJob = async (invitation: JobInvitation) => {
    if (!currentUser) return
    try {
      await updateJobInvitationStatus(invitation.id, "declined")
      toast({ title: "Job declined", description: `You've declined ${invitation.title}.` })
      fetchData(currentUser.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error declining job",
        description: error.message || "Failed to decline job.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteJob = (job: ActiveJob) => {
    setJobToReview(job)
    setReviewForm((prev) => ({
      ...prev,
      jobId: job.id,
      revieweeId: job.shopId, // Apprentice reviews the shop
      jobTitle: job.title,
    }))
  }

  const handleReviewChange = (field: string, value: any) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }))
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !jobToReview) return

    try {
      const reviewData: Omit<Review, "id" | "date"> = {
        ...reviewForm,
        reviewerId: currentUser.id,
        reviewerType: "apprentice",
      }
      await createReview(reviewData)

      // Update active job status to 'reviewed'
      await updateActiveJob(jobToReview.id, { status: "reviewed" })

      toast({ title: "Review submitted and job completed!" })
      setJobToReview(null)
      setReviewForm({
        jobId: "",
        revieweeId: "",
        reviewerType: "apprentice",
        rating: 5,
        comment: "",
        jobTitle: "",
      })
      fetchData(currentUser.id) // Refresh active jobs
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
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!currentUser) {
    return null // Should redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold">Crew Solutions</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentUser(null)
              router.push("/login")
            }}
          >
            Logout
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto grid gap-6">
          <h1 className="text-3xl font-bold">Apprentice Dashboard</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Welcome, {currentUser.firstName} {currentUser.lastName?.charAt(0)}!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage your job applications and active projects.</p>
                <div className="mt-4 flex items-center gap-2">
                  <StarIcon className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{currentUser.rating?.toFixed(1) || "N/A"} Stars</span>
                  <span className="text-gray-500">({currentUser.jobsCompleted || 0} Jobs Completed)</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.profileImage || "/placeholder.svg?height=80&width=80"} />
                  <AvatarFallback>
                    {currentUser.firstName?.[0]}
                    {currentUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="font-semibold">{currentUser.email}</p>
                  <p className="text-sm text-gray-500">Experience: {currentUser.experienceLevel}</p>
                  <p className="text-sm text-gray-500">Availability: {currentUser.availability}</p>
                  <p className="text-sm text-gray-500">Skills: {currentUser.skills?.join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="incoming-jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="incoming-jobs">Incoming Job Requests</TabsTrigger>
              <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="incoming-jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Incoming Job Requests</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {incomingJobs.length === 0 ? (
                    <p className="text-gray-500">No new job requests at the moment.</p>
                  ) : (
                    incomingJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-gray-500">Shop: {job.shopName}</p>
                          <p className="text-sm text-gray-500">Pay: {job.payRate}</p>
                          <p className="text-sm text-gray-500">Start Date: {job.startDate}</p>
                          <p className="text-sm text-gray-500">Days Needed: {job.daysNeeded}</p>
                          <p className="text-sm text-gray-500">Hours/Day: {job.hoursPerDay}</p>
                          <p className="text-sm text-gray-500">Work Days: {job.workDays.join(", ")}</p>
                          <p className="text-sm text-gray-500">Required Skills: {job.requiredSkills.join(", ")}</p>
                          <p className="text-sm text-gray-500">Description: {job.description}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                          <Button onClick={() => handleAcceptJob(job)}>Accept</Button>
                          <Button variant="outline" onClick={() => handleDeclineJob(job)}>
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active-jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Active Jobs</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {activeJobs.length === 0 ? (
                    <p className="text-gray-500">No active jobs at the moment.</p>
                  ) : (
                    activeJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-gray-500">Shop: {job.shopName}</p>
                          <p className="text-sm text-gray-500">Start Date: {job.startDate}</p>
                          <p className="text-sm text-gray-500">Status: {job.status}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Button onClick={() => handleCompleteJob(job)}>Complete Job & Review</Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {jobToReview && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Review Shop for {jobToReview.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitReview} className="space-y-4">
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
                      placeholder="Share your feedback on the shop's communication, project management, etc."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
