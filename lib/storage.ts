import type { User, JobPosting, JobInvitation, ActiveJob, Review, TimeEntry } from "./db"

// Helper function to get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }
  const userJson = localStorage.getItem("currentUser")
  if (userJson) {
    try {
      return JSON.parse(userJson) as User
    } catch (e) {
      console.error("Failed to parse user from localStorage", e)
      return null
    }
  }
  return null
}

// Helper function to set current user in localStorage
export function setCurrentUser(user: User | null) {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }
}

// --- User Operations ---
export async function getUserById(id: string): Promise<User | null> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }
  const data = await response.json()
  return data.user
}

export async function createUser(
  userData: Omit<User, "id" | "password_hash" | "created_at" | "updated_at" | "rating" | "jobs_completed"> & {
    password: string
  },
): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create user")
  }
  const data = await response.json()
  return data.user
}

// --- Job Posting Operations ---
export async function getJobPostings(shopId?: string): Promise<JobPosting[]> {
  const url = shopId ? `/api/jobs?shopId=${shopId}` : "/api/jobs"
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch job postings")
  }
  const data = await response.json()
  return data.jobPostings.map((job: any) => ({
    ...job,
    posted_date: new Date(job.posted_date),
    created_at: new Date(job.created_at),
    updated_at: new Date(job.updated_at),
  }))
}

export async function createJobPosting(
  jobData: Omit<JobPosting, "id" | "posted_date" | "created_at" | "updated_at">,
): Promise<JobPosting> {
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create job posting")
  }
  const data = await response.json()
  return data.jobPosting
}

// --- Job Invitation Operations ---
export async function getJobInvitations(
  apprenticeId: string,
  status?: "pending" | "accepted" | "declined",
): Promise<JobInvitation[]> {
  const url = status
    ? `/api/invitations?apprenticeId=${apprenticeId}&status=${status}`
    : `/api/invitations?apprenticeId=${apprenticeId}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch job invitations")
  }
  const data = await response.json()
  return data.jobInvitations.map((invitation: any) => ({
    ...invitation,
    created_at: new Date(invitation.created_at),
    updated_at: new Date(invitation.updated_at),
  }))
}

export async function updateJobInvitationStatus(id: string, status: "accepted" | "declined"): Promise<JobInvitation> {
  const response = await fetch(`/api/invitations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update invitation status")
  }
  const data = await response.json()
  return data.jobInvitation
}

// --- Active Job Operations ---
export async function getActiveJobs(
  userId: string,
  userType: "shop" | "apprentice",
  status?: "in-progress" | "completed" | "reviewed",
): Promise<ActiveJob[]> {
  const url = `/api/active-jobs?${userType === "shop" ? `shopId=${userId}` : `apprenticeId=${userId}`}${status ? `&status=${status}` : ""}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch active jobs")
  }
  const data = await response.json()
  return data.activeJobs.map((job: any) => ({
    ...job,
    created_at: new Date(job.created_at),
    updated_at: new Date(job.updated_at),
  }))
}

export async function createActiveJob(
  jobData: Omit<ActiveJob, "id" | "created_at" | "updated_at">,
): Promise<ActiveJob> {
  const response = await fetch("/api/active-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create active job")
  }
  const data = await response.json()
  return data.activeJob
}

export async function updateActiveJob(
  id: string,
  updateData: Partial<Omit<ActiveJob, "id" | "created_at" | "updated_at">>,
): Promise<ActiveJob> {
  const response = await fetch(`/api/active-jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update active job")
  }
  const data = await response.json()
  return data.activeJob
}

// --- Review Operations ---
export async function createReview(reviewData: Omit<Review, "id" | "date" | "created_at">): Promise<Review> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create review")
  }
  const data = await response.json()
  return data.review
}

// --- Time Entry Operations ---
export async function createTimeEntry(
  timeEntryData: Omit<TimeEntry, "id" | "created_at" | "updated_at">,
): Promise<TimeEntry> {
  const response = await fetch("/api/time-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(timeEntryData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create time entry")
  }
  const data = await response.json()
  return data.timeEntry
}

export async function getTimeEntries(jobId: string): Promise<TimeEntry[]> {
  const response = await fetch(`/api/time-entries?jobId=${jobId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch time entries")
  }
  const data = await response.json()
  return data.timeEntries.map((entry: any) => ({
    ...entry,
    created_at: new Date(entry.created_at),
    updated_at: new Date(entry.updated_at),
  }))
}

export async function updateTimeEntry(
  id: string,
  updateData: Partial<Omit<TimeEntry, "id" | "created_at" | "updated_at">>,
): Promise<TimeEntry> {
  const response = await fetch(`/api/time-entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update time entry")
  }
  const data = await response.json()
  return data.timeEntry
}
