"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { saveUser, getUsers, setCurrentUser, type User } from "@/lib/storage"

export function ShopSignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    businessType: "",
    licenseNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [acceptTerms, setAcceptTerms] = useState(false)

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

    // Check if email already exists
    const existingUsers = getUsers()
    if (existingUsers.some((u) => u.email === formData.email)) {
      toast({
        title: "Email already exists",
        description: "An account with this email already exists",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const newUser: User = {
        id: `shop-${Date.now()}`,
        type: "shop",
        ...formData,
        createdAt: new Date().toISOString(),
        profileComplete: true,
        rating: 0,
        jobsCompleted: 0,
      }

      saveUser(newUser)
      setCurrentUser(newUser)

      toast({
        title: "Account created successfully",
        description: "Welcome to Crew Solutions!",
      })

      router.push("/dashboard/shop")
    } catch (error) {
      toast({
        title: "Error creating account",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Electrical License Number *</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => handleChange("licenseNumber", e.target.value)}
            required
            placeholder="Enter your license number"
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
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            required
            placeholder="ABC Electrical Services"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleChange("ownerName", e.target.value)}
            required
            placeholder="John Smith"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Business Address *</Label>
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
            placeholder="Anytown"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            required
            placeholder="State"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            required
            placeholder="12345"
          />
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
        {isLoading ? "Creating Account..." : "Create Shop Account"}
      </Button>
    </form>
  )
}
