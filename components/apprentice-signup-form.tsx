"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUser } from "@/lib/storage" // Assuming createUser is now in lib/storage

export function ApprenticeSignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    goals: "",
    bio: "",
    profileImage: "",
    bankAccount: "",
    routingNumber: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSkillsChange = (skill: string, isChecked: boolean) => {
    setFormData((prev) => {
      const newSkills = isChecked ? [...prev.skills, skill] : prev.skills.filter((s) => s !== skill)
      return { ...prev, skills: newSkills }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const newUser = await createUser({
        type: "apprentice",
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        dateOfBirth: formData.dateOfBirth,
        experienceLevel: formData.experienceLevel,
        education: formData.education,
        schoolName: formData.schoolName,
        major: formData.major,
        hoursCompleted: formData.hoursCompleted,
        availability: formData.availability,
        transportation: formData.transportation,
        willingToTravel: formData.willingToTravel,
        skills: formData.skills,
        goals: formData.goals,
        bio: formData.bio,
        profileImage: formData.profileImage,
        bankAccount: formData.bankAccount,
        routingNumber: formData.routingNumber,
      })
      console.log("Apprentice signed up successfully:", newUser)
      router.push("/login") // Redirect to login page after successful signup
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to sign up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const commonSkills = [
    "Wiring Installation",
    "Circuit Troubleshooting",
    "Panel Upgrades",
    "Fixture Installation",
    "Safety Protocols",
    "Blueprint Reading",
    "Conduit Bending",
    "Low Voltage Systems",
    "Generators",
    "Renewable Energy",
  ]

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Apprentice Sign Up</CardTitle>
        <CardDescription>Enter your details to create an apprentice account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Springfield" required value={formData.city} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="IL" required value={formData.state} onChange={handleChange} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" placeholder="62704" value={formData.zipCode} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select
              onValueChange={(value) => handleSelectChange("experienceLevel", value)}
              value={formData.experienceLevel}
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-experience">No Experience</SelectItem>
                <SelectItem value="basic-experience">Basic Experience</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="education">Education</Label>
            <Select onValueChange={(value) => handleSelectChange("education", value)} value={formData.education}>
              <SelectTrigger id="education">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="vocational">Vocational/Trade School</SelectItem>
                <SelectItem value="associates">Associate's Degree</SelectItem>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.education === "vocational" ||
          formData.education === "associates" ||
          formData.education === "bachelors" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  placeholder="ABC Trade School"
                  value={formData.schoolName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="major">Major/Program</Label>
                <Input id="major" placeholder="Electrical Technology" value={formData.major} onChange={handleChange} />
              </div>
            </>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="hoursCompleted">Hours Completed (if applicable)</Label>
            <Input
              id="hoursCompleted"
              placeholder="e.g., 1500"
              value={formData.hoursCompleted}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availability">Availability</Label>
            <Select onValueChange={(value) => handleSelectChange("availability", value)} value={formData.availability}>
              <SelectTrigger id="availability">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="weekends">Weekends Only</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transportation"
              checked={formData.transportation}
              onCheckedChange={(checked) => handleSelectChange("transportation", String(checked))}
            />
            <Label htmlFor="transportation">I have reliable transportation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="willingToTravel"
              checked={formData.willingToTravel}
              onCheckedChange={(checked) => handleSelectChange("willingToTravel", String(checked))}
            />
            <Label htmlFor="willingToTravel">I am willing to travel for jobs</Label>
          </div>
          <div className="grid gap-2">
            <Label>Skills</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={(checked) => handleSkillsChange(skill, Boolean(checked))}
                  />
                  <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goals">Career Goals</Label>
            <Textarea
              id="goals"
              placeholder="Describe your career goals..."
              value={formData.goals}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} />
          </div>
          {/* Optional: Profile Image Upload (placeholder for now) */}
          {/* <div className="grid gap-2">
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input
              id="profileImage"
              placeholder="https://example.com/my-profile.jpg"
              value={formData.profileImage}
              onChange={handleChange}
            />
          </div> */}
          {/* Optional: Bank Account Details (placeholder for now) */}
          {/* <div className="grid gap-2">
            <Label htmlFor="bankAccount">Bank Account Number</Label>
            <Input
              id="bankAccount"
              placeholder="123456789"
              value={formData.bankAccount}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input
              id="routingNumber"
              placeholder="987654321"
              value={formData.routingNumber}
              onChange={handleChange}
            />
          </div> */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
