"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  Briefcase,
  Star,
  MapPin,
  Clock,
  Search,
  Plus,
  Eye,
  Zap,
  LogOut,
  Calendar,
  DollarSign,
  AlertTriangle,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  getJobPostingsByShop,
  saveJobPosting,
  getActiveJobsByUser,
  saveJobInvitation,
  type User,
  type JobPosting,
  type ActiveJob,
  type JobInvitation,
} from "@/lib/storage"

const availableSkills = [
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

export default function ShopDashboard() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [apprentices, setApprentices] = useState<User[]>([])
  const [filteredApprentices, setFilteredApprentices] = useState<User[]>([])
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [showJobForm, setShowJobForm] = useState(false)
  const [hasActiveJobs, setHasActiveJobs] = useState(false)
  const [showBrowseRestriction, setShowBrowseRestriction] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    apprenticesNeeded: 1,
    expectedDuration: "",
    daysNeeded: 1,
    startDate: "",
    hoursPerDay: 8,
    workDays: [] as string[],
    payRate: "",
    requirements: [] as string[],
    requiredSkills: [] as string[],
    priority: "medium" as "high" | "medium" | "low",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    if (user.type !== "shop") {
      router.push("/login")
      return
    }

    setCurrentUserState(user)

    // Load apprentices
    const allUsers = getUsers()
    const apprenticeUsers = allUsers.filter((u) => u.type === "apprentice")
    setApprentices(apprenticeUsers)
    setFilteredApprentices(apprenticeUsers)

    // Load job postings
    const userJobPostings = getJobPostingsByShop(user.id)
    setJobPostings(userJobPostings)
    setHasActiveJobs(userJobPostings.length > 0)

    // Load active jobs
    const userActiveJobs = getActiveJobsByUser(user.id, "shop")
    setActiveJobs(userActiveJobs)
  }, [router])

  useEffect(() => {
    let filtered = apprentices

    if (searchTerm) {
      filtered = filtered.filter(
        (apprentice) =>
          `${apprentice.firstName} ${apprentice.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apprentice.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apprentice.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter((apprentice) => apprentice.experienceLevel === experienceFilter)
    }

    if (availabilityFilter !== "all") {
      filtered = filtered.filter((apprentice) => apprentice.availability === availabilityFilter)
    }

    setFilteredApprentices(filtered)
  }, [apprentices, searchTerm, experienceFilter, availabilityFilter])

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) return

    // Calculate costs
    const hourlyRate = Number.parseFloat(newJob.payRate.replace(/[^0-9.-]+/g, "")) || 20
    const totalHours = newJob.daysNeeded * newJob.hoursPerDay * newJob.apprenticesNeeded
    const totalCost = totalHours * hourlyRate
    const weeklyPayment =
      newJob.daysNeeded > 7 ? 7 * newJob.hoursPerDay * newJob.apprenticesNeeded * hourlyRate : totalCost

    const job: JobPosting = {
      id: `job-${Date.now()}`,
      shopId: currentUser.id,
      ...newJob,
      status: "active",
      applicants: 0,
      postedDate: new Date().toISOString().split("T")[0],
      totalCost,
      weeklyPayment,
    }

    saveJobPosting(job)
    setJobPostings([job, ...jobPostings])
    setHasActiveJobs(true)
    setShowJobForm(false)
    setNewJob({
      title: "",
      description: "",
      apprenticesNeeded: 1,
      expectedDuration: "",
      daysNeeded: 1,
      startDate: "",
      hoursPerDay: 8,
      workDays: [],
      payRate: "",
      requirements: [],
      requiredSkills: [],
      priority: "medium",
    })

    toast({
      title: "Job posted successfully",
      description: "Your job posting is now live and visible to apprentices",
    })

    // Auto-send to matching apprentices for high priority jobs
    if (job.priority === "high") {
      const matchingApprentices = apprentices.filter((apprentice) =>
        apprentice.skills?.some((skill) => job.requiredSkills.includes(skill)),
      )

      matchingApprentices.forEach((apprentice) => {
        const invitation: JobInvitation = {
          id: `invitation-${Date.now()}-${apprentice.id}`,
          jobPostingId: job.id,
          shopId: currentUser.id,
          apprenticeId: apprentice.id,
          shopName: currentUser.businessName || "Unknown Shop",
          title: job.title,
          description: job.description,
          payRate: job.payRate,
          daysNeeded: job.daysNeeded,
          startDate: job.startDate,
          hoursPerDay: job.hoursPerDay,
          workDays: job.workDays,
          requirements: job.requirements,
          requiredSkills: job.requiredSkills,
          location: `${currentUser.city}, ${currentUser.state}`,
          priority: job.priority,
          totalPay: job.totalCost || 0,
          weeklyPay: job.weeklyPayment,
          status: "pending",
          sentAt: new Date().toISOString(),
        }
        saveJobInvitation(invitation)
      })

      toast({
        title: "High priority job sent",
        description: `Automatically sent to ${matchingApprentices.length} matching apprentices`,
      })
    }
  }

  const handleWorkDayToggle = (day: string) => {
    setNewJob((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day) ? prev.workDays.filter((d) => d !== day) : [...prev.workDays, day],
    }))
  }

  const handleSkillToggle = (skill: string) => {
    setNewJob((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }))
  }

  const handleBrowseClick = () => {
    if (!hasActiveJobs) {
      setShowBrowseRestriction(true)
      return
    }
    // Allow browsing
  }

  const handleInviteApprentice = (apprentice: User) => {
    if (!currentUser) return

    // For demo purposes, create a sample job invitation
    const sampleJob = jobPostings[0] // Use first job posting
    if (!sampleJob) {
      toast({
        title: "No active jobs",
        description: "Please create a job posting first",
        variant: "destructive",
      })
      return
    }

    const invitation: JobInvitation = {
      id: `invitation-${Date.now()}-${apprentice.id}`,
      jobPostingId: sampleJob.id,
      shopId: currentUser.id,
      apprenticeId: apprentice.id,
      shopName: currentUser.businessName || "Unknown Shop",
      title: sampleJob.title,
      description: sampleJob.description,
      payRate: sampleJob.payRate,
      daysNeeded: sampleJob.daysNeeded,
      startDate: sampleJob.startDate,
      hoursPerDay: sampleJob.hoursPerDay,
      workDays: sampleJob.workDays,
      requirements: sampleJob.requirements,
      requiredSkills: sampleJob.requiredSkills,
      location: `${currentUser.city}, ${currentUser.state}`,
      priority: sampleJob.priority,
      totalPay: sampleJob.totalCost || 0,
      weeklyPay: sampleJob.weeklyPayment,
      status: "pending",
      sentAt: new Date().toISOString(),
    }

    saveJobInvitation(invitation)

    toast({
      title: "Invitation sent",
      description: `Job invitation sent to ${apprentice.firstName} ${apprentice.lastName}`,
    })
  }

  const calculateOwedAmount = () => {
    return jobPostings
      .filter((job) => job.status === "active" && job.daysNeeded > 7)
      .reduce((total, job) => total + (job.weeklyPayment || 0), 0)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.businessName}</h1>
                <p className="text-sm text-gray-500">Shop Dashboard</p>
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
        {/* Payment Alert */}
        {calculateOwedAmount() > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" />
                Payment Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-3">
                You have jobs running longer than 1 week. Weekly payment required: ${calculateOwedAmount().toFixed(2)}
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Apprentices</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apprentices.length}</div>
              <p className="text-xs text-muted-foreground">Ready to work</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobPostings.filter((j) => j.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Currently posted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Owed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${calculateOwedAmount().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Weekly payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Successful placements</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="browse" onClick={handleBrowseClick}>
              Browse Apprentices
            </TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">Shop Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Job Postings</CardTitle>
                  <CardDescription>Create and manage your job openings</CardDescription>
                </div>
                <Button onClick={() => setShowJobForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </CardHeader>
              <CardContent>
                {showJobForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Create New Job Posting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleJobSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                              id="title"
                              value={newJob.title}
                              onChange={(e) => setNewJob((prev) => ({ ...prev, title: e.target.value }))}
                              required
                              placeholder="e.g., Residential Wiring Assistant"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select
                              value={newJob.priority}
                              onValueChange={(value: "high" | "medium" | "low") =>
                                setNewJob((prev) => ({ ...prev, priority: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High (1-3 days, auto-send)</SelectItem>
                                <SelectItem value="medium">Medium (flexible options)</SelectItem>
                                <SelectItem value="low">Low (browse only)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Job Description *</Label>
                          <Textarea
                            id="description"
                            value={newJob.description}
                            onChange={(e) => setNewJob((prev) => ({ ...prev, description: e.target.value }))}
                            required
                            placeholder="Describe the job responsibilities and requirements..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="apprenticesNeeded">Apprentices Needed *</Label>
                            <Input
                              id="apprenticesNeeded"
                              type="number"
                              min="1"
                              value={newJob.apprenticesNeeded}
                              onChange={(e) =>
                                setNewJob((prev) => ({ ...prev, apprenticesNeeded: Number.parseInt(e.target.value) }))
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="daysNeeded">Days Needed *</Label>
                            <Input
                              id="daysNeeded"
                              type="number"
                              min="1"
                              value={newJob.daysNeeded}
                              onChange={(e) =>
                                setNewJob((prev) => ({ ...prev, daysNeeded: Number.parseInt(e.target.value) }))
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Expected Start Date *</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={newJob.startDate}
                              onChange={(e) => setNewJob((prev) => ({ ...prev, startDate: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hoursPerDay">Hours Per Day *</Label>
                            <Input
                              id="hoursPerDay"
                              type="number"
                              min="1"
                              max="12"
                              value={newJob.hoursPerDay}
                              onChange={(e) =>
                                setNewJob((prev) => ({ ...prev, hoursPerDay: Number.parseInt(e.target.value) }))
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payRate">Pay Rate *</Label>
                          <Input
                            id="payRate"
                            value={newJob.payRate}
                            onChange={(e) => setNewJob((prev) => ({ ...prev, payRate: e.target.value }))}
                            required
                            placeholder="e.g., $18-22/hour"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Work Days *</Label>
                          <div className="flex flex-wrap gap-2">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                              (day) => (
                                <Button
                                  key={day}
                                  type="button"
                                  variant={newJob.workDays.includes(day) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleWorkDayToggle(day)}
                                >
                                  {day.slice(0, 3)}
                                </Button>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Required Skills</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {availableSkills.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={skill}
                                  checked={newJob.requiredSkills.includes(skill)}
                                  onCheckedChange={() => handleSkillToggle(skill)}
                                />
                                <Label htmlFor={skill} className="text-sm font-normal">
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit">Post Job</Button>
                          <Button type="button" variant="outline" onClick={() => setShowJobForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {jobPostings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No job postings yet. Create your first job posting to get started!
                      </p>
                    </div>
                  ) : (
                    jobPostings.map((job) => (
                      <Card key={job.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {job.title}
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
                              </CardTitle>
                              <CardDescription>
                                Posted {new Date(job.postedDate).toLocaleDateString()} • Starts{" "}
                                {new Date(job.startDate).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{job.apprenticesNeeded} needed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{job.daysNeeded} days</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{job.hoursPerDay}h/day</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{job.payRate}</span>
                            </div>
                          </div>

                          {job.requiredSkills.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-2">Required Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {job.requiredSkills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 mb-3">
                            {job.workDays.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day.slice(0, 3)}
                              </Badge>
                            ))}
                          </div>

                          {job.totalCost && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                              <p className="text-sm">
                                <strong>Total Cost:</strong> ${job.totalCost.toFixed(2)}
                                {job.daysNeeded > 7 && (
                                  <span className="text-orange-600 ml-2">
                                    (Weekly payment: ${job.weeklyPayment?.toFixed(2)})
                                  </span>
                                )}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            {job.priority === "medium" && (
                              <>
                                <Button size="sm" variant="outline">
                                  Auto-Send to Matches
                                </Button>
                                <Button size="sm" variant="outline">
                                  Browse & Invite
                                </Button>
                              </>
                            )}
                            {job.priority === "low" && (
                              <Button size="sm" variant="outline">
                                Browse & Invite
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              {job.status === "active" ? "Pause" : "Activate"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Monitor ongoing work and approve hours</CardDescription>
              </CardHeader>
              <CardContent>
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active jobs at the moment.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Active jobs will appear here once apprentices accept your job invitations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <Card key={job.id} className="border-blue-200">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription>
                                {job.apprenticeName} • Started {new Date(job.startDate).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge variant="default">In Progress</Badge>
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
                              <p className="text-sm font-medium">Pending Hours</p>
                              <p className="text-sm text-muted-foreground">{job.pendingHours}h</p>
                            </div>
                          </div>

                          {job.pendingHours > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                Pending Hour Approval
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                {job.apprenticeName} submitted {job.pendingHours} hours for approval
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Approve Hours
                                </Button>
                                <Button size="sm" variant="outline">
                                  Request Changes
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!job.canComplete}
                              onClick={() => router.push(`/job/${job.id}/complete`)}
                            >
                              Mark Complete
                            </Button>
                            <Button size="sm" variant="outline">
                              View Time Cards
                            </Button>
                            <Button size="sm" variant="outline">
                              Message {job.apprenticeName}
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

          <TabsContent value="browse" className="space-y-6">
            {showBrowseRestriction && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-5 w-5" />
                    Create a Job First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-3">
                    You need to create at least one job posting before you can browse apprentices.
                  </p>
                  <Button onClick={() => setShowJobForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
                    Create Job Posting
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasActiveJobs && (
              <Card>
                <CardHeader>
                  <CardTitle>Browse Apprentices</CardTitle>
                  <CardDescription>Find and invite apprentices to your active jobs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, location, or skills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Experience Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Experience</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="some-knowledge">Some Knowledge</SelectItem>
                        <SelectItem value="basic-experience">Basic Experience</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredApprentices.map((apprentice) => (
                      <Card key={apprentice.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {apprentice.firstName} {apprentice.lastName?.charAt(0)}.
                              </CardTitle>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                {apprentice.city}, {apprentice.state}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{apprentice.rating || "New"}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {apprentice.experienceLevel?.replace("-", " ") || "Beginner"}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {apprentice.availability?.replace("-", " ") || "Flexible"}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {apprentice.skills?.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {(apprentice.skills?.length || 0) > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(apprentice.skills?.length || 0) - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleInviteApprentice(apprentice)}>
                              Invite to Job
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredApprentices.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No apprentices found matching your criteria.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track payments for completed and ongoing jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Amount Owed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">${calculateOwedAmount().toFixed(2)}</div>
                        <p className="text-sm text-muted-foreground">Weekly payments due</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$4,250.00</div>
                        <p className="text-sm text-muted-foreground">Total paid</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$1,200.00</div>
                        <p className="text-sm text-muted-foreground">Awaiting completion</p>
                      </CardContent>
                    </Card>
                  </div>

                  {calculateOwedAmount() > 0 && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <CardHeader>
                        <CardTitle className="text-red-800 dark:text-red-200">Immediate Payment Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-red-700 dark:text-red-300 mb-4">
                          Jobs running longer than 1 week require weekly payments to continue.
                        </p>
                        <Button className="bg-red-600 hover:bg-red-700">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay ${calculateOwedAmount().toFixed(2)} Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Recent Transactions</h3>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Residential Wiring Assistant - Week 1</p>
                            <p className="text-sm text-muted-foreground">Marcus C. • 40 hours @ $20/hr</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$800.00</p>
                            <p className="text-sm text-green-600">Paid</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shop Profile</CardTitle>
                <CardDescription>Manage your business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Business Name</p>
                    <p className="text-muted-foreground">{currentUser.businessName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Owner Name</p>
                    <p className="text-muted-foreground">{currentUser.ownerName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {currentUser.city}, {currentUser.state}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">License Number</p>
                    <p className="text-muted-foreground">{currentUser.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{currentUser.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
