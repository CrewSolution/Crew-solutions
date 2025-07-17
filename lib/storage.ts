import type { User, Job, ActiveJob, Invitation, Review, TimeEntry } from "./types"

// Helper to safely parse JSON from localStorage
function getParsedItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue
  }
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error)
    return defaultValue
  }
}

// Helper to safely set JSON to localStorage
function setStringItem(key: string, value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

// --- User Management ---
const USERS_KEY = "crew_solutions_users"
const CURRENT_USER_KEY = "crew_solutions_current_user"

export function getUsers(): User[] {
  return getParsedItem<User[]>(USERS_KEY, [])
}

export function setUsers(users: User[]): void {
  setStringItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  return getParsedItem<User | null>(CURRENT_USER_KEY, null)
}

export function setCurrentUser(user: User | null): void {
  setStringItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function authenticateUser(email: string, passwordHash: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.passwordHash === passwordHash)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export function registerUser(user: User): boolean {
  const users = getUsers()
  if (users.some((u) => u.email === user.email)) {
    return false // User with this email already exists
  }
  setUsers([...users, user])
  return true
}

export function logoutUser(): void {
  setCurrentUser(null)
}

// --- Job Management ---
const JOBS_KEY = "crew_solutions_jobs"

export function getJobs(): Job[] {
  return getParsedItem<Job[]>(JOBS_KEY, [])
}

export function setJobs(jobs: Job[]): void {
  setStringItem(JOBS_KEY, JSON.stringify(jobs))
}

// --- Active Job Management ---
const ACTIVE_JOBS_KEY = "crew_solutions_active_jobs"

export function getActiveJobs(): ActiveJob[] {
  return getParsedItem<ActiveJob[]>(ACTIVE_JOBS_KEY, [])
}

export function setActiveJobs(activeJobs: ActiveJob[]): void {
  setStringItem(ACTIVE_JOBS_KEY, JSON.stringify(activeJobs))
}

// --- Invitation Management ---
const INVITATIONS_KEY = "crew_solutions_invitations"

export function getInvitations(): Invitation[] {
  return getParsedItem<Invitation[]>(INVITATIONS_KEY, [])
}

export function setInvitations(invitations: Invitation[]): void {
  setStringItem(INVITATIONS_KEY, JSON.stringify(invitations))
}

// --- Review Management ---
const REVIEWS_KEY = "crew_solutions_reviews"

export function getReviews(): Review[] {
  return getParsedItem<Review[]>(REVIEWS_KEY, [])
}

export function setReviews(reviews: Review[]): void {
  setStringItem(REVIEWS_KEY, JSON.stringify(reviews))
}

// --- Time Entry Management ---
const TIME_ENTRIES_KEY = "crew_solutions_time_entries"

export function getTimeEntries(): TimeEntry[] {
  return getParsedItem<TimeEntry[]>(TIME_ENTRIES_KEY, [])
}

export function setTimeEntries(timeEntries: TimeEntry[]): void {
  setStringItem(TIME_ENTRIES_KEY, JSON.stringify(timeEntries))
}

// --- Sample Data Initialization ---
export function initializeSampleData() {
  if (getUsers().length === 0) {
    const sampleUsers: User[] = [
      {
        id: "shop-1",
        email: "shop@example.com",
        passwordHash: "password", // In a real app, hash this!
        type: "shop",
        name: "Electric Co.",
        contactEmail: "contact@electricco.com",
        phone: "555-123-4567",
        address: "123 Main St, Anytown, USA",
        description: "A leading electrical contracting company.",
        profileImage: "/placeholder.svg",
      },
      {
        id: "apprentice-1",
        email: "apprentice@example.com",
        passwordHash: "password", // In a real app, hash this!
        type: "apprentice",
        firstName: "Alice",
        lastName: "Smith",
        skills: ["Wiring", "Troubleshooting"],
        experienceLevel: "Intermediate",
        availability: "Full-time",
        city: "Anytown",
        state: "USA",
        bio: "Dedicated electrical apprentice with 2 years of experience.",
        profileImage: "/placeholder.svg",
      },
      {
        id: "apprentice-2",
        email: "apprentice2@example.com",
        passwordHash: "password", // In a real app, hash this!
        type: "apprentice",
        firstName: "Bob",
        lastName: "Johnson",
        skills: ["Conduit Bending", "Panel Installation"],
        experienceLevel: "Basic",
        availability: "Part-time",
        city: "Anytown",
        state: "USA",
        bio: "Eager to learn and grow in the electrical trade.",
        profileImage: "/placeholder.svg",
      },
    ]
    setUsers(sampleUsers)
  }

  if (getJobs().length === 0) {
    const sampleJobs: Job[] = [
      {
        id: "job-1",
        shopId: "shop-1",
        title: "Residential Wiring Upgrade",
        description: "Need an apprentice for a full house wiring upgrade.",
        requiredSkills: ["Wiring", "Safety Protocols"],
        location: "Anytown, USA",
        budget: 1500,
        status: "open",
        postedDate: new Date().toISOString(),
      },
      {
        id: "job-2",
        shopId: "shop-1",
        title: "Commercial Lighting Installation",
        description: "Apprentice needed for new office lighting setup.",
        requiredSkills: ["Blueprint Reading", "Panel Installation"],
        location: "Anytown, USA",
        budget: 2000,
        status: "open",
        postedDate: new Date().toISOString(),
      },
    ]
    setJobs(sampleJobs)
  }

  if (getActiveJobs().length === 0) {
    const sampleActiveJobs: ActiveJob[] = [
      {
        id: "active-job-1",
        jobId: "job-1",
        shopId: "shop-1",
        apprenticeId: "apprentice-1",
        status: "in-progress",
        startDate: new Date().toISOString(),
        hourlyRate: 25,
      },
    ]
    setActiveJobs(sampleActiveJobs)
  }

  if (getInvitations().length === 0) {
    const sampleInvitations: Invitation[] = [
      {
        id: "invitation-1",
        jobId: "job-2",
        shopId: "shop-1",
        apprenticeId: "apprentice-2",
        status: "pending",
        message: "We would like to invite you to work on our commercial lighting project.",
        sentDate: new Date().toISOString(),
      },
    ]
    setInvitations(sampleInvitations)
  }

  if (getReviews().length === 0) {
    const sampleReviews: Review[] = [
      {
        id: "review-1",
        jobId: "job-1",
        reviewerId: "shop-1",
        revieweeId: "apprentice-1",
        rating: 4.5,
        comment: "Alice did a great job on the residential wiring upgrade. Very professional!",
        date: new Date().toISOString(),
      },
    ]
    setReviews(sampleReviews)
  }

  if (getTimeEntries().length === 0) {
    const sampleTimeEntries: TimeEntry[] = [
      {
        id: "time-entry-1",
        activeJobId: "active-job-1",
        apprenticeId: "apprentice-1",
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        hours: 8,
        description: "Full day on residential wiring.",
      },
    ]
    setTimeEntries(sampleTimeEntries)
  }
}
