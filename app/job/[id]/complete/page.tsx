"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

const skillOptions = [
  "Basic Electrical Theory",
  "Wiring Installation",
  "Circuit Analysis",
  "Motor Controls",
  "Panel Installation",
  "Conduit Bending",
  "Blueprint Reading",
  "Safety Protocols",
  "Hand Tools",
  "Power Tools",
]

export default function JobCompletePage() {
  const router = useRouter()
  const params = useParams()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [jobData, setJobData] = useState<any>(null)
  const [ratings, setRatings] = useState({
    timeliness: 0,
    workEthic: 0,
    materialKnowledge: 0,
    profileAccuracy: 0,
  })
  const [skillsShown, setSkillsShown] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)

    // Mock job data - in real app, fetch by ID
    const mockJobData = {
      id: params.id,
      title: "Residential Wiring Assistant",
      apprenticeName: "Marcus C.",
      apprenticeId: "1",
      startDate: "2025-01-10",
      endDate: "2025-01-15",
      totalDays: 10,
      totalHours: 80,
      payRate: "$20/hour",
      totalPay: 1600,
      apprenticeSkills: ["Wiring Installation", "Safety Protocols", "Hand Tools", "Basic Electrical Theory"],
    }
    setJobData(mockJobData)
  }, [router, params.id])

  const handleRatingChange = (category: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }))
  }

  const handleSkillToggle = (skill: string) => {
    setSkillsShown((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all ratings are provided
    const allRatingsProvided = Object.values(ratings).every((rating) => rating > 0)
    if (!allRatingsProvided) {
      alert("Please provide ratings for all categories")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // In real app, save review and update job status
      console.log("Review submitted:", {
        jobId: params.id,
        ratings,
        skillsShown,
        comment,
      })

      // Redirect back to dashboard
      router.push("/dashboard/shop?tab=active&completed=true")
      setIsSubmitting(false)
    }, 1000)
  }

  const renderStarRating = (category: string, currentRating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {currentRating > 0 ? `${currentRating}/5` : "Not rated"}
        </span>
      </div>
    )
  }

  if (!currentUser || !jobData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-bold">Crew Solutions</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complete Job</h1>
                <p className="text-sm text-gray-500">{jobData.title}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Summary</CardTitle>
            <CardDescription>Review the completed work details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Apprentice</p>
                <p className="text-sm text-muted-foreground">{jobData.apprenticeName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(jobData.startDate).toLocaleDateString()} - {new Date(jobData.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Hours</p>
                <p className="text-sm text-muted-foreground">{jobData.totalHours}h</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Pay</p>
                <p className="text-sm text-green-600">${jobData.totalPay.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Apprentice Performance</CardTitle>
              <CardDescription>Provide ratings for different aspects of their work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Timeliness</Label>
                  <p className="text-sm text-muted-foreground mb-2">How punctual and reliable was the apprentice?</p>
                  {renderStarRating("timeliness", ratings.timeliness)}
                </div>

                <div>
                  <Label className="text-base font-medium">Work Ethic</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How was their attitude, effort, and professionalism?
                  </p>
                  {renderStarRating("workEthic", ratings.workEthic)}
                </div>

                <div>
                  <Label className="text-base font-medium">Material Knowledge</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How well did they understand electrical concepts and materials?
                  </p>
                  {renderStarRating("materialKnowledge", ratings.materialKnowledge)}
                </div>

                <div>
                  <Label className="text-base font-medium">Profile Accuracy</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How accurately did their profile represent their actual skill level?
                  </p>
                  {renderStarRating("profileAccuracy", ratings.profileAccuracy)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Demonstrated</CardTitle>
              <CardDescription>
                Check the skills that {jobData.apprenticeName} demonstrated on the job site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Apprentice's Listed Skills:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobData.apprenticeSkills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Skills Shown on Job Site:</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={skillsShown.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm font-normal">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Comments</CardTitle>
              <CardDescription>Share any additional feedback about the apprentice's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the apprentice's performance, areas of strength, and any suggestions for improvement..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || Object.values(ratings).some((rating) => rating === 0)}
              className="flex-1"
            >
              {isSubmitting ? "Submitting Review..." : "Complete Job & Submit Review"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
