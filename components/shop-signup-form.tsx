"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { saveUser } from "@/lib/storage"
import type { User } from "@/lib/types"

export function ShopSignupForm() {
  const [formData, setFormData] = useState<Partial<User>>({
    type: "shop",
    business_name: "",
    owner_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    business_type: "",
    license_number: "",
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
        description: "Your shop account has been successfully created. Please log in.",
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
        <CardTitle className="text-2xl">Shop Sign Up</CardTitle>
        <CardDescription>Create your shop account to connect with skilled apprentices.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              placeholder="Acme Electric Co."
              value={formData.business_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="owner_name">Owner's Name</Label>
            <Input
              id="owner_name"
              placeholder="John Doe"
              value={formData.owner_name}
              onChange={handleChange}
              required
            />
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
            <Label htmlFor="address">Business Address</Label>
            <Input id="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} required />
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
            <Label htmlFor="business_type">Type of Business</Label>
            <Select onValueChange={(value) => handleSelectChange("business_type", value)} required>
              <SelectTrigger id="business_type">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
                <SelectItem value="general_contractor">General Contractor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="license_number">License Number (Optional)</Label>
            <Input
              id="license_number"
              placeholder="C10-123456"
              value={formData.license_number}
              onChange={handleChange}
            />
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
