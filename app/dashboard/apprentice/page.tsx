"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Briefcase, MapPin, DollarSign, Clock, GraduationCap, PenToolIcon as Tool, Car, Zap } from "lucide-react"
import { getCurrentUser, getActiveJobs, getJobInvitations } from "@/lib/storage"
import type { User, ActiveJob, JobInvitation } from "@/lib/db"

export default function ApprenticeDashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<JobInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.type !== "apprentice") {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    const fetchData = async () => {
      try {
        const [active, invitations] = await Promise.all([
          getActiveJobs(user.id, "apprentice"),
          getJobInvitations(user.id, "pending"),
        ])
        setActiveJobs(active)
        setPendingInvitations(invitations)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <Zap className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 text-red-700">
        <p>{error}</p>
      </div>
    )
  }

  if (!currentUser) {
    return null // Should redirect by now
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Apprentice Dashboard</h1>
        <Button className="bg-yellow-500 hover:bg-yellow-600">Find Electrical Jobs</Button>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Apprentice Profile Card */}
        <Card className="col-span-1 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Your Electrical Profile</CardTitle>
            <Briefcase className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={currentUser.profile_image || "/placeholder.svg?height=80&width=80"}
                  alt="Apprentice Avatar"
                />
                <AvatarFallback>{currentUser.first_name ? currentUser.first_name[0] : "A"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <p className="text-sm text-gray-500">{currentUser.experience_level || "N/A"}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>
                    {currentUser.city}, {currentUser.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Availability:</strong> {currentUser.availability || "N/A"}
              </p>
              <p>
                <strong>Hourly Rate:</strong> ${currentUser.hourly_rate_min || "N/A"} - $
                {currentUser.hourly_rate_max || "N/A"}
              </p>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span>
                  {currentUser.rating?.toFixed(1) || "N/A"} ({currentUser.jobs_completed || 0} jobs)
                </span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="mr-1 h-4 w-4" />
                <span>{currentUser.education || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Tool className="mr-1 h-4 w-4" />
                <span>Tools: {currentUser.has_own_tools ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center">
                <Car className="mr-1 h-4 w-4" />
                <span>Transportation: {currentUser.has_transportation ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>Travel: {currentUser.willing_to_travel ? "Yes" : "No"}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800">Skills:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentUser.skills && currentUser.skills.length > 0 ? (
                  currentUser.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed.</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full border-yellow-300 text-yellow-600 hover:bg-yellow-50 bg-transparent"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card className="col-span-2 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Your Active Electrical Jobs</CardTitle>
            <Briefcase className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <div key={job.id} className="mb-4 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-600">Shop: {job.shop_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      Hours: {job.total_hours} / {job.total_days * job.hours_per_day}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>Pay: {job.pay_rate}</span>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-700">
                    {job.status}
                  </Badge>
                  <Button variant="link" className="text-yellow-600 hover:text-yellow-700">
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No active jobs.</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        <Card className="col-span-2 border-yellow-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-yellow-600">Pending Electrical Job Invitations</CardTitle>
            <Briefcase className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            {pendingInvitations.length > 0 ? (
              pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="mb-4 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800">{invitation.title}</h3>
                  <p className="text-sm text-gray-600">From: {invitation.shop_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Days Needed: {invitation.days_needed}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>Pay: {invitation.pay_rate}</span>
                  </div>
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                    >
                      View Details
                    </Button>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                      Accept
                    </Button>
                    <Button variant="destructive" size="sm">
                      Decline
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No pending invitations.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
