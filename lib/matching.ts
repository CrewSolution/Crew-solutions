interface User {
  id: string
  type: string
  firstName?: string
  lastName?: string
  businessName?: string
  city: string
  state: string
  skills?: string[]
  experienceLevel?: string
  availability?: string
  rating?: number
  jobsCompleted?: number
  goals?: string
  hoursCompleted?: string
  yearsInBusiness?: string
  employeeCount?: string
}

interface JobPosting {
  id: string
  shopId: string
  title: string
  description: string
  requirements: string[]
  experienceLevel: string
  availability: string
  payRange: string
  location: string
  postedDate: string
  isActive: boolean
}

export function calculateMatchScore(apprentice: User, shop: User): number {
  let score = 0
  const maxScore = 100

  // Location matching (30 points)
  if (apprentice.state === shop.state) {
    score += 20
    if (apprentice.city === shop.city) {
      score += 10
    }
  }

  // Experience level matching (25 points)
  const experienceMap: { [key: string]: number } = {
    beginner: 1,
    "some-knowledge": 2,
    "basic-experience": 3,
    intermediate: 4,
  }

  const apprenticeExp = experienceMap[apprentice.experienceLevel || "beginner"] || 1
  const shopPreference = 2 // Assume shops prefer some experience but will take beginners

  if (apprenticeExp >= shopPreference) {
    score += 25
  } else if (apprenticeExp === shopPreference - 1) {
    score += 15
  }

  // Availability matching (20 points)
  if (apprentice.availability === "full-time" || apprentice.availability === "flexible") {
    score += 20
  } else if (apprentice.availability === "part-time") {
    score += 10
  }

  // Skills matching (15 points)
  const commonSkills =
    apprentice.skills?.filter((skill) =>
      ["Basic Electrical Theory", "Wiring Installation", "Safety Protocols", "Hand Tools"].includes(skill),
    ) || []
  score += Math.min(commonSkills.length * 3, 15)

  // Rating bonus (10 points)
  if (apprentice.rating && apprentice.rating >= 4) {
    score += 10
  } else if (apprentice.rating && apprentice.rating >= 3) {
    score += 5
  }

  return Math.min(score, maxScore)
}

export function findMatches(apprentice: User, shops: User[]): Array<User & { matchScore: number }> {
  return shops
    .map((shop) => ({
      ...shop,
      matchScore: calculateMatchScore(apprentice, shop),
    }))
    .filter((match) => match.matchScore >= 40) // Only show matches with 40%+ compatibility
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function findApprenticeMatches(shop: User, apprentices: User[]): Array<User & { matchScore: number }> {
  return apprentices
    .map((apprentice) => ({
      ...apprentice,
      matchScore: calculateMatchScore(apprentice, shop),
    }))
    .filter((match) => match.matchScore >= 40)
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function generateJobRecommendations(
  apprentice: User,
  jobs: JobPosting[],
): Array<JobPosting & { matchScore: number }> {
  return jobs
    .filter((job) => job.isActive)
    .map((job) => {
      let score = 0

      // Experience level match
      if (job.experienceLevel === apprentice.experienceLevel) {
        score += 30
      } else if (job.experienceLevel === "entry-level" && apprentice.experienceLevel === "beginner") {
        score += 25
      }

      // Availability match
      if (job.availability === apprentice.availability || apprentice.availability === "flexible") {
        score += 25
      }

      // Skills match
      const apprenticeSkills = apprentice.skills || []
      const requiredSkills = job.requirements || []
      const matchingSkills = apprenticeSkills.filter((skill) =>
        requiredSkills.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
      )
      score += Math.min(matchingSkills.length * 5, 25)

      // Location bonus (assuming job.location contains city/state info)
      if (job.location.includes(apprentice.state)) {
        score += 20
      }

      return {
        ...job,
        matchScore: score,
      }
    })
    .filter((job) => job.matchScore >= 30)
    .sort((a, b) => b.matchScore - a.matchScore)
}
