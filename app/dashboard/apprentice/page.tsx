"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  Star,
  Clock,
  TrendingUp,
  Zap,
  LogOut,
  Eye,
  Upload,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Wallet,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

interface Apprentice {
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
  profileImage?: string
  bio?: string
  phone?: string
  email?: string
}

interface JobInvitation {
  id: string
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
}

interface Review {
  id: string
  shopName: string
  rating: number
  comment: string
  jobTitle: string
  date: string
}

export default function ApprenticeDashboard() {
  const [currentUser, setCurrentUser] = useState<Apprentice | null>(null)
  const [incomingJobs, setIncomingJobs] = useState<JobInvitation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedJob, setSelectedJob] = useState<JobInvitation | null>(null)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [totalEarnings, setTotalEarnings] = useState(2450.75)
  const [pendingPay, setPendingPay] = useState(320.0)
  const [profileData, setProfileData] = useState({
    bio: "",
    profileImage: "",
    phone: "",
    email: "",
    bankAccount: "",
    routingNumber: "",
  })
  const [activeJobs, setActiveJobs] = useState([
    {
      id: "active-1",
      title: "Residential Wiring Assistant",
      shopName: "Bay Area Electric Co.",
      shopId: "shop-1",
      startDate: "2025-01-10",
      daysWorked: 8,
      totalDays: 10,
      hoursPerDay: 8,
      payRate: "$20/hour",
      status: "in-progress",
      totalHours: 64,
      todayHours: 0,
      canSubmitHours: true,
      canComplete: true,
    },
  ])
  const [todayHours, setTodayHours] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.type !== "apprentice") {
      router.push("/login")
      return
    }

    setCurrentUser(userData)
    setProfileData({
      bio: userData.bio || "",
      profileImage: userData.profileImage || "",
      phone: userData.phone || "",
      email: userData.email || "",
      bankAccount: userData.bankAccount || "",
      routingNumber: userData.routingNumber || "",
    })

    // Sample incoming jobs
    const sampleIncomingJobs = [
      {
        id: "1",
        shopName: "Express Electric",
        title: "Emergency Repair Assistant",
        description: "Urgent electrical repair needed for commercial building. Must be available immediately.",
        payRate: "$25/hour",
        daysNeeded: 2,
        startDate: "2025-01-16",
        hoursPerDay: 8,
        workDays: ["Monday", "Tuesday"],
        requirements: ["Available immediately", "Basic electrical knowledge"],
        requiredSkills: ["Safety Protocols", "Hand Tools"],
        location: "San Jose, CA",
        priority: "high" as const,
        totalPay: 400,
      },
      {
        id: "2",
        shopName: "Bay Area Electric Co.",
        title: "Residential Wiring Project",
        description: "Help with residential electrical installations in new construction homes.",
        payRate: "$22/hour",
        daysNeeded: 10,
        startDate: "2025-01-20",
        hoursPerDay: 8,
        workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        requirements: ["Wiring experience preferred", "Own transportation"],
        requiredSkills: ["Wiring Installation", "Blueprint Reading"],
        location: "San Francisco, CA",
        priority: "medium" as const,
        totalPay: 1760,
        weeklyPay: 880,
      },
    ]

    const sampleReviews = [
      {
        id: "1",
        shopName: "ABC Electrical",
        rating: 5,
        comment: "Excellent work ethic and quick learner. Very reliable and safety-conscious.",
        jobTitle: "Wiring Assistant",
        date: "2025-01-05",
      },
      {
        id: "2",
        shopName: "Power Solutions Inc.",
        rating: 4,
        comment: "Good technical skills and follows instructions well. Would hire again.",
        jobTitle: "Panel Installation Helper",
        date: "2024-12-20",
      },
    ]

    setIncomingJobs(sampleIncomingJobs)
    setReviews(sampleReviews)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleJobDetails = (job: JobInvitation) => {
    setSelectedJob(job)
    setShowJobDetails(true)
  }

  const handleAcceptJob = (jobId: string) => {
    setIncomingJobs((prev) => prev.filter((job) => job.id !== jobId))
    setShowJobDetails(false)
    setSelectedJob(null)
    // In real app, this would create a work session and time tracking
  }

  const handleDeclineJob = (jobId: string) => {
    setIncomingJobs((prev) => prev.filter((job) => job.id !== jobId))
    setShowJobDetails(false)
    setSelectedJob(null)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  const hoursCompleted = Number.parseInt(currentUser.hoursCompleted || "0")
  const hoursNeeded = 8000 // Typical apprenticeship requirement
  const progressPercentage = Math.min((hoursCompleted / hoursNeeded) * 100, 100)
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-bold">Crew Solutions</span>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {currentUser.firstName}!</h1>
                <p className="text-sm text-gray-500">Apprentice Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Incoming Jobs Alert */}
        {incomingJobs.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-5 w-5" />
                Incoming Job Requests ({incomingJobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incomingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.shopName} • {job.payRate} • {job.daysNeeded} days
                      </p>
                      <Badge
                        variant={
                          job.priority === "high" ? "destructive" : job.priority === "medium" ? "default" : "secondary"
                        }
                        className="mt-1"
                      >
                        {job.priority} priority
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleJobDetails(job)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Details Modal */}
        {showJobDetails && selectedJob && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedJob.title}</span>
                <Button variant="ghost" size="sm" onClick={() => setShowJobDetails(false)}>
                  ×
                </Button>
              </CardTitle>
              <CardDescription>{selectedJob.shopName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{selectedJob.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Pay Rate</p>
                  <p className="text-sm text-muted-foreground">{selectedJob.payRate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{selectedJob.daysNeeded} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedJob.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Hours/Day</p>
                  <p className="text-sm text-muted-foreground">{selectedJob.hoursPerDay}h</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Work Days:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.workDays.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Total Pay: ${selectedJob.totalPay.toFixed(2)}
                  {selectedJob.weeklyPay && (
                    <span className="block text-xs text-green-600 dark:text-green-300">
                      Weekly: ${selectedJob.weeklyPay.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAcceptJob(selectedJob.id)}
                >
                  Accept Job
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleDeclineJob(selectedJob.id)}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hoursCompleted.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">of {hoursNeeded.toLocaleString()} required</p>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentUser.jobsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">Successful placements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "New"}</div>
              <p className="text-xs text-muted-foreground">From {reviews.length} reviews</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="incoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="incoming">Incoming Jobs</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Job Invitations</CardTitle>
                <CardDescription>Review and respond to job opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {incomingJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No incoming job requests at the moment.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Keep your profile updated to receive more opportunities!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingJobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.shopName}</p>
                            </div>
                            <Badge
                              variant={
                                job.priority === "high"
                                  ? "destructive"
                                  : job.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {job.priority} priority
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{job.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                            <div>
                              <span className="font-medium">Pay:</span> {job.payRate}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {job.daysNeeded} days
                            </div>
                            <div>
                              <span className="font-medium">Start:</span> {new Date(job.startDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> ${job.totalPay.toFixed(2)}
                            </div>
                          </div>

                          <Button size="sm" variant="outline" onClick={() => handleJobDetails(job)} className="w-full">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details & Respond
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Track your current work and submit hours</CardDescription>
              </CardHeader>
              <CardContent>
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active jobs at the moment.</p>
                    <p className="text-sm text-muted-foreground mt-2">Accept job invitations to start working!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <Card key={job.id} className="border-green-200">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription>
                                {job.shopName} • Started {new Date(job.startDate).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge variant="default" className="bg-green-600">
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium">Progress</p>
                              <p className="text-sm text-muted-foreground">
                                {job.daysWorked}/{job.totalDays} days
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Hours Worked</p>
                              <p className="text-sm text-muted-foreground">{job.totalHours}h</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Pay Rate</p>
                              <p className="text-sm text-muted-foreground">{job.payRate}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Earnings</p>
                              <p className="text-sm text-green-600">${(job.totalHours * 20).toFixed(2)}</p>
                            </div>
                          </div>

                          <Card className="bg-green-50 dark:bg-green-900/20">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Submit Today's Hours</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Label htmlFor="hours" className="text-sm">
                                  Hours worked today:
                                </Label>
                                <Input
                                  id="hours"
                                  type="number"
                                  min="0"
                                  max="12"
                                  step="0.5"
                                  value={todayHours}
                                  onChange={(e) => setTodayHours(e.target.value)}
                                  className="w-20"
                                  placeholder="8"
                                />
                              </div>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={!todayHours || !job.canSubmitHours}
                              >
                                Submit Hours
                              </Button>
                            </CardContent>
                          </Card>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!job.canComplete}
                              onClick={() => router.push(`/job/${job.id}/review`)}
                            >
                              Complete Job
                            </Button>
                            <Button size="sm" variant="outline">
                              View Time Cards
                            </Button>
                            <Button size="sm" variant="outline">
                              Message Shop
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  My Wallet
                </CardTitle>
                <CardDescription>Track your earnings and manage payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pending Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">${pendingPay.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">Processing</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$640.00</div>
                      <p className="text-sm text-muted-foreground">32 hours worked</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Direct Deposit Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Bank Account Number</Label>
                        <Input
                          id="bankAccount"
                          type="password"
                          value={profileData.bankAccount}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, bankAccount: e.target.value }))}
                          placeholder="Enter account number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={profileData.routingNumber}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, routingNumber: e.target.value }))}
                          placeholder="Enter routing number"
                        />
                      </div>
                    </div>
                    <Button>Update Banking Information</Button>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Recent Payments</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Residential Wiring - Week 1</p>
                          <p className="text-sm text-muted-foreground">ABC Electrical • 40 hours @ $20/hr</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+$800.00</p>
                          <p className="text-sm text-muted-foreground">Jan 12, 2025</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Panel Installation Helper</p>
                          <p className="text-sm text-muted-foreground">Power Solutions • 32 hours @ $22/hr</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+$704.00</p>
                          <p className="text-sm text-muted-foreground">Jan 8, 2025</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your apprentice profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>
                      <Calendar className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={currentUser.firstName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={currentUser.lastName?.charAt(0) + "."} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={`${currentUser.city}, ${currentUser.state}`} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Input
                      id="experience"
                      value={currentUser.experienceLevel?.replace("-", " ") || "Beginner"}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell potential employers about yourself, your goals, and what makes you a great apprentice..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentUser.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Input id="availability" value={currentUser.availability?.replace("-", " ") || "Flexible"} readOnly />
                </div>

                <Button>Save Profile Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews from Employers</CardTitle>
                <CardDescription>Feedback from your completed jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{review.shopName}</CardTitle>
                            <CardDescription>{review.jobTitle}</CardDescription>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">"{review.comment}"</p>
                        <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {reviews.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No reviews yet. Complete your first job to receive feedback!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apprenticeship Progress</CardTitle>
                  <CardDescription>Track your journey to becoming a licensed electrician</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Hours Completed</span>
                      <span>
                        {hoursCompleted} / {hoursNeeded.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressPercentage} />
                    <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPercentage)}% complete</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Milestones</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Basic Safety Training</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">First 500 Hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">2000 Hours Milestone</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">4000 Hours Milestone</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Development</CardTitle>
                  <CardDescription>Your verified skills and certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Current Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommended Next Steps</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Advanced Wiring Techniques</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Motor Control Systems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Industrial Electrical Systems</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
