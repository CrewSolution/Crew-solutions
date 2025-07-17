"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function ApprenticeSignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    experienceLevel: "",
    availability: "",
    hourlyRateMin: "",
    hourlyRateMax: "",
    education: "",
    bio: "",
    willingToTravel: false,
    hasOwnTools: false,
    hasTransportation: false,
  })
  const [skills, setSkills] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const availableSkills = [
    "Wiring Installation",
    "Circuit Analysis",
    "Blueprint Reading",
    "Safety Protocols",
    "Hand Tools",
    "Power Tools",
    "Conduit Bending",
    "Panel Installation",
    "Motor Controls",
    "Troubleshooting",
  ]

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "apprentice",
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          experience_level: formData.experienceLevel,
          availability: formData.availability,
          hourly_rate_min: formData.hourlyRateMin ? Number.parseFloat(formData.hourlyRateMin) : null,
          hourly_rate_max: formData.hourlyRateMax ? Number.parseFloat(formData.hourlyRateMax) : null,
          education: formData.education,
          bio: formData.bio,
          skills: skills,
          willing_to_travel: formData.willingToTravel,
          has_own_tools: formData.hasOwnTools,
          has_transportation: formData.hasTransportation,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Crew Solutions",
        })
        router.push("/login")
      } else {
        toast({
          title: "Signup failed",
          description: data.error || "An error occurred during signup",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Signup error",
        description: "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          className="border-yellow-200 focus:border-yellow-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            Password *
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700">
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceLevel" className="text-gray-700">
            Experience Level *
          </Label>
          <Select onValueChange={(value) => handleChange("experienceLevel", value)}>
            <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="basic">Basic Experience</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-gray-700">
            City *
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-gray-700">
            State *
          </Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-gray-700">
            Zip Code
          </Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="availability" className="text-gray-700">
            Availability
          </Label>
          <Select onValueChange={(value) => handleChange("availability", value)}>
            <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="weekends">Weekends only</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="education" className="text-gray-700">
            Education
          </Label>
          <Input
            id="education"
            value={formData.education}
            onChange={(e) => handleChange("education", e.target.value)}
            placeholder="e.g., Trade School, Community College"
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRateMin" className="text-gray-700">
            Min Hourly Rate ($)
          </Label>
          <Input
            id="hourlyRateMin"
            type="number"
            value={formData.hourlyRateMin}
            onChange={(e) => handleChange("hourlyRateMin", e.target.value)}
            placeholder="18"
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hourlyRateMax" className="text-gray-700">
            Max Hourly Rate ($)
          </Label>
          <Input
            id="hourlyRateMax"
            type="number"
            value={formData.hourlyRateMax}
            onChange={(e) => handleChange("hourlyRateMax", e.target.value)}
            placeholder="25"
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Skills</Label>
        <div className="grid grid-cols-2 gap-2">
          {availableSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={skills.includes(skill)}
                onCheckedChange={() => handleSkillToggle(skill)}
                className="border-yellow-300 data-[state=checked]:bg-yellow-500"
              />
              <Label htmlFor={skill} className="text-sm text-gray-700">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="willingToTravel"
            checked={formData.willingToTravel}
            onCheckedChange={(checked) => handleChange("willingToTravel", checked as boolean)}
            className="border-yellow-300 data-[state=checked]:bg-yellow-500"
          />
          <Label htmlFor="willingToTravel" className="text-gray-700">
            Willing to travel for work
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasOwnTools"
            checked={formData.hasOwnTools}
            onCheckedChange={(checked) => handleChange("hasOwnTools", checked as boolean)}
            className="border-yellow-300 data-[state=checked]:bg-yellow-500"
          />
          <Label htmlFor="hasOwnTools" className="text-gray-700">
            I have my own tools
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasTransportation"
            checked={formData.hasTransportation}
            onCheckedChange={(checked) => handleChange("hasTransportation", checked as boolean)}
            className="border-yellow-300 data-[state=checked]:bg-yellow-500"
          />
          <Label htmlFor="hasTransportation" className="text-gray-700">
            I have reliable transportation
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Tell us about yourself and your experience..."
          className="border-yellow-200 focus:border-yellow-500"
        />
      </div>

      <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Apprentice Account"}
      </Button>
    </form>
  )
}
