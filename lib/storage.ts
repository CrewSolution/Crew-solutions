/**
 * Local-storage demo data layer for Crew Solutions.
 * Replace with real API/database calls when you wire up a backend.
 */

///////////////////////
// Type Definitions //
///////////////////////
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

  /* Shop-specific */
  businessName?: string
  ownerName?: string
  businessType?: string
  yearsInBusiness?: number
  licenseNumber?: string

  /* Apprentice-specific */
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

export interface TimeEntry {
  id: string
  jobId: string
  apprenticeId: string
  date: string
  hours: number
  approved: boolean
}

/////////////////////
// Local-storage 🔑 //
/////////////////////
const USERS_KEY = "crew_solutions_users"
const CURRENT_USER_KEY = "crew_solutions_current_user"
const JOB_POSTINGS_KEY = "crew_solutions_job_postings"
const JOB_INVITATIONS_KEY = "crew_solutions_job_invitations"
const ACTIVE_JOBS_KEY = "crew_solutions_active_jobs"
const REVIEWS_KEY = "crew_solutions_reviews"

const isBrowser = () => typeof window !== "undefined"

function readJSON<T>(key: string): T[] {
  if (!isBrowser()) return []
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T[]) : []
}

function writeJSON<T>(key: string, data: T[]): void {
  if (isBrowser()) localStorage.setItem(key, JSON.stringify(data))
}

function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
}

//////////////////
// Auth helpers //
//////////////////
export async function authenticateUser(email: string, _password: string): Promise<User | null> {
  const users = readJSON<User>(USERS_KEY)
  return users.find((u) => u.email === email) ?? null
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

export function setCurrentUser(user: User | null): void {
  if (!isBrowser()) return
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(CURRENT_USER_KEY)
}

/////////////////////////
// Sample-data seeding //
/////////////////////////
export function initializeSampleData(): void {
  if (!isBrowser()) return
  if (readJSON<User>(USERS_KEY).length) return

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

  writeJSON(USERS_KEY, sampleUsers)
}

////////////////////////////////////
// Minimal stubs for future CRUDs //
////////////////////////////////////
export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const users = readJSON<User>(USERS_KEY)
  if (users.some((u) => u.email === user.email)) throw new Error("Email already exists")

  const newUser: User = { ...user, id: uid(), rating: 0, jobsCompleted: 0 }
  users.push(newUser)
  writeJSON(USERS_KEY, users)
  return newUser
}

// Initialize sample data when module loads
if (isBrowser()) {
  initializeSampleData()
}
