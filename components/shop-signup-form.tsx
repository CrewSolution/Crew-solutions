"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function ShopSignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    ownerName: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    businessType: "",
    yearsInBusiness: "",
    licenseNumber: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          type: "shop",
          email: formData.email,
          password: formData.password,
          first_name: formData.ownerName.split(" ")[0] || null, // Extract first name from ownerName
          last_name: formData.ownerName.split(" ")[1] || null, // Extract last name from ownerName
          business_name: formData.businessName,
          owner_name: formData.ownerName,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          business_type: formData.businessType,
          years_in_business: formData.yearsInBusiness ? Number.parseInt(formData.yearsInBusiness) : null,
          license_number: formData.licenseNumber,
          bio: formData.bio,
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
          <Label htmlFor="businessName" className="text-gray-700">
            Electrical Business Name *
          </Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            required
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerName" className="text-gray-700">
            Owner Name *
          </Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleChange("ownerName", e.target.value)}
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
          <Label htmlFor="businessType" className="text-gray-700">
            Electrical Business Type
          </Label>
          <Select onValueChange={(value) => handleChange("businessType", value)}>
            <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential Electrical</SelectItem>
              <SelectItem value="commercial">Commercial Electrical</SelectItem>
              <SelectItem value="industrial">Industrial Electrical</SelectItem>
              <SelectItem value="specialty">Specialty Electrical</SelectItem>
              <SelectItem value="other_electrical">Other Electrical</SelectItem>
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
          <Label htmlFor="yearsInBusiness" className="text-gray-700">
            Years in Electrical Business
          </Label>
          <Input
            id="yearsInBusiness"
            type="number"
            value={formData.yearsInBusiness}
            onChange={(e) => handleChange("yearsInBusiness", e.target.value)}
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="text-gray-700">
            Electrical License Number
          </Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => handleChange("licenseNumber", e.target.value)}
            className="border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700">
          Electrical Business Description
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Tell us about your electrical business..."
          className="border-yellow-200 focus:border-yellow-500"
        />
      </div>

      <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Electrical Shop Account"}
      </Button>
    </form>
  )
}
