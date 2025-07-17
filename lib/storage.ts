import type { User, JobPosting, ActiveJob, JobInvitation, Review, TimeEntry } from "./types"

const API_BASE_URL = "/api"

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }
  return response.json()
}

// --- Authentication ---
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await handleResponse<{ user: User }>(response)
    return data.user
  } catch (error) {
    console.error("Authentication failed:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/session`)
    if (response.status === 401) {
      return null // Not authenticated
    }
    const data = await handleResponse<{ user: User }>(response)
    return data.user
  } catch (error) {
    console.error("Failed to get current user:", error)
    return null
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" })
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

// --- User Management ---
export async function saveUser(user: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
  return handleResponse<User>(response)
}

export async function getUser(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`)
  return handleResponse<User>(response)
}

export async function getUsers(type?: "shop" | "apprentice"): Promise<User[]> {
  const url = type ? `${API_BASE_URL}/users?type=${type}` : `${API_BASE_URL}/users`
  const response = await fetch(url)
  return handleResponse<User[]>(response)
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  return handleResponse<User>(response)
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// --- Job Posting Management ---
export async function createJobPosting(job: Partial<JobPosting>): Promise<JobPosting> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  })
  return handleResponse<JobPosting>(response)
}

export async function getJobPosting(id: string): Promise<JobPosting> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`)
  return handleResponse<JobPosting>(response)
}

export async function getJobPostings(shopId?: string, status?: string): Promise<JobPosting[]> {
  let url = `${API_BASE_URL}/jobs`
  const params = new URLSearchParams()
  if (shopId) params.append("shopId", shopId)
  if (status) params.append("status", status)
  if (params.toString()) url += `?${params.toString()}`

  const response = await fetch(url)
  return handleResponse<JobPosting[]>(response)
}

export async function updateJobPosting(id: string, updates: Partial<JobPosting>): Promise<JobPosting> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  return handleResponse<JobPosting>(response)
}

export async function deleteJobPosting(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// --- Active Job Management ---
export async function createActiveJob(job: Partial<ActiveJob>): Promise<ActiveJob> {
  const response = await fetch(`${API_BASE_URL}/active-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  })
  return handleResponse<ActiveJob>(response)
}

export async function getActiveJob(id: string): Promise<ActiveJob> {
  const response = await fetch(`${API_BASE_URL}/active-jobs/${id}`)
  return handleResponse<ActiveJob>(response)
}

export async function getActiveJobs(filters?: { shopId?: string; apprenticeId?: string; status?: string }): Promise<
  ActiveJob[]
> {
  let url = `${API_BASE_URL}/active-jobs`
  const params = new URLSearchParams()
  if (filters?.shopId) params.append("shopId", filters.shopId)
  if (filters?.apprenticeId) params.append("apprenticeId", filters.apprenticeId)
  if (filters?.status) params.append("status", filters.status)
  if (params.toString()) url += `?${params.toString()}`

  const response = await fetch(url)
  return handleResponse<ActiveJob[]>(response)
}

export async function updateActiveJob(id: string, updates: Partial<ActiveJob>): Promise<ActiveJob> {
  const response = await fetch(`${API_BASE_URL}/active-jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  return handleResponse<ActiveJob>(response)
}

export async function deleteActiveJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/active-jobs/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// --- Job Invitation Management ---
export async function createJobInvitation(invitation: Partial<JobInvitation>): Promise<JobInvitation> {
  const response = await fetch(`${API_BASE_URL}/invitations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invitation),
  })
  return handleResponse<JobInvitation>(response)
}

export async function getJobInvitation(id: string): Promise<JobInvitation> {
  const response = await fetch(`${API_BASE_URL}/invitations/${id}`)
  return handleResponse<JobInvitation>(response)
}

export async function getJobInvitations(filters?: { shopId?: string; apprenticeId?: string; status?: string }): Promise<
  JobInvitation[]
> {
  let url = `${API_BASE_URL}/invitations`
  const params = new URLSearchParams()
  if (filters?.shopId) params.append("shopId", filters.shopId)
  if (filters?.apprenticeId) params.append("apprenticeId", filters.apprenticeId)
  if (filters?.status) params.append("status", filters.status)
  if (params.toString()) url += `?${params.toString()}`

  const response = await fetch(url)
  return handleResponse<JobInvitation[]>(response)
}

export async function updateJobInvitation(id: string, updates: Partial<JobInvitation>): Promise<JobInvitation> {
  const response = await fetch(`${API_BASE_URL}/invitations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  return handleResponse<JobInvitation>(response)
}

export async function deleteJobInvitation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/invitations/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// --- Review Management ---
export async function createReview(review: Partial<Review>): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  })
  return handleResponse<Review>(response)
}

export async function getReviews(filters?: { reviewerId?: string; revieweeId?: string; jobId?: string }): Promise<
  Review[]
> {
  let url = `${API_BASE_URL}/reviews`
  const params = new URLSearchParams()
  if (filters?.reviewerId) params.append("reviewerId", filters.reviewerId)
  if (filters?.revieweeId) params.append("revieweeId", filters.revieweeId)
  if (filters?.jobId) params.append("jobId", filters.jobId)
  if (params.toString()) url += `?${params.toString()}`

  const response = await fetch(url)
  return handleResponse<Review[]>(response)
}

// --- Time Entry Management ---
export async function createTimeEntry(timeEntry: Partial<TimeEntry>): Promise<TimeEntry> {
  const response = await fetch(`${API_BASE_URL}/time-entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timeEntry),
  })
  return handleResponse<TimeEntry>(response)
}

export async function getTimeEntries(filters?: { jobId?: string; apprenticeId?: string; approved?: boolean }): Promise<
  TimeEntry[]
> {
  let url = `${API_BASE_URL}/time-entries`
  const params = new URLSearchParams()
  if (filters?.jobId) params.append("jobId", filters.jobId)
  if (filters?.apprenticeId) params.append("apprenticeId", filters.apprenticeId)
  if (typeof filters?.approved === "boolean") params.append("approved", String(filters.approved))
  if (params.toString()) url += `?${params.toString()}`

  const response = await fetch(url)
  return handleResponse<TimeEntry[]>(response)
}

export async function updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
  const response = await fetch(`${API_BASE_URL}/time-entries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  return handleResponse<TimeEntry>(response)
}

export async function deleteTimeEntry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/time-entries/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}
