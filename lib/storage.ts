// Local storage utilities for managing user data
export interface User {
  id: string
  type: "shop" | "apprentice"
  email: string
  password: string
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
  hoursCompleted?: string
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
  timeEntries: TimeEntry[]
}

export interface TimeEntry {
  id: string
  jobId: string
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

// Storage keys
const STORAGE_KEYS = {
  USERS: "crew_solutions_users",
  JOB_POSTINGS: "crew_solutions_job_postings",
  ACTIVE_JOBS: "crew_solutions_active_jobs",
  JOB_INVITATIONS: "crew_solutions_job_invitations",
  REVIEWS: "crew_solutions_reviews",
  TIME_ENTRIES: "crew_solutions_time_entries",
  CURRENT_USER: "currentUser",
}

// Generic storage functions
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error)
  }
}

// User management
export function getUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
}

export function saveUser(user: User): void {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  saveToStorage(STORAGE_KEYS.USERS, users)
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

export function authenticateUser(email: string, password: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email && u.password === password) || null
}

// Job postings
export function getJobPostings(): JobPosting[] {
  return getFromStorage<JobPosting[]>(STORAGE_KEYS.JOB_POSTINGS, [])
}

export function saveJobPosting(job: JobPosting): void {
  const jobs = getJobPostings()
  const existingIndex = jobs.findIndex((j) => j.id === job.id)

  if (existingIndex >= 0) {
    jobs[existingIndex] = job
  } else {
    jobs.push(job)
  }

  saveToStorage(STORAGE_KEYS.JOB_POSTINGS, jobs)
}

export function getJobPostingsByShop(shopId: string): JobPosting[] {
  const jobs = getJobPostings()
  return jobs.filter((j) => j.shopId === shopId)
}

// Active jobs
export function getActiveJobs(): ActiveJob[] {
  return getFromStorage<ActiveJob[]>(STORAGE_KEYS.ACTIVE_JOBS, [])
}

export function saveActiveJob(job: ActiveJob): void {
  const jobs = getActiveJobs()
  const existingIndex = jobs.findIndex((j) => j.id === job.id)

  if (existingIndex >= 0) {
    jobs[existingIndex] = job
  } else {
    jobs.push(job)
  }

  saveToStorage(STORAGE_KEYS.ACTIVE_JOBS, jobs)
}

export function getActiveJobsByUser(userId: string, userType: "shop" | "apprentice"): ActiveJob[] {
  const jobs = getActiveJobs()
  return jobs.filter((j) => (userType === "shop" ? j.shopId === userId : j.apprenticeId === userId))
}

// Job invitations
export function getJobInvitations(): JobInvitation[] {
  return getFromStorage<JobInvitation[]>(STORAGE_KEYS.JOB_INVITATIONS, [])
}

export function saveJobInvitation(invitation: JobInvitation): void {
  const invitations = getJobInvitations()
  const existingIndex = invitations.findIndex((i) => i.id === invitation.id)

  if (existingIndex >= 0) {
    invitations[existingIndex] = invitation
  } else {
    invitations.push(invitation)
  }

  saveToStorage(STORAGE_KEYS.JOB_INVITATIONS, invitations)
}

export function getJobInvitationsByApprentice(apprenticeId: string): JobInvitation[] {
  const invitations = getJobInvitations()
  return invitations.filter((i) => i.apprenticeId === apprenticeId && i.status === "pending")
}

// Reviews
export function getReviews(): Review[] {
  return getFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, [])
}

export function saveReview(review: Review): void {
  const reviews = getReviews()
  reviews.push(review)
  saveToStorage(STORAGE_KEYS.REVIEWS, reviews)
}

export function getReviewsByUser(userId: string, asReviewee = true): Review[] {
  const reviews = getReviews()
  return reviews.filter((r) => (asReviewee ? r.revieweeId === userId : r.reviewerId === userId))
}

// Time entries
export function getTimeEntries(): TimeEntry[] {
  return getFromStorage<TimeEntry[]>(STORAGE_KEYS.TIME_ENTRIES, [])
}

export function saveTimeEntry(entry: TimeEntry): void {
  const entries = getTimeEntries()
  entries.push(entry)
  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, entries)
}

export function getTimeEntriesByJob(jobId: string): TimeEntry[] {
  const entries = getTimeEntries()
  return entries.filter((e) => e.jobId === jobId)
}

// Current user
export function getCurrentUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export function setCurrentUser(user: User | null): void {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user)
}

// Initialize with sample data if empty
export function initializeSampleData(): void {
  const users = getUsers()
  if (users.length === 0) {
    // Add sample users
    const sampleUsers: User[] = [
      {
        id: "shop-1",
        type: "shop",
        email: "shop@example.com",
        password: "password123",
        businessName: "Bay Area Electric Co.",
        ownerName: "John Smith",
        phone: "(415) 555-0123",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        licenseNumber: "C10-123456",
        rating: 4.8,
        jobsCompleted: 25,
        createdAt: new Date().toISOString(),
        profileComplete: true,
      },
      {
        id: "apprentice-1",
        type: "apprentice",
        email: "apprentice@example.com",
        password: "password123",
        firstName: "Marcus",
        lastName: "Chen",
        phone: "(415) 555-0124",
        address: "456 Oak Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        experienceLevel: "basic-experience",
        availability: "full-time",
        skills: ["Wiring Installation", "Safety Protocols", "Hand Tools"],
        rating: 4.6,
        jobsCompleted: 8,
        hoursCompleted: "1200",
        createdAt: new Date().toISOString(),
        profileComplete: true,
      },
    ]

    sampleUsers.forEach(saveUser)
  }
}
