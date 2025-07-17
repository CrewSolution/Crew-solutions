"use client"

import { Separator } from "@/components/ui/separator"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getActiveJob, updateActiveJob, getTimeEntries, updateTimeEntry } from "@/lib/storage"
import type { ActiveJob, TimeEntry } from "@/lib/types"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

export default function CompleteJobPage({ params }: { params: { id: string } }) {
  const { id: jobId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<ActiveJob | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const fetchedJob = await getActiveJob(jobId)
        setJob(fetchedJob)
        const fetchedTimeEntries = await getTimeEntries({ jobId: fetchedJob.id })
        setTimeEntries(fetchedTimeEntries)
      } catch (error) {
        console.error("Failed to fetch job data:", error)
        toast({
          title: "Error",
          description: "Failed to load job details.",
          variant: "destructive",
        })
        router.push("/dashboard/shop") // Redirect if job not found or error
      } finally {
        setLoading(false)
      }
    }
    fetchJobData()
  }, [jobId, router, toast])

  const handleApproveHours = async (entryId: string, approved: boolean) => {
    setSubmitting(true)
    try {
      await updateTimeEntry(entryId, { approved })
      toast({
        title: "Hours Updated",
        description: `Time entry ${approved ? "approved" : "unapproved"} successfully.`,
      })
      // Refresh time entries
      const updatedTimeEntries = await getTimeEntries({ jobId: jobId })
      setTimeEntries(updatedTimeEntries)
    } catch (error: any) {
      toast({
        title: "Error Updating Hours",
        description: error.message || "An error occurred while updating hours.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteJob = async () => {
    if (!job) return

    // Check if all time entries are approved
    const allApproved = timeEntries.every((entry) => entry.approved)
    if (!allApproved) {
      toast({
        title: "Cannot Complete Job",
        description: "All time entries must be approved before completing the job.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      await updateActiveJob(job.id, { status: "completed", end_date: new Date().toISOString().split("T")[0] })
      toast({
        title: "Job Completed!",
        description: `Job "${job.title}" has been marked as completed.`,
      })
      router.push("/dashboard/shop")
    } catch (error: any) {
      toast({
        title: "Error Completing Job",
        description: error.message || "An error occurred while completing the job.",
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

  if (!job) {
    return <p className="p-4">Job not found.</p>
  }

  const totalHoursWorked = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const totalPay = totalHoursWorked * Number.parseFloat(job.pay_rate.replace(/[^0-9.]/g, "")) // Simple extraction

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800">
        <h1 className="text-xl font-semibold">Complete Job: {job.title}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Overview of the job and apprentice's progress.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Label>Job Title:</Label>
              <span>{job.title}</span>
              <Label>Apprentice:</Label>
              <span>{job.apprentice_name}</span>
              <Label>Start Date:</Label>
              <span>{format(new Date(job.start_date), "PPP")}</span>
              <Label>Pay Rate:</Label>
              <span>{job.pay_rate}</span>
              <Label>Total Days:</Label>
              <span>{job.total_days}</span>
              <Label>Hours Per Day:</Label>
              <span>{job.hours_per_day}</span>
              <Label>Current Status:</Label>
              <span>{job.status}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 font-bold">
              <Label>Total Hours Logged:</Label>
              <span>{totalHoursWorked}</span>
              <Label>Estimated Total Pay:</Label>
              <span>${totalPay.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>Review and approve hours submitted by the apprentice.</CardDescription>
          </CardHeader>
          <CardContent>
            {timeEntries.length === 0 ? (
              <p>No time entries submitted yet.</p>
            ) : (
              <div className="grid gap-4">
                {timeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">Date: {format(new Date(entry.date), "PPP")}</p>
                      <p className="text-sm text-gray-500">Hours: {entry.hours}</p>
                      <p className="text-sm text-gray-500">Status: {entry.approved ? "Approved" : "Pending"}</p>
                    </div>
                    <div className="flex gap-2">
                      {!entry.approved ? (
                        <Button size="sm" onClick={() => handleApproveHours(entry.id, true)} disabled={submitting}>
                          Approve
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveHours(entry.id, false)}
                          disabled={submitting}
                        >
                          Unapprove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleCompleteJob} disabled={submitting || !timeEntries.every((entry) => entry.approved)}>
          {submitting ? "Completing Job..." : "Mark Job as Completed"}
        </Button>
        {!timeEntries.every((entry) => entry.approved) && (
          <p className="text-sm text-red-500 mt-2">All time entries must be approved to complete the job.</p>
        )}
      </main>
    </div>
  )
}
