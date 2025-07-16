"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function ApprenticeSignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    experienceLevel: "",
    education: "",
    schoolName: "",
    major: "",
    hoursCompleted: "",
    availability: "",
    transportation: false,
    willingToTravel: false,
    skills: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [acceptTerms, setAcceptTerms] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!acceptTerms) {
      toast({
        title: "Terms required",
        description: "Please accept the Terms of Service to continue",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const newUser = {
        id: Date.now().toString(),
        type: "apprentice",
        ...formData,
        createdAt: new Date().toISOString(),
        profileComplete: true,
        rating: 0,
        jobsCompleted: 0,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      toast({
        title: "Account created successfully",
        description: "Welcome to Crew Solutions!",
      })

      router.push("/dashboard/apprentice")
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill]
    handleChange("skills", updatedSkills)
  }

  const renderEducationFollowUp = () => {
    if (!formData.education) return null

    switch (formData.education) {
      case "high-school":
        return (
          <div className="space-y-2">
            <Label htmlFor="schoolName">High School Name</Label>
            <Input
              id="schoolName"
              value={formData.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              placeholder="Enter your high school name"
            />
          </div>
        )
      case "trade-school":
        return (
          <div className="space-y-2">
            <Label htmlFor="schoolName">Trade School Name</Label>
            <Input
              id="schoolName"
              value={formData.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              placeholder="Enter your trade school name"
            />
          </div>
        )
      case "community-college":
        return (
          <div className="space-y-2">
            <Label htmlFor="schoolName">Community College Name</Label>
            <Input
              id="schoolName"
              value={formData.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              placeholder="Enter your community college name"
            />
          </div>
        )
      case "bachelors":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">College/University Name</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => handleChange("schoolName", e.target.value)}
                placeholder="Enter your college name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => handleChange("major", e.target.value)}
                placeholder="Enter your major"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            placeholder="Create a strong password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Experience Level *</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => handleChange("experienceLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Complete Beginner</SelectItem>
              <SelectItem value="some-knowledge">Some Knowledge</SelectItem>
              <SelectItem value="basic-experience">Basic Experience</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          required
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
            placeholder="San Francisco"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            required
            placeholder="CA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            required
            placeholder="94102"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education Level *</Label>
        <Select value={formData.education} onValueChange={(value) => handleChange("education", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select education" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="high-school">High School Diploma/GED</SelectItem>
            <SelectItem value="trade-school">Trade School</SelectItem>
            <SelectItem value="community-college">Community College</SelectItem>
            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderEducationFollowUp()}

      <div className="space-y-2">
        <Label htmlFor="hoursCompleted">Electrical Hours Completed</Label>
        <Input
          id="hoursCompleted"
          type="number"
          value={formData.hoursCompleted}
          onChange={(e) => handleChange("hoursCompleted", e.target.value)}
          placeholder="0"
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability *</Label>
        <Select value={formData.availability} onValueChange={(value) => handleChange("availability", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
            <SelectItem value="part-time">Part-time (20-39 hours/week)</SelectItem>
            <SelectItem value="weekends">Weekends only</SelectItem>
            <SelectItem value="evenings">Evenings only</SelectItem>
            <SelectItem value="flexible">Flexible schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Skills & Knowledge (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {skillOptions.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={formData.skills.includes(skill)}
                onCheckedChange={() => handleSkillToggle(skill)}
              />
              <Label htmlFor={skill} className="text-sm font-normal">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="transportation"
            checked={formData.transportation}
            onCheckedChange={(checked) => handleChange("transportation", checked as boolean)}
          />
          <Label htmlFor="transportation">I have reliable transportation</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="willingToTravel"
            checked={formData.willingToTravel}
            onCheckedChange={(checked) => handleChange("willingToTravel", checked as boolean)}
          />
          <Label htmlFor="willingToTravel">Willing to travel for work (within Bay Area)</Label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-yellow-600 hover:text-yellow-500 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-yellow-600 hover:text-yellow-500 underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
        {isLoading ? "Creating Account..." : "Create Apprentice Account"}
      </Button>
    </form>
  )
}
