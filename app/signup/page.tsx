"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShopSignupForm } from "@/components/shop-signup-form"
import { ApprenticeSignupForm } from "@/components/apprentice-signup-form"

export default function SignupPage() {
  const [userType, setUserType] = useState<"shop" | "apprentice">("shop")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Join Crew Solutions</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up as a shop owner or an apprentice electrician.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant={userType === "shop" ? "default" : "outline"} onClick={() => setUserType("shop")}>
            I am a Shop
          </Button>
          <Button variant={userType === "apprentice" ? "default" : "outline"} onClick={() => setUserType("apprentice")}>
            I am an Apprentice
          </Button>
        </div>
        {userType === "shop" ? <ShopSignupForm /> : <ApprenticeSignupForm />}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
