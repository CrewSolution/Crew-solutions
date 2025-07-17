// This file maintains localStorage functionality for demo purposes
// In production, this would be replaced with actual API calls

export interface User {
  id: string
  email: string
  type: "shop" | "apprentice"
  firstName?: string
  lastName?: string
  phone?: string
  city?: string
  state?: string
  zipCode?: string
  profileImage?: string
  rating?: number
  jobsCompleted?: number

  // Shop-specific fields
  businessName?: string
  ownerName?: string
  businessType?: string
  yearsInBusiness?: number
  licenseNumber?: string

  // Apprentice-specific fields
  experienceLevel?: string
  skills?: string[]
  availability?: string
  hourlyRateMin?: number
  hourlyRateMax?: number
  education?: string
  bio?: string
  willingToTravel?: boolean
  hasOwnTools?: boolean
  hasTransportation?: boolean
}

export interface JobPosting {
  id: string
  shopId: string
  title: string
  description: string
  apprenticesNeeded: number
  expectedDuration?: string
  daysNeeded: number
  startDate: string
  hoursPerDay: number
  workDays: string[]
  payRate: string
  requirements?: string[]
  requiredSkills?: string[]
  priority: "high" | "medium" | "low"
  status: "active" | "filled" | "cancelled"
  applicants: number
  postedDate: string
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
  requirements?: string[]
  requiredSkills?: string[]
  status: "pending" | "accepted" | "declined"
}

export interface ActiveJob {
  id: string
  jobPostingId?: string
  shopId: string
  apprenticeId: string
  title: string
  shopName: string
  apprenticeName: string
  startDate: string
  totalDays: number
  hoursPerDay: number
  payRate: string
  status: "in-progress" | "completed" | "reviewed"
  daysWorked: number
  totalHours: number
  pendingHours: number
  canComplete: boolean
  canSubmitHours: boolean
}

export interface Review {
  id: string
  jobId: string
  reviewerId: string
  revieweeId: string
  reviewerType: "shop" | "apprentice"
  rating: number
  comment: string
  jobTitle: string
  date: string
}

// Storage keys
const USERS_KEY = "crew_solutions_users"
const CURRENT_USER_KEY = "crew_solutions_current_user"
const JOB_POSTINGS_KEY = "crew_solutions_job_postings"
const JOB_INVITATIONS_KEY = "crew_solutions_job_invitations"
const ACTIVE_JOBS_KEY = "crew_solutions_active_jobs"
const REVIEWS_KEY = "crew_solutions_reviews"

// Helper functions
const getFromStorage = <T>(key: string): T[] => {\
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

const saveToStorage = <T>(key: string, data: T[]): void => {\
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

const generateId = (): string => {\
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// User management\
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {\
  const users = getFromStorage<User>(USERS_KEY)
  
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {\
    throw new Error("Email already exists")
  }
  
  const newUser: User = {
    ...userData,\
    id: generateId(),
    rating: 0,
    jobsCompleted: 0,
  }
  
  users.push(newUser)
  saveToStorage(USERS_KEY, users)
  
  return newUser
}
\
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {\
  const users = getFromStorage<User>(USERS_KEY)
  const user = users.find(u => u.email === email)
  
  // In a real app, you'd verify the password hash
  // For demo purposes, we'll accept any password for existing users
  if (user) {\
    return user
  }
  
  throw new Error("Invalid email or password")
}

export const getCurrentUser = (): User | null => {\
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem(CURRENT_USER_KEY)
  return userData ? JSON.parse(userData) : null
}

export const setCurrentUser = (user: User | null): void => {\
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export const getUsers = (type?: "shop" | "apprentice"): User[] => {\
  const users = getFromStorage<User>(USERS_KEY)
  return type ? users.filter(user => user.type === type) : users
}

// Job posting management\
export const createJobPosting = async (jobData: Omit<JobPosting, "id">): Promise<JobPosting> => {\
  const jobs = getFromStorage<JobPosting>(JOB_POSTINGS_KEY)
  
  const newJob: JobPosting = {
    ...jobData,\
    id: generateId(),
  }
  
  jobs.push(newJob)
  saveToStorage(JOB_POSTINGS_KEY, jobs)
  
  return newJob
}
\
export const getJobPostings = async (shopId?: string): Promise<JobPosting[]> => {\
  const jobs = getFromStorage<JobPosting>(JOB_POSTINGS_KEY)
  return shopId ? jobs.filter(job => job.shopId === shopId) : jobs
}

// Job invitation management\
export const createJobInvitation = async (invitationData: Omit<JobInvitation, "id">): Promise<JobInvitation> => {\
  const invitations = getFromStorage<JobInvitation>(JOB_INVITATIONS_KEY)
  
  const newInvitation: JobInvitation = {
    ...invitationData,\
    id: generateId(),
  }
  
  invitations.push(newInvitation)
  saveToStorage(JOB_INVITATIONS_KEY, invitations)
  
  return newInvitation
}
\
export const getJobInvitations = async (apprenticeId: string, status?: string): Promise<JobInvitation[]> => {\
  const invitations = getFromStorage<JobInvitation>(JOB_INVITATIONS_KEY)
  let filtered = invitations.filter(inv => inv.apprenticeId === apprenticeId)
  
  if (status) {
    filtered = filtered.filter(inv => inv.status === status)
  }
  
  return filtered
}

export const updateJobInvitationStatus = async (invitationId: string, status: "accepted" | "declined"): Promise<void> => {\
  const invitations = getFromStorage<JobInvitation>(JOB_INVITATIONS_KEY)
  const index = invitations.findIndex(inv => inv.id === invitationId)
  
  if (index !== -1) {
    invitations[index].status = status\
    saveToStorage(JOB_INVITATIONS_KEY, invitations)
  }
}

// Active job management\
export const createActiveJob = async (jobData: Omit<ActiveJob, "id">): Promise<ActiveJob> => {\
  const activeJobs = getFromStorage<ActiveJob>(ACTIVE_JOBS_KEY)
  
  const newActiveJob: ActiveJob = {
    ...jobData,\
    id: generateId(),
  }
  
  activeJobs.push(newActiveJob)
  saveToStorage(ACTIVE_JOBS_KEY, activeJobs)
  
  return newActiveJob
}

export const getActiveJobs = async (userId: string, userType: "shop" | "apprentice\", status?: string): Promise<ActiveJob[]> => {\
  const activeJobs = getFromStorage<ActiveJob>(ACTIVE_JOBS_KEY)
  let filtered = activeJobs.filter(job => 
    userType === "shop" ? job.shopId === userId : job.apprenticeId === userId
  )
  
  if (status) {
    filtered = filtered.filter(job => job.status === status)
  }
  
  return filtered
}

export const updateActiveJob = async (jobId: string, updates: Partial<ActiveJob>): Promise<void> => {
  const activeJobs = getFromStorage<ActiveJob>(ACTIVE_JOBS_KEY)
  const index = activeJobs.findIndex(job => job.id === jobId)
  
  if (index !== -1) {
    activeJobs[index] = { ...activeJobs[index], ...updates }
    saveToStorage(ACTIVE_JOBS_KEY, activeJobs)
  }
}

// Review management
export const createReview = async (reviewData: Omit<Review, "id" | "date">): Promise<Review> => {
  const reviews = getFromStorage<Review>(REVIEWS_KEY)
  
  const newReview: Review = {
    ...reviewData,
    id: generateId(),
    date: new Date().toISOString(),
  }
  
  reviews.push(newReview)
  saveToStorage(REVIEWS_KEY, reviews)
  
  return newReview
}

// Initialize sample data
export const initializeSampleData = (): void => {
  if (typeof window === "undefined") return
  
  // Only initialize if no users exist
  const existingUsers = getFromStorage<User>(USERS_KEY)
  if (existingUsers.length > 0) return
  
  const sampleUsers: User[] = [
    {
      id: "shop-1",
      email: "shop@example.com",
      type: "shop",
      businessName: "Elite Electrical Services",
      ownerName: "John Smith",
      firstName: "John",
      lastName: "Smith",
      phone: "(555) 123-4567",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      businessType: "Electrical Contractor",
      yearsInBusiness: 15,
      licenseNumber: "C-10 #123456",
      rating: 4.8,
      jobsCompleted: 127,
    },
    {
      id: "apprentice-1",
      email: "apprentice@example.com",
      type: "apprentice",
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "(555) 987-6543",
      city: "Oakland",
      state: "CA",
      zipCode: "94601",
      experienceLevel: "Intermediate",
      skills: ["Wiring Installation", "Circuit Analysis", "Blueprint Reading", "Safety Protocols"],
      availability: "Full-time",
      hourlyRateMin: 22,
      hourlyRateMax: 28,
      education: "Community College Electrical Program",
      bio: "Dedicated electrical apprentice with 2 years of hands-on experience in residential and commercial projects.",
      rating: 4.6,
      jobsCompleted: 23,
      willingToTravel: true,
      hasOwnTools: true,
      hasTransportation: true,
    },
  ]
  
  saveToStorage(USERS_KEY, sampleUsers)
}
