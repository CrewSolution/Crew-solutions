import type { User, JobPosting } from "./types"

export function findMatchingApprentices(job: JobPosting, apprentices: User[]): User[] {
  if (!job || !apprentices) {
    return []
  }

  const requiredSkills = new Set(job.required_skills?.map((s) => s.toLowerCase()) || [])
  const jobLocation = job.city?.toLowerCase() // Assuming job has a city field

  return apprentices.filter((apprentice) => {
    // 1. Check if apprentice is active and profile is complete
    if (apprentice.type !== "apprentice" || !apprentice.profile_complete) {
      return false
    }

    // 2. Skill Match: Apprentice must have all required skills
    const apprenticeSkills = new Set(apprentice.skills?.map((s) => s.toLowerCase()) || [])
    const hasAllRequiredSkills = Array.from(requiredSkills).every((skill) => apprenticeSkills.has(skill))
    if (!hasAllRequiredSkills) {
      return false
    }

    // 3. Location/Travel: Apprentice must be in the same city or willing to travel
    const apprenticeCity = apprentice.city?.toLowerCase()
    const willingToTravel = apprentice.willing_to_travel

    if (jobLocation && apprenticeCity && jobLocation !== apprenticeCity && !willingToTravel) {
      return false
    }

    // 4. Availability (simplified): Apprentice must have some availability that matches job days
    // This is a very basic check. A more robust system would compare specific days/hours.
    const jobWorkDays = new Set(job.work_days?.map((d) => d.toLowerCase()) || [])
    const apprenticeAvailability = apprentice.availability?.toLowerCase()

    if (jobWorkDays.size > 0 && apprenticeAvailability === "full-time") {
      // If job specifies days and apprentice is full-time, assume a match for simplicity
      // In a real app, you'd check if jobWorkDays overlap with apprentice's specific available days
    } else if (jobWorkDays.size > 0 && apprenticeAvailability === "part-time" && jobWorkDays.size > 3) {
      // Simple heuristic: part-time might not match a job requiring many days
      return false
    }

    // 5. Experience Level (simplified): Job requirements might specify experience
    // This would need a more detailed mapping (e.g., 'entry-level' vs 'basic-experience')
    // For now, we'll assume if a job has specific requirements, the apprentice meets them.
    // A more complex system would parse job.requirements and match against apprentice's bio/experience.

    // 6. Transportation: If job requires transportation, apprentice must have it
    if (job.requirements?.includes("Requires Transportation") && !apprentice.transportation) {
      return false
    }

    // All checks passed
    return true
  })
}

export function calculateMatchScore(job: JobPosting, apprentice: User): number {
  let score = 0

  // Skill Match (higher weight)
  const requiredSkills = new Set(job.required_skills?.map((s) => s.toLowerCase()) || [])
  const apprenticeSkills = new Set(apprentice.skills?.map((s) => s.toLowerCase()) || [])
  const commonSkills = Array.from(requiredSkills).filter((skill) => apprenticeSkills.has(skill))
  score += (commonSkills.length / requiredSkills.size) * 50 // Max 50 points for skills

  // Location Match
  const jobLocation = job.city?.toLowerCase()
  const apprenticeCity = apprentice.city?.toLowerCase()
  if (jobLocation && apprenticeCity && jobLocation === apprenticeCity) {
    score += 20 // 20 points for same city
  } else if (apprentice.willing_to_travel) {
    score += 10 // 10 points for willing to travel
  }

  // Availability Match (simplified)
  // This is a placeholder. A real system would have complex availability matching.
  if (job.work_days && job.work_days.length > 0 && apprentice.availability === "full-time") {
    score += 15 // 15 points for full-time matching any work days
  } else if (
    job.work_days &&
    job.work_days.length > 0 &&
    apprentice.availability === "part-time" &&
    job.work_days.length <= 3
  ) {
    score += 10 // 10 points for part-time matching fewer days
  }

  // Experience Level (simplified)
  // This would need a more detailed mapping.
  if (apprentice.experience_level === "journeyman") {
    score += 10
  } else if (apprentice.experience_level === "basic-experience" && job.requirements?.includes("Entry Level")) {
    score += 5
  }

  // Transportation
  if (job.requirements?.includes("Requires Transportation") && apprentice.transportation) {
    score += 5
  }

  return Math.min(100, Math.round(score)) // Cap at 100
}
