import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export interface User {
  id: string
  email: string
  password_hash: string
  type: "shop" | "apprentice"
  first_name?: string
  last_name?: string
  phone?: string
  city?: string
  state?: string
  zip_code?: string
  profile_image?: string
  rating?: number
  jobs_completed?: number
  created_at: Date
  updated_at: Date

  // Shop-specific fields
  business_name?: string
  owner_name?: string
  business_type?: string
  years_in_business?: number
  license_number?: string
  insurance_info?: string

  // Apprentice-specific fields
  experience_level?: string
  skills?: string[]
  availability?: string
  hourly_rate_min?: number
  hourly_rate_max?: number
  education?: string
  certifications?: string[]
  bio?: string
  willing_to_travel?: boolean
  has_own_tools?: boolean
  has_transportation?: boolean
}

export interface JobPosting {
  id: string
  shop_id: string
  title: string
  description: string
  apprentices_needed: number
  expected_duration?: string
  days_needed: number
  start_date: string
  hours_per_day: number
  work_days: string[]
  pay_rate: string
  requirements?: string[]
  required_skills?: string[]
  priority: "high" | "medium" | "low"
  status: "active" | "filled" | "cancelled"
  applicants: number
  posted_date: Date
  total_cost?: number
  weekly_payment?: number
  created_at: Date
  updated_at: Date
}

export interface JobInvitation {
  id: string
  job_posting_id: string
  shop_id: string
  apprentice_id: string
  shop_name: string
  title: string
  description: string
  pay_rate: string
  days_needed: number
  start_date: string
  hours_per_day: number
  work_days: string[]
  requirements?: string[]
  required_skills?: string[]
  location?: string
  priority: string
  total_pay?: number
  weekly_pay?: number
  status: "pending" | "accepted" | "declined"
  created_at: Date
  updated_at: Date
}

export interface ActiveJob {
  id: string
  job_posting_id?: string
  shop_id: string
  apprentice_id: string
  title: string
  shop_name: string
  apprentice_name: string
  start_date: string
  total_days: number
  hours_per_day: number
  pay_rate: string
  status: "in-progress" | "completed" | "reviewed"
  days_worked: number
  total_hours: number
  pending_hours: number
  can_complete: boolean
  can_submit_hours: boolean
  created_at: Date
  updated_at: Date
}

export interface Review {
  id: string
  job_id: string
  reviewer_id: string
  reviewee_id: string
  reviewer_type: "shop" | "apprentice"
  rating: number
  comment: string
  job_title: string
  date: Date
  created_at: Date
}

export interface TimeEntry {
  id: string
  job_id: string
  apprentice_id: string
  date: string
  hours: number
  approved: boolean
  created_at: Date
  updated_at: Date
}
