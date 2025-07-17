"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // Store user data in localStorage for demo purposes
        localStorage.setItem("currentUser", JSON.stringify(data.user))

        // Redirect based on user type
        if (data.user.type === "shop") {
          router.push("/dashboard/shop")
        } else {
          router.push("/dashboard/apprentice")
        }
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Zap className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">Crew Solutions</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/signup" className="font-medium text-yellow-600 hover:text-yellow-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card className="border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-600">Welcome back</CardTitle>
            <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-yellow-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-yellow-600 hover:text-yellow-500">
                  Forgot your password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Accounts</h3>
              <div className="space-y-2 text-xs text-yellow-700">
                <div>
                  <strong>Shop Owner:</strong> shop@example.com / password123
                </div>
                <div>
                  <strong>Apprentice:</strong> apprentice@example.com / password123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
