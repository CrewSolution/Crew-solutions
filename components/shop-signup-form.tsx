"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUser } from "@/lib/storage" // Assuming createUser is now in lib/storage

export function ShopSignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const newUser = await createUser({
        type: "shop",
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        businessType: formData.businessType,
        licenseNumber: formData.licenseNumber,
      })
      console.log("Shop signed up successfully:", newUser)
      router.push("/login") // Redirect to login page after successful signup
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to sign up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Shop Sign Up</CardTitle>
        <CardDescription>Enter your business details to create an account.</CardDescription>
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
          <div className="grid gap-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Electric Solutions Inc."
              required
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ownerName">Owner's Name</Label>
            <Input id="ownerName" placeholder="John Doe" required value={formData.ownerName} onChange={handleChange} />
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
            <Label htmlFor="businessType">Business Type</Label>
            <Select onValueChange={(value) => handleSelectChange("businessType", value)} value={formData.businessType}>
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input id="licenseNumber" placeholder="C10-XXXXXX" value={formData.licenseNumber} onChange={handleChange} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
