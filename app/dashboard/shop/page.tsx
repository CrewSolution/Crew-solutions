"use client"

import type React from "react"
import type { Review } from "@/lib/storage" // Declare the Review variable

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Briefcase, MapPin, Users, CalendarDays, DollarSign, Clock } from "lucide-react"
import {
  getCurrentUser,
  getJobPostings,
  createJobPosting,
  getActiveJobs,
  createReview,
  updateActiveJob,
  getJobInvitations,
  type User,
  type JobPosting,
  type ActiveJob,
  type JobInvitation,
} from "@/lib/storage"

export default function ShopDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<JobInvitation[]>([])
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

    const fetchData = async () => {
      try {
        const [postings, active, invitations] = await Promise.all([
          getJobPostings(user.id),
          getActiveJobs(user.id, "shop", "in-progress"),
          getJobInvitations(user.id, "pending"), // Assuming getJobInvitations can filter by shopId too, or we filter client-side
        ])
        setJobPostings(postings)
        setActiveJobs(active)
        // Filter invitations for the current shop if the API doesn't support it directly
        setPendingInvitations(invitations.filter((inv) => inv.shop_id === user.id && inv.status === "pending"))
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

    fetchData()
  }, [router])

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
    <div className="flex flex-col min-h-screen bg-yellow-50 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Shop Dashboard</h1>
        <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => router.push("/dashboard/shop/new-job")}>
          Post New Job
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Shop Profile Card */}
        <Card className="col-span-1 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Your Electrical Shop</CardTitle>
            <Briefcase className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser.profile_image || "/placeholder.svg?height=80&width=80"} alt="Shop Logo" />
                <AvatarFallback>{currentUser.business_name ? currentUser.business_name[0] : "S"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.business_name || "N/A"}</h2>
                <p className="text-sm text-gray-500">{currentUser.owner_name || "N/A"}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>
                    {currentUser.city}, {currentUser.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Type:</strong> {currentUser.business_type || "N/A"}
              </p>
              <p>
                <strong>Years in Business:</strong> {currentUser.years_in_business || "N/A"}
              </p>
              <p>
                <strong>License:</strong> {currentUser.license_number || "N/A"}
              </p>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span>
                  {currentUser.rating?.toFixed(1) || "N/A"} ({currentUser.jobs_completed || 0} jobs)
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full border-yellow-300 text-yellow-600 hover:bg-yellow-50 bg-transparent"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Job Postings Summary */}
        <Card className="col-span-2 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Your Electrical Job Postings</CardTitle>
            <Users className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {jobPostings.length > 0 ? (
                jobPostings.map((job) => (
                  <Card key={job.id} className="border-gray-200 p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.description.substring(0, 70)}...</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      <span>Start: {new Date(job.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>Pay: {job.pay_rate}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        {job.status}
                      </Badge>
                      <Button variant="link" className="text-yellow-600 hover:text-yellow-700">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500">
                  No job postings yet. Click "Post New Job" to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card className="col-span-1 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Active Electrical Jobs</CardTitle>
            <Briefcase className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <div key={job.id} className="mb-4 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-600">Apprentice: {job.apprentice_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    <span>Start: {new Date(job.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      Hours: {job.total_hours} / {job.total_days * job.hours_per_day}
                    </span>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-700">
                    {job.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No active jobs.</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        <Card className="col-span-2 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Pending Electrical Job Invitations</CardTitle>
            <Users className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            {pendingInvitations.length > 0 ? (
              pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="mb-4 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800">{invitation.title}</h3>
                  <p className="text-sm text-gray-600">{invitation.description.substring(0, 70)}...</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    <span>Start: {new Date(invitation.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>Pay: {invitation.pay_rate}</span>
                  </div>
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                    >
                      View Details
                    </Button>
                    {/* Add Accept/Decline buttons if this view allows direct action */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No pending invitations.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Job Form */}
      <div className="mt-8">
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
                  <Select value={newJobForm.priority} onValueChange={(value) => handleNewJobChange("priority", value)}>
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
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                Post Job
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Review Form */}
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
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
