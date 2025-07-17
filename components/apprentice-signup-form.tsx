"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { saveUser } from "@/lib/storage"
import type { User } from "@/lib/types"
import Link from "next/link"

export function ApprenticeSignupForm() {
  const [formData, setFormData] = useState<Partial<User>>({
    type: "apprentice",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    date_of_birth: "",
    experience_level: "",
    education: "",
    school_name: "",
    major: "",
    hours_completed: 0,
    availability: "",
    transportation: false,
    willing_to_travel: false,
    skills: [],
    goals: "",
    bio: "",
    profile_complete: false,
  })
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, skills: value.split(",").map((s) => s.trim()) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "You must agree to the Terms and Conditions to sign up.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newUser = await saveUser(formData)
      toast({
        title: "Account Created!",
        description: "Your apprentice account has been successfully created. Please log in.",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Apprentice Sign Up</CardTitle>
        <CardDescription>Create your apprentice profile to find job opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" placeholder="John" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" placeholder="Doe" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" placeholder="789 Pine St" value={formData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="San Francisco" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="CA" value={formData.state} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip_code">Zip Code</Label>
            <Input id="zip_code" placeholder="94103" value={formData.zip_code} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select onValueChange={(value) => handleSelectChange("experience_level", value)} required>
              <SelectTrigger id="experience_level">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-experience">No Experience</SelectItem>
                <SelectItem value="basic-experience">Basic Experience (0-1 year)</SelectItem>
                <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                <SelectItem value="journeyman">Journeyman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="education">Highest Education</Label>
            <Select onValueChange={(value) => handleSelectChange("education", value)}>
              <SelectTrigger id="education">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="vocational">Vocational/Trade School</SelectItem>
                <SelectItem value="associates">Associate's Degree</SelectItem>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.education && formData.education !== "high-school" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="school_name">School Name</Label>
                <Input
                  id="school_name"
                  placeholder="ABC Trade School"
                  value={formData.school_name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="major">Major/Program</Label>
                <Input id="major" placeholder="Electrical Technology" value={formData.major} onChange={handleChange} />
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="hours_completed">Hours Completed (if applicable)</Label>
            <Input id="hours_completed" type="number" value={formData.hours_completed} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availability">Availability</Label>
            <Select onValueChange={(value) => handleSelectChange("availability", value)} required>
              <SelectTrigger id="availability">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="weekends">Weekends Only</SelectItem>
                <SelectItem value="on-call">On-call</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transportation"
              checked={formData.transportation}
              onCheckedChange={(checked) => handleCheckboxChange("transportation", !!checked)}
            />
            <Label htmlFor="transportation">I have reliable transportation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="willing_to_travel"
              checked={formData.willing_to_travel}
              onCheckedChange={(checked) => handleCheckboxChange("willing_to_travel", !!checked)}
            />
            <Label htmlFor="willing_to_travel">I am willing to travel for work</Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              placeholder="e.g., Wiring, Plumbing, HVAC, Carpentry"
              value={formData.skills?.join(", ") || ""}
              onChange={handleSkillsChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goals">Career Goals</Label>
            <Textarea
              id="goals"
              placeholder="Describe your career aspirations..."
              value={formData.goals}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(!!checked)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link href="/terms" className="underline" prefetch={false}>
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline" prefetch={false}>
                Privacy Policy
              </Link>
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
