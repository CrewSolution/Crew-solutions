// This file now acts as a client-side data service that interacts with API routes.

export interface User {
  id: string
  type: "shop" | "apprentice"
  email: string
  password?: string // Password is not returned from API
  firstName?: string
  lastName?: string
  businessName?: string
  ownerName?: string
  phone: string
  address?: string
  city: string
  state: string
  zipCode?: string
  businessType?: string
  licenseNumber?: string
  dateOfBirth?: string
  experienceLevel?: string
  education?: string
  schoolName?: string
  major?: string
  hoursCompleted?: string | number
  availability?: string
  transportation?: boolean
  willingToTravel?: boolean
  skills?: string[]
  rating?: number
  jobsCompleted?: number
  goals?: string
  bio?: string
  profileImage?: string
  bankAccount?: string
  routingNumber?: string
  createdAt: string
  profileComplete: boolean
}

export interface JobPosting {
  id: string
  shopId: string
  title: string
  description: string
  apprenticesNeeded: number
  expectedDuration: string
  daysNeeded: number
  startDate: string
  hoursPerDay: number
  workDays: string[]
  payRate: string
  requirements: string[]
  requiredSkills: string[]
  priority: "high" | "medium" | "low"
  status: "active" | "filled" | "paused"
  applicants: number
  postedDate: string
  totalCost?: number
  weeklyPayment?: number
}

export interface ActiveJob {
  id: string
  jobPostingId: string
  shopId: string
  apprenticeId: string
  title: string
  shopName: string
  apprenticeName: string
  startDate: string
  endDate?: string
  daysWorked: number
  totalDays: number
  hoursPerDay: number
  payRate: string
  status: "in-progress" | "completed" | "reviewed"
  totalHours: number
  pendingHours: number
  canComplete: boolean
  canSubmitHours: boolean
  timeEntries?: TimeEntry[] // Not directly stored in DB, but can be fetched
}

export interface TimeEntry {
  id: string
  jobId: string
  apprenticeId: string
  date: string
  hours: number
  approved: boolean
  submittedAt: string
  approvedAt?: string
}

export interface JobInvitation {
  id: string
  jobPostingId: string
  shopId: string
  apprenticeId: string
  shopName: string
  title: string
  description: string
  payRate: string
  daysNeeded: number
  startDate: string
  hoursPerDay: number
  workDays: string[]
  requirements: string[]
  requiredSkills: string[]
  location: string
  priority: "high" | "medium" | "low"
  totalPay: number
  weeklyPay?: number
  status: "pending" | "accepted" | "declined"
  sentAt: string
}

export interface Review {
  id: string
  jobId: string
  reviewerId: string
  revieweeId: string
  reviewerType: "shop" | "apprentice"
  rating: number
  comment: string
  ratings?: {
    timeliness?: number
    workEthic?: number
    materialKnowledge?: number
    profileAccuracy?: number
  }
  skillsShown?: string[]
  jobTitle: string
  date: string
}

// --- API Calls ---

const API_BASE_URL = "/api"

async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }
  return response.json()
}

// User management
export async function getUsers(type?: "shop" | "apprentice", email?: string): Promise<User[]> {
  let url = `${API_BASE_URL}/users`
  const params = new URLSearchParams()
  if (type) params.append("type", type)
  if (email) params.append("email", email)
  if (params.toString()) url += `?${params.toString()}`
  return fetchData<User[]>(url)
}

export async function getUserById(id: string): Promise<User> {
  return fetchData<User>(`${API_BASE_URL}/users/${id}`)
}

export async function createUser(
  userData: Omit<User, "id" | "createdAt" | "profileComplete" | "rating" | "jobsCompleted" | "hoursCompleted"> & {
    password: string
  },
): Promise<User> {
  return fetchData<User>(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
}

export async function updateUser(id: string, updateData: Partial<User>): Promise<User> {
  return fetchData<User>(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
}

export async function authenticateUser(email: string, password: string): Promise<User> {
  return fetchData<User>(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
}

// Job postings
export async function getJobPostings(shopId?: string, status?: string): Promise<JobPosting[]> {
  let url = `${API_BASE_URL}/jobs`
  const params = new URLSearchParams()
  if (shopId) params.append("shopId", shopId)
  if (status) params.append("status", status)
  if (params.toString()) url += `?${params.toString()}`
  return fetchData<JobPosting[]>(url)
}

export async function getJobPostingById(id: string): Promise<JobPosting> {
  return fetchData<JobPosting>(`${API_BASE_URL}/jobs/${id}`)
}

export async function createJobPosting(
  jobData: Omit<JobPosting, "id" | "postedDate" | "applicants" | "status"> & { status: "active" | "filled" | "paused" },
): Promise<JobPosting> {
  return fetchData<JobPosting>(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  })
}

export async function updateJobPosting(id: string, updateData: Partial<JobPosting>): Promise<JobPosting> {
  return fetchData<JobPosting>(`${API_BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
}

// Active jobs
export async function getActiveJobs(
  userId?: string,
  userType?: "shop" | "apprentice",
  status?: string,
): Promise<ActiveJob[]> {
  let url = `${API_BASE_URL}/active-jobs`
  const params = new URLSearchParams()
  if (userId) params.append("userId", userId)
  if (userType) params.append("userType", userType)
  if (status) params.append("status", status)
  if (params.toString()) url += `?${params.toString()}`
  return fetchData<ActiveJob[]>(url)
}

export async function getActiveJobById(id: string): Promise<ActiveJob> {
  return fetchData<ActiveJob>(`${API_BASE_URL}/active-jobs/${id}`)
}

export async function createActiveJob(jobData: Omit<ActiveJob, "id" | "timeEntries">): Promise<ActiveJob> {
  return fetchData<ActiveJob>(`${API_BASE_URL}/active-jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  })
}

export async function updateActiveJob(id: string, updateData: Partial<ActiveJob>): Promise<ActiveJob> {
  return fetchData<ActiveJob>(`${API_BASE_URL}/active-jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
}

// Job invitations
export async function getJobInvitations(apprenticeId?: string, status?: string): Promise<JobInvitation[]> {
  let url = `${API_BASE_URL}/invitations`
  const params = new URLSearchParams()
  if (apprenticeId) params.append("apprenticeId", apprenticeId)
  if (status) params.append("status", status)
  if (params.toString()) url += `?${params.toString()}`
  return fetchData<JobInvitation[]>(url)
}

export async function createJobInvitation(
  invitationData: Omit<JobInvitation, "id" | "sentAt">,
): Promise<JobInvitation> {
  return fetchData<JobInvitation>(`${API_BASE_URL}/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invitationData),
  })
}

export async function updateJobInvitationStatus(
  id: string,
  status: "pending" | "accepted" | "declined",
): Promise<JobInvitation> {
  return fetchData<JobInvitation>(`${API_BASE_URL}/invitations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
}

// Reviews
export async function getReviews(revieweeId?: string, reviewerId?: string): Promise<Review[]> {
  let url = `${API_BASE_URL}/reviews`
  const params = new URLSearchParams()
  if (revieweeId) params.append("revieweeId", revieweeId)
  if (reviewerId) params.append("reviewerId", reviewerId)
  if (params.toString()) url += `?${params.toString()}`
  return fetchData<Review[]>(url)
}

export async function createReview(reviewData: Omit<Review, "id" | "date">): Promise<Review> {
  return fetchData<Review>(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  })
}

// Time entries
export async function getTimeEntries(jobId?: string, apprenticeId?: string): Promise<TimeEntry[]> {
  let url = `${API_BASE_URL}/time-entries`
  const params = new URLSearchParams()
  if (jobId) params.append("jobId", jobId)
  if (apprenticeId) params.append("apprenticeId", apprenticeId)
  if (params.toString()) url += `?${params.toString()}`
  return fetchData<TimeEntry[]>(url)
}

export async function createTimeEntry(
  entryData: Omit<TimeEntry, "id" | "submittedAt" | "approvedAt">,
): Promise<TimeEntry> {
  return fetchData<TimeEntry>(`${API_BASE_URL}/time-entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entryData),
  })
}

export async function approveTimeEntry(id: string): Promise<TimeEntry> {
  return fetchData<TimeEntry>(`${API_BASE_URL}/time-entries`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, approved: true }),
  })
}

// Current user (still using localStorage for session management for simplicity in this context)
const CURRENT_USER_STORAGE_KEY = "currentUser"

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from localStorage key ${CURRENT_USER_STORAGE_KEY}:`, error)
    return null
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    }
  } catch (error) {
    console.error(`Error saving to localStorage key ${CURRENT_USER_STORAGE_KEY}:`, error)
  }
}
