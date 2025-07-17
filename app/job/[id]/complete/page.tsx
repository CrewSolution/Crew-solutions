"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  getActiveJobById,
  updateActiveJob,
  createTimeEntry,
  getTimeEntries,
  type User,
  type ActiveJob,
  type TimeEntry,
} from "@/lib/storage"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function JobCompletePage({ params }: { params: { id: string } }) {
  const { id: jobId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [job, setJob] = useState<ActiveJob | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [hoursToday, setHoursToday] = useState<number>(0)
  const [isSubmittingHours, setIsSubmittingHours] = useState(false)
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
      if (fetchedJob.apprenticeId !== userId && fetchedJob.shopId !== userId) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this job.",
          variant: "destructive",
        })
        router.push(currentUser?.type === "shop" ? "/dashboard/shop" : "/dashboard/apprentice")
        return
      }
      setJob(fetchedJob)

      const entries = await getTimeEntries(currentJobId)
      setTimeEntries(entries)
    } catch (error: any) {
      toast({
        title: "Error loading job",
        description: error.message || "Failed to fetch job details.",
        variant: "destructive",
      })
      router.push(currentUser?.type === "shop" ? "/dashboard/shop" : "/dashboard/apprentice")
    } finally {
      setIsLoading(false)
    }
  }

  const handleHoursSubmit = async () => {
    if (!currentUser || !job || hoursToday <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid hours.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingHours(true)
    try {
      const newEntry: Omit<TimeEntry, "id" | "submittedAt" | "approvedAt"> = {
        jobId: job.id,
        apprenticeId: currentUser.id,
        date: format(new Date(), "yyyy-MM-dd"),
        hours: hoursToday,
        approved: false,
      }
      await createTimeEntry(newEntry)

      // Update job's pending hours
      const updatedPendingHours = (job.pendingHours || 0) + hoursToday
      const updatedTotalHours = (job.totalHours || 0) + hoursToday
      await updateActiveJob(job.id, {
        pendingHours: updatedPendingHours,
        totalHours: updatedTotalHours,
      })

      toast({ title: "Hours submitted successfully!" })
      setHoursToday(0)
      fetchJobData(currentUser.id, jobId) // Re-fetch to update UI
    } catch (error: any) {
      toast({
        title: "Error submitting hours",
        description: error.message || "Failed to submit hours.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingHours(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!currentUser || !job) return

    try {
      await updateActiveJob(job.id, { status: "completed", endDate: new Date().toISOString().split("T")[0] })
      toast({ title: "Job marked as complete!", description: "You can now review the shop/apprentice." })
      router.push(`/job/${job.id}/review`)
    } catch (error: any) {
      toast({
        title: "Error marking job complete",
        description: error.message || "Failed to mark job as complete.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading job details...</p>
      </div>
    )
  }

  if (!job || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Job not found or access denied.</p>
      </div>
    )
  }

  const isApprentice = currentUser.type === "apprentice"
  const progress = (job.daysWorked / job.totalDays) * 100 || 0

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold">Crew Solutions</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={() => router.back()}>
            Back to Dashboard
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {isApprentice ? `Shop: ${job.shopName}` : `Apprentice: ${job.apprenticeName}`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Job Progress</h3>
                <Progress value={progress} className="w-full mt-2" />
                <p className="text-sm text-gray-500 mt-1">
                  {job.daysWorked} of {job.totalDays} days completed ({progress.toFixed(0)}%)
                </p>
                <p className="text-sm text-gray-500">Total Hours Logged: {job.totalHours}</p>
                <p className="text-sm text-gray-500">Pending Hours: {job.pendingHours}</p>
              </div>

              {isApprentice && job.canSubmitHours && (
                <div className="space-y-2">
                  <Label htmlFor="hoursToday">Log Hours for Today</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hoursToday"
                      type="number"
                      value={hoursToday}
                      onChange={(e) => setHoursToday(Number.parseFloat(e.target.value))}
                      min="0"
                      max="12"
                      step="0.5"
                      placeholder="e.g., 8"
                    />
                    <Button onClick={handleHoursSubmit} disabled={isSubmittingHours || hoursToday <= 0}>
                      {isSubmittingHours ? "Submitting..." : "Submit Hours"}
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Time Entries</h3>
                {timeEntries.length === 0 ? (
                  <p className="text-gray-500 text-sm">No time entries yet.</p>
                ) : (
                  <div className="space-y-2">
                    {timeEntries.map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center border-b pb-1 text-sm">
                        <span>
                          {format(new Date(entry.date), "MMM dd, yyyy")} - {entry.hours} hours
                        </span>
                        <span className={`font-medium ${entry.approved ? "text-green-600" : "text-yellow-600"}`}>
                          {entry.approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {job.status === "in-progress" && (
                <Button onClick={handleMarkComplete} className="w-full mt-4">
                  Mark Job as Complete
                </Button>
              )}

              {job.status === "completed" && (
                <div className="mt-4 text-center text-lg font-semibold text-green-600">
                  Job is completed! Please proceed to review.
                  <Button onClick={() => router.push(`/job/${job.id}/review`)} className="w-full mt-2">
                    Go to Review
                  </Button>
                </div>
              )}

              {job.status === "reviewed" && (
                <div className="mt-4 text-center text-lg font-semibold text-blue-600">Job has been reviewed.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
