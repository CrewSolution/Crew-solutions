"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  getJobPostings,
  createJobPosting,
  getActiveJobs,
  createReview,
  updateActiveJob,
  type User,
  type JobPosting,
  type ActiveJob,
  type Review,
} from "@/lib/storage"
import { StarIcon, Zap } from "lucide-react"

export default function ShopDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    description: "",
    apprenticesNeeded: 1,
    expectedDuration: "",
    daysNeeded: 0,
    startDate: "",
    hoursPerDay: 8,
    workDays: [] as string[],
    payRate: "",
    requirements: [] as string[],
    requiredSkills: [] as string[],
    priority: "medium" as "high" | "medium" | "low",
  })
  const [reviewForm, setReviewForm] = useState({
    jobId: "",
    revieweeId: "",
    reviewerType: "shop" as "shop" | "apprentice",
    rating: 5,
    comment: "",
    jobTitle: "",
  })
  const [jobToReview, setJobToReview] = useState<ActiveJob | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const workDayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.type !== "shop") {
      router.push("/login")
      return
    }
    setCurrentUser(user)
    fetchData(user.id)
  }, [router])

  const fetchData = async (shopId: string) => {
    setIsLoading(true)
    try {
      const postings = await getJobPostings(shopId)
      setJobPostings(postings)

      const active = await getActiveJobs(shopId, "shop", "in-progress")
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

  const handleNewJobChange = (field: string, value: any) => {
    setNewJobForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkDayToggle = (day: string) => {
    setNewJobForm((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day) ? prev.workDays.filter((d) => d !== day) : [...prev.workDays, day],
    }))
  }

  const handleRequiredSkillToggle = (skill: string) => {
    setNewJobForm((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }))
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    try {
      const jobData = {
        ...newJobForm,
        shopId: currentUser.id,
        applicants: 0,
        postedDate: new Date().toISOString(),
        status: "active" as const,
      }
      await createJobPosting(jobData)
      toast({ title: "Job posted successfully!" })
      setNewJobForm({
        title: "",
        description: "",
        apprenticesNeeded: 1,
        expectedDuration: "",
        daysNeeded: 0,
        startDate: "",
        hoursPerDay: 8,
        workDays: [],
        payRate: "",
        requirements: [],
        requiredSkills: [],
        priority: "medium",
      })
      fetchData(currentUser.id) // Refresh job postings
    } catch (error: any) {
      toast({
        title: "Error posting job",
        description: error.message || "Failed to create job posting.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteJob = (job: ActiveJob) => {
    setJobToReview(job)
    setReviewForm((prev) => ({
      ...prev,
      jobId: job.id,
      revieweeId: job.apprenticeId,
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
        reviewerType: "shop",
      }
      await createReview(reviewData)

      // Update active job status to 'reviewed'
      await updateActiveJob(jobToReview.id, { status: "reviewed" })

      toast({ title: "Review submitted and job completed!" })
      setJobToReview(null)
      setReviewForm({
        jobId: "",
        revieweeId: "",
        reviewerType: "shop",
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
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold">Crew Solutions</span>
        </div>
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
          <h1 className="text-3xl font-bold">Shop Dashboard</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {currentUser.ownerName || currentUser.businessName}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage your job postings and active apprentices.</p>
                <div className="mt-4 flex items-center gap-2">
                  <StarIcon className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{currentUser.rating?.toFixed(1) || "N/A"} Stars</span>
                  <span className="text-gray-500">({currentUser.jobsCompleted || 0} Jobs Completed)</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={newJobForm.title}
                        onChange={(e) => handleNewJobChange("title", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payRate">Pay Rate</Label>
                      <Input
                        id="payRate"
                        value={newJobForm.payRate}
                        onChange={(e) => handleNewJobChange("payRate", e.target.value)}
                        placeholder="$XX/hour or Flat Rate"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newJobForm.description}
                      onChange={(e) => handleNewJobChange("description", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apprenticesNeeded">Apprentices Needed</Label>
                      <Input
                        id="apprenticesNeeded"
                        type="number"
                        value={newJobForm.apprenticesNeeded}
                        onChange={(e) => handleNewJobChange("apprenticesNeeded", Number.parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedDuration">Expected Duration</Label>
                      <Input
                        id="expectedDuration"
                        value={newJobForm.expectedDuration}
                        onChange={(e) => handleNewJobChange("expectedDuration", e.target.value)}
                        placeholder="e.g., 2 weeks, 1 month"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="daysNeeded">Total Days Needed</Label>
                      <Input
                        id="daysNeeded"
                        type="number"
                        value={newJobForm.daysNeeded}
                        onChange={(e) => handleNewJobChange("daysNeeded", Number.parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Expected Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newJobForm.startDate}
                        onChange={(e) => handleNewJobChange("startDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hoursPerDay">Hours Per Day</Label>
                      <Input
                        id="hoursPerDay"
                        type="number"
                        value={newJobForm.hoursPerDay}
                        onChange={(e) => handleNewJobChange("hoursPerDay", Number.parseInt(e.target.value))}
                        min="1"
                        max="12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newJobForm.priority}
                        onValueChange={(value) => handleNewJobChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Work Days</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {workDayOptions.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`work-day-${day}`}
                            checked={newJobForm.workDays.includes(day)}
                            onCheckedChange={() => handleWorkDayToggle(day)}
                          />
                          <Label htmlFor={`work-day-${day}`}>{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Skills</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {skillOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={newJobForm.requiredSkills.includes(skill)}
                            onCheckedChange={() => handleRequiredSkillToggle(skill)}
                          />
                          <Label htmlFor={`skill-${skill}`} className="text-sm font-normal">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Additional Requirements (comma-separated)</Label>
                    <Input
                      id="requirements"
                      value={newJobForm.requirements.join(", ")}
                      onChange={(e) =>
                        handleNewJobChange(
                          "requirements",
                          e.target.value.split(",").map((s) => s.trim()),
                        )
                      }
                      placeholder="e.g., Must have own tools, Valid driver's license"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Post Job
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active-jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
              <TabsTrigger value="my-postings">My Job Postings</TabsTrigger>
            </TabsList>
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
                          <p className="text-sm text-gray-500">Apprentice: {job.apprenticeName}</p>
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
            <TabsContent value="my-postings">
              <Card>
                <CardHeader>
                  <CardTitle>My Job Postings</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {jobPostings.length === 0 ? (
                    <p className="text-gray-500">You haven't posted any jobs yet.</p>
                  ) : (
                    jobPostings.map((job) => (
                      <div key={job.id} className="border p-4 rounded-md">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.description}</p>
                        <p className="text-sm text-gray-500">Status: {job.status}</p>
                        <p className="text-sm text-gray-500">Applicants: {job.applicants}</p>
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
                <CardTitle>Review Apprentice for {jobToReview.title}</CardTitle>
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
                      placeholder="Share your feedback on the apprentice's performance."
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
