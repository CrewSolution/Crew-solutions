"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"
import { ShopSignupForm } from "@/components/shop-signup-form"
import { ApprenticeSignupForm } from "@/components/apprentice-signup-form"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("shop")

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "apprentice" || type === "shop") {
      setActiveTab(type)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Zap className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">Crew Solutions</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-yellow-600 hover:text-yellow-500">
              Sign in here
            </Link>
          </p>
        </div>

        <Card className="border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-600">Join Crew Solutions</CardTitle>
            <CardDescription className="text-gray-600">Choose your account type to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-yellow-100">
                <TabsTrigger value="shop" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                  Shop Owner
                </TabsTrigger>
                <TabsTrigger
                  value="apprentice"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                >
                  Apprentice
                </TabsTrigger>
              </TabsList>
              <TabsContent value="shop" className="mt-6">
                <ShopSignupForm />
              </TabsContent>
              <TabsContent value="apprentice" className="mt-6">
                <ApprenticeSignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
