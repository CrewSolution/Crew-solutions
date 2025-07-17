"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  logoutUser,
  getJobPostings,
  getActiveJobs,
  getJobInvitations,
  updateJobInvitation,
  createActiveJob,
  createTimeEntry,
  getTimeEntries,
} from "@/lib/storage"
import type { User, JobPosting, ActiveJob, JobInvitation, TimeEntry } from "@/lib/types"
import { format } from "date-fns"
import { CalendarIcon, Clock, CheckCircle2, XCircle, Send } from "lucide-react"
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

export default function ApprenticeDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [availableJobs, setAvailableJobs] = useState<JobPosting[]>([])
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [invitations, setInvitations] = useState<JobInvitation[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [newTimeEntry, setNewTimeEntry] = useState<Partial<TimeEntry>>({
    date: new Date().toISOString().split("T")[0],
    hours: 0,
  })
  const [selectedActiveJob, setSelectedActiveJob] = useState<ActiveJob | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.type !== "apprentice") {
        router.push("/login")
        return
      }
      setUser(currentUser)
      await fetchApprenticeData(currentUser.id)
      setLoading(false)
    }
    loadData()
  }, [router])

  const fetchApprenticeData = async (apprenticeId: string) => {
    try {
      const [jobs, active, invites, entries] = await Promise.all([
        getJobPostings(undefined, "active"), // Get all active job postings
        getActiveJobs({ apprenticeId }),
        getJobInvitations({ apprenticeId }),
        getTimeEntries({ apprenticeId }),
      ])
      setAvailableJobs(jobs)
      setActiveJobs(active)
      setInvitations(invites)
      setTimeEntries(entries)
    } catch (error) {
      console.error("Failed to fetch apprentice data:", error)
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

  const handleAcceptInvitation = async (invitation: JobInvitation) => {
    if (!user) return
    setLoading(true)
    try {
      await updateJobInvitation(invitation.id, { status: "accepted" })
      // Create an active job entry
      await createActiveJob({
        job_posting_id: invitation.job_posting_id,
        shop_id: invitation.shop_id,
        apprentice_id: user.id,
        title: invitation.title,
        shop_name: invitation.shop_name,
        apprentice_name: user.first_name + " " + user.last_name,
        start_date: invitation.start_date,
        total_days: invitation.days_needed,
        hours_per_day: invitation.hours_per_day,
        pay_rate: invitation.pay_rate,
        status: "in-progress",
      })
      toast({
        title: "Invitation Accepted!",
        description: `You have accepted the job "${invitation.title}".`,
      })
      await fetchApprenticeData(user.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error Accepting Invitation",
        description: error.message || "An error occurred while accepting the invitation.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    if (!user) return
    setLoading(true)
    try {
      await updateJobInvitation(invitationId, { status: "declined" })
      toast({
        title: "Invitation Declined",
        description: "You have declined the invitation.",
      })
      await fetchApprenticeData(user.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error Declining Invitation",
        description: error.message || "An error occurred while declining the invitation.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTimeEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewTimeEntry((prev) => ({ ...prev, [id]: id === "hours" ? Number.parseFloat(value) : value }))
  }

  const handleTimeEntryDateChange = (date: Date | undefined) => {
    setNewTimeEntry((prev) => ({ ...prev, date: date?.toISOString().split("T")[0] || "" }))
  }

  const handleSubmitTime = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedActiveJob) return

    setLoading(true)
    try {
      await createTimeEntry({
        job_id: selectedActiveJob.id,
        apprentice_id: user.id,
        date: newTimeEntry.date,
        hours: newTimeEntry.hours,
        approved: false, // Always false on submission
      })
      toast({
        title: "Time Submitted!",
        description: "Your hours have been submitted for approval.",
      })
      setNewTimeEntry({ date: new Date().toISOString().split("T")[0], hours: 0 })
      setSelectedActiveJob(null) // Close dialog
      await fetchApprenticeData(user.id) // Refresh data
    } catch (error: any) {
      toast({
        title: "Error Submitting Time",
        description: error.message || "An error occurred while submitting hours.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReviewJob = (job: ActiveJob) => {
    router.push(`/job/${job.id}/review`)
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

  const totalJobsCompleted = activeJobs.filter((job) => job.status === "completed" || job.status === "reviewed").length
  const pendingInvitationsCount = invitations.filter((invite) => invite.status === "pending").length
  const pendingHoursApproval = timeEntries.filter((entry) => !entry.approved).length

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800">
        <h1 className="text-xl font-semibold">Apprentice Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Welcome, {user.first_name}!</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalJobsCompleted}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
              <Send className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvitationsCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">New opportunities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHoursApproval}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting shop review</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available-jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available-jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Active Jobs</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          <TabsContent value="available-jobs">
            <Card>
              <CardHeader>
                <CardTitle>Available Job Postings</CardTitle>
                <CardDescription>Browse jobs posted by shops looking for apprentices.</CardDescription>
              </CardHeader>
              <CardContent>
                {availableJobs.length === 0 ? (
                  <p>No available jobs at the moment.</p>
                ) : (
                  <div className="grid gap-4">
                    {availableJobs.map((job) => (
                      <Card key={job.id} className="p-4">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {job.pay_rate} &bull; {job.expected_duration} &bull; Starts:{" "}
                          {format(new Date(job.start_date), "PPP")}
                        </p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{job.description}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          **Required Skills:** {job.required_skills?.join(", ") || "N/A"}
                        </p>
                        <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                          View Details
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="my-jobs">
            <Card>
              <CardHeader>
                <CardTitle>My Active Jobs</CardTitle>
                <CardDescription>Jobs you are currently working on or have completed.</CardDescription>
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
                              Shop: {job.shop_name} &bull; Status: {job.status}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Start Date: {format(new Date(job.start_date), "PPP")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {job.can_submit_hours && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedActiveJob(job)}>
                                    Submit Hours
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Submit Hours for "{job.title}"</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Enter the date and hours worked for this job.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <form onSubmit={handleSubmitTime} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="date">Date</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !newTimeEntry.date && "text-muted-foreground",
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newTimeEntry.date ? (
                                              format(new Date(newTimeEntry.date), "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={newTimeEntry.date ? new Date(newTimeEntry.date) : undefined}
                                            onSelect={handleTimeEntryDateChange}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="hours">Hours Worked</Label>
                                      <Input
                                        id="hours"
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        max="12"
                                        value={newTimeEntry.hours || ""}
                                        onChange={handleTimeEntryChange}
                                        required
                                      />
                                    </div>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setSelectedActiveJob(null)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction type="submit" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </form>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            {job.status === "completed" && (
                              <Button variant="secondary" size="sm" onClick={() => handleReviewJob(job)}>
                                Review Shop
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
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Job Invitations</CardTitle>
                <CardDescription>Review invitations from shops.</CardDescription>
              </CardHeader>
              <CardContent>
                {invitations.length === 0 ? (
                  <p>You have no pending invitations.</p>
                ) : (
                  <div className="grid gap-4">
                    {invitations.map((invite) => (
                      <Card key={invite.id} className="p-4">
                        <h3 className="text-lg font-semibold">{invite.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          From: {invite.shop_name} &bull; Pay: {invite.pay_rate} &bull; Status: {invite.status}
                        </p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{invite.description}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          **Required Skills:** {invite.required_skills?.join(", ") || "N/A"}
                        </p>
                        {invite.status === "pending" && (
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" onClick={() => handleAcceptInvitation(invite)} disabled={loading}>
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeclineInvitation(invite.id)}
                              disabled={loading}
                            >
                              <XCircle className="h-4 w-4 mr-2" /> Decline
                            </Button>
                          </div>
                        )}
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
