import type { User, JobPosting } from "./storage"

export interface MatchScore {
  overall: number
  skillMatch: number
  availabilityMatch: number
  locationMatch: number
  experienceMatch: number
}

export const calculateMatchScore = (job: JobPosting, apprentice: User): number => {
  let score = 0
  let factors = 0

  // Skill matching (40% weight)
  if (job.requiredSkills && apprentice.skills) {
    const matchingSkills = job.requiredSkills.filter((skill) =>
      apprentice.skills!.some(
        (apprenticeSkill) =>
          apprenticeSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(apprenticeSkill.toLowerCase()),
      ),
    )
    const skillScore = (matchingSkills.length / job.requiredSkills.length) * 40
    score += skillScore
    factors += 40
  }

  // Experience level matching (25% weight)
  if (apprentice.experienceLevel) {
    const experienceScore = getExperienceScore(apprentice.experienceLevel)
    score += experienceScore * 25
    factors += 25
  }

  // Availability matching (20% weight)
  if (apprentice.availability) {
    const availabilityScore = getAvailabilityScore(apprentice.availability, job.workDays)
    score += availabilityScore * 20
    factors += 20
  }

  // Location proximity (15% weight)
  if (apprentice.city && apprentice.state) {
    // For demo purposes, assume all are in CA and give partial score
    const locationScore = 0.8 // 80% match for same state
    score += locationScore * 15
    factors += 15
  }

  return factors > 0 ? Math.round((score / factors) * 100) : 0
}

const getExperienceScore = (experienceLevel: string): number => {
  switch (experienceLevel.toLowerCase()) {
    case "advanced":
    case "expert":
      return 1.0
    case "intermediate":
      return 0.8
    case "basic experience":
    case "some knowledge":
      return 0.6
    case "beginner":
    case "entry level":
      return 0.4
    default:
      return 0.5
  }
}

const getAvailabilityScore = (availability: string, workDays: string[]): number => {
  if (availability.toLowerCase().includes("full-time")) {
    return 1.0
  } else if (availability.toLowerCase().includes("part-time")) {
    return 0.7
  } else if (availability.toLowerCase().includes("weekend")) {
    // Check if job requires weekends
    const hasWeekends = workDays.some(
      (day) => day.toLowerCase().includes("saturday") || day.toLowerCase().includes("sunday"),
    )
    return hasWeekends ? 0.9 : 0.3
  }
  return 0.5
}

export const findMatchingApprentices = (job: JobPosting, apprentices: User[]): User[] => {
  return apprentices
    .filter((apprentice) => apprentice.type === "apprentice")
    .map((apprentice) => ({
      ...apprentice,
      matchScore: calculateMatchScore(job, apprentice),
    }))
    .filter((apprentice) => apprentice.matchScore > 30) // Only show matches above 30%
    .sort((a, b) => b.matchScore - a.matchScore)
}

export const getRecommendedJobs = (apprentice: User, jobs: JobPosting[]): JobPosting[] => {
  return jobs
    .filter((job) => job.status === "active")
    .map((job) => ({
      ...job,
      matchScore: calculateMatchScore(job, apprentice),
    }))
    .filter((job) => job.matchScore > 30)
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function matchApprenticesToJobs(apprentices: any[], jobPostings: any[]): any[] {
  // Placeholder for a more sophisticated matching algorithm
  // For now, it returns a simple match based on basic criteria
  const matches: any[] = []

  jobPostings.forEach((job) => {
    apprentices.forEach((apprentice) => {
      // Example: simple match if apprentice has at least one required skill
      const hasRequiredSkills =
        job.required_skills && job.required_skills.some((skill: string) => apprentice.skills?.includes(skill))

      // Example: simple match if apprentice is available for the job's duration
      const isAvailable = apprentice.availability === "Full-time" || apprentice.availability === "Flexible"

      if (hasRequiredSkills && isAvailable) {
        matches.push({
          jobId: job.id,
          apprenticeId: apprentice.id,
          score: 1, // Simple score
        })
      }
    })
  })

  return matches
}
