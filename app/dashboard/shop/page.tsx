"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  logoutUser,
  createJobPosting,
  getJobPostings,
  getActiveJobs,
  getJobInvitations,
  getUsers,
  deleteJobPosting,
  createJobInvitation,
} from "@/lib/storage"
import type { User, JobPosting, ActiveJob, JobInvitation } from "@/lib/types"
import { format } from "date-fns"
import { CalendarIcon, Send, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { findMatchingApprentices, calculateMatchScore } from "@/lib/matching"
import { BriefcaseIcon, CheckCircleIcon } from "lucide-react" // Importing missing icons

export default function ShopDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [invitations, setInvitations] = useState<JobInvitation[]>([])
  const [apprentices, setApprentices] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newJob, setNewJob] = useState<Partial<JobPosting>>({
    title: "",
    description: "",
    apprentices_needed: 1,
    expected_duration: "",
    days_needed: 1,
    start_date: new Date().toISOString().split("T")[0],
    hours_per_day: 8,
    work_days: [],
    pay_rate: "",
    requirements: [],
    required_skills: [],
    priority: "medium",
    status: "active",
  })
  const [selectedJobForInvite, setSelectedJobForInvite] = useState<JobPosting | null>(null)
  const [recommendedApprentices, setRecommendedApprentices] = useState<User[]>([])

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.type !== "shop") {
        router.push("/login")
        return
      }
      setUser(currentUser)
      await fetchShopData(currentUser.id)
      setLoading(false)
    }
    loadData()
  }, [router])

  const fetchShopData = async (shopId: string) => {
    try {
      const [postings, active, invites, allApprentices] = await Promise.all([
        getJobPostings(shopId),
        getActiveJobs({ shopId }),
        getJobInvitations({ shopId }),
        getUsers("apprentice"),
      ])
      setJobPostings(postings)
      setActiveJobs(active)
      setInvitations(invites)
      setApprentices(allApprentices)
    } catch (error) {
      console.error("Failed to fetch shop data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  const handleNewJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewJob((prev) => ({ ...prev, [id]: value }))
  }

  const handleNewJobSelectChange = (id: string, value: string | number) => {
    setNewJob((prev) => ({ ...prev, [id]: value }))
  }

  const handleWorkDaysChange = (day: string, isChecked: boolean) => {
    setNewJob((prev) => {
      const currentDays = prev.work_days || []
      if (isChecked) {
        return { ...prev, work_days: [...currentDays, day] }
      } else {
        return { ...prev, work_days: currentDays.filter((d) => d !== day) }
      }
    })
  }

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewJob((prev) => ({ ...prev, requirements: e.target.value.split(",").map((s) => s.trim()) }))
  }

  const handleRequiredSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewJob((prev) => ({ ...prev, required_skills: e.target.value.split(",").map((s) => s.trim()) }))
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const postedJob = await createJobPosting({ ...newJob, shop_id: user.id })
      toast({
        title: "Job Posted!",
        description: `"${postedJob.title}" has been successfully posted.`,
      })
      setNewJob({
        title: "",
        description: "",
        apprentices_needed: 1,
        expected_duration: "",
        days_needed: 1,
        start_date: new Date().toISOString().split("T")[0],
        hours_per_day: 8,
        work_days: [],
        pay_rate: "",
        requirements: [],
        required_skills: [],
        priority: "medium",
        status: "active",
      })
      await fetchShopData(user.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error Posting Job",
        description: error.message || "An error occurred while posting the job.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return
    setLoading(true)
    try {
      await deleteJobPosting(jobId)
      toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted.",
      })
      await fetchShopData(user.id)
    } catch (error: any) {
      toast({
        title: "Error Deleting Job",
        description: error.message || "An error occurred while deleting the job.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenInviteDialog = (job: JobPosting) => {
    setSelectedJobForInvite(job)
    const matches = findMatchingApprentices(job, apprentices)
    const apprenticesWithScores = matches
      .map((app) => ({
        ...app,
        matchScore: calculateMatchScore(job, app),
      }))
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by score descending
    setRecommendedApprentices(apprenticesWithScores)
  }

  const handleSendInvitation = async (apprenticeId: string) => {
    if (!user || !selectedJobForInvite) return

    setLoading(true)
    try {
      const invitation: Partial<JobInvitation> = {
        job_posting_id: selectedJobForInvite.id,
        shop_id: user.id,
        apprentice_id: apprenticeId,
        shop_name: user.business_name || user.owner_name || "Your Shop",
        title: selectedJobForInvite.title,
        description: selectedJobForInvite.description,
        pay_rate: selectedJobForInvite.pay_rate,
        days_needed: selectedJobForInvite.days_needed,
        start_date: selectedJobForInvite.start_date,
        hours_per_day: selectedJobForInvite.hours_per_day,
        work_days: selectedJobForInvite.work_days,
        requirements: selectedJobForInvite.requirements,
        required_skills: selectedJobForInvite.required_skills,
        location: user.city + ", " + user.state, // Assuming shop location
        priority: selectedJobForInvite.priority,
        total_pay: selectedJobForInvite.total_cost,
        weekly_pay: selectedJobForInvite.weekly_payment,
        status: "pending",
      }
      await createJobInvitation(invitation)
      toast({
        title: "Invitation Sent!",
        description: "The invitation has been sent to the apprentice.",
      })
      setSelectedJobForInvite(null) // Close dialog
      await fetchShopData(user.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error Sending Invitation",
        description: error.message || "An error occurred while sending the invitation.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteJob = async (job: ActiveJob) => {
    router.push(`/job/${job.id}/complete`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return null // Should redirect to login
  }

  const totalJobsPosted = jobPostings.length
  const activeJobCount = activeJobs.filter((job) => job.status === "in-progress").length
  const pendingInvitationsCount = invitations.filter((invite) => invite.status === "pending").length

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800">
        <h1 className="text-xl font-semibold">Shop Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Welcome, {user.business_name || user.owner_name}!</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalJobsPosted}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Currently in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
              <Send className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvitationsCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting apprentice response</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="post-job" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="post-job">Post New Job</TabsTrigger>
            <TabsTrigger value="my-jobs">My Job Postings</TabsTrigger>
            <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="post-job">
            <Card>
              <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
                <CardDescription>Fill out the details to find the perfect apprentice for your project.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostJob} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="Electrical Wiring Assistant"
                      value={newJob.title}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the tasks and responsibilities."
                      value={newJob.description}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="apprentices_needed">Apprentices Needed</Label>
                      <Input
                        id="apprentices_needed"
                        type="number"
                        value={newJob.apprentices_needed}
                        onChange={handleNewJobChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pay_rate">Pay Rate (e.g., "$20-25/hour")</Label>
                      <Input
                        id="pay_rate"
                        placeholder="$20-25/hour"
                        value={newJob.pay_rate}
                        onChange={handleNewJobChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newJob.start_date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newJob.start_date ? format(new Date(newJob.start_date), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newJob.start_date ? new Date(newJob.start_date) : undefined}
                            onSelect={(date) =>
                              handleNewJobSelectChange("start_date", date?.toISOString().split("T")[0] || "")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expected_duration">Expected Duration</Label>
                      <Input
                        id="expected_duration"
                        placeholder="e.g., 2 weeks, 1 month"
                        value={newJob.expected_duration}
                        onChange={handleNewJobChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="days_needed">Total Days Needed</Label>
                      <Input
                        id="days_needed"
                        type="number"
                        value={newJob.days_needed}
                        onChange={handleNewJobChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hours_per_day">Hours Per Day</Label>
                      <Input
                        id="hours_per_day"
                        type="number"
                        value={newJob.hours_per_day}
                        onChange={handleNewJobChange}
                        min="1"
                        max="12"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Work Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day}`}
                            checked={newJob.work_days?.includes(day) || false}
                            onCheckedChange={(checked) => handleWorkDaysChange(day, !!checked)}
                          />
                          <Label htmlFor={`day-${day}`}>{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                    <Input
                      id="requirements"
                      placeholder="e.g., Basic tools, OSHA certified"
                      value={newJob.requirements?.join(", ") || ""}
                      onChange={handleRequirementsChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="required_skills">Required Skills (comma-separated)</Label>
                    <Input
                      id="required_skills"
                      placeholder="e.g., Wiring, Pipe Fitting, HVAC Maintenance"
                      value={newJob.required_skills?.join(", ") || ""}
                      onChange={handleRequiredSkillsChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      onValueChange={(value) => handleNewJobSelectChange("priority", value)}
                      value={newJob.priority}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Posting Job..." : "Post Job"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="my-jobs">
            <Card>
              <CardHeader>
                <CardTitle>My Job Postings</CardTitle>
                <CardDescription>Manage your active and filled job listings.</CardDescription>
              </CardHeader>
              <CardContent>
                {jobPostings.length === 0 ? (
                  <p>You haven't posted any jobs yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {jobPostings.map((job) => (
                      <Card key={job.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {job.pay_rate} &bull; {job.expected_duration} &bull; {job.status}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Send className="h-4 w-4 mr-2" /> Invite Apprentices
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Invite Apprentices for "{job.title}"</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Select apprentices to send an invitation for this job.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="max-h-60 overflow-y-auto">
                                  {recommendedApprentices.length === 0 ? (
                                    <p>No apprentices found matching this job's requirements.</p>
                                  ) : (
                                    <div className="grid gap-3">
                                      {recommendedApprentices.map((apprentice) => (
                                        <div
                                          key={apprentice.id}
                                          className="flex items-center justify-between rounded-md border p-3"
                                        >
                                          <div className="flex items-center gap-3">
                                            {/* Placeholder for Avatar component */}
                                            <div>
                                              <p className="font-medium">
                                                {apprentice.first_name} {apprentice.last_name}
                                              </p>
                                              <p className="text-sm text-gray-500">{apprentice.experience_level}</p>
                                              <p className="text-xs text-gray-500">
                                                Match Score: {apprentice.matchScore}%
                                              </p>
                                            </div>
                                          </div>
                                          <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSendInvitation(apprentice.id)}
                                            disabled={
                                              loading ||
                                              invitations.some(
                                                (inv) =>
                                                  inv.job_posting_id === job.id &&
                                                  inv.apprentice_id === apprentice.id &&
                                                  inv.status === "pending",
                                              )
                                            }
                                          >
                                            {invitations.some(
                                              (inv) =>
                                                inv.job_posting_id === job.id &&
                                                inv.apprentice_id === apprentice.id &&
                                                inv.status === "pending",
                                            )
                                              ? "Invited"
                                              : "Invite"}
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedJobForInvite(null)}>
                                    Close
                                  </AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your job posting.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <p>{job.description}</p>
                          <p className="mt-1">**Required Skills:** {job.required_skills?.join(", ") || "N/A"}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active-jobs">
            <Card>
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>View and manage jobs currently in progress.</CardDescription>
              </CardHeader>
              <CardContent>
                {activeJobs.length === 0 ? (
                  <p>You have no active jobs.</p>
                ) : (
                  <div className="grid gap-4">
                    {activeJobs.map((job) => (
                      <Card key={job.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Apprentice: {job.apprentice_name} &bull; Status: {job.status}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Start Date: {format(new Date(job.start_date), "PPP")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {job.can_complete && (
                              <Button variant="outline" size="sm" onClick={() => handleCompleteJob(job)}>
                                Complete Job
                              </Button>
                            )}
                            {job.status === "in-progress" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => router.push(`/job/${job.id}/review`)}
                              >
                                Review Apprentice
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label>Progress</Label>
                          <Progress value={(job.days_worked / job.total_days) * 100} className="w-full" />
                          <p className="text-sm text-gray-500 mt-1">
                            {job.days_worked} of {job.total_days} days completed
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
