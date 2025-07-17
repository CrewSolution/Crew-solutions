"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

export default function LandingPage() {
  // Hardcoded demo data for apprentice profiles on the landing page
  const apprenticeProfiles = [
    {
      id: "apprentice-demo-1",
      firstName: "Marcus",
      lastName: "C", // Initial for privacy
      city: "San Francisco",
      state: "CA",
      rating: 4.6,
      experienceLevel: "Basic Experience",
      skills: ["Wiring Installation", "Safety Protocols"],
      availability: "Full-time",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "apprentice-demo-2",
      firstName: "Sarah",
      lastName: "L",
      city: "Oakland",
      state: "CA",
      rating: 4.9,
      experienceLevel: "Intermediate",
      skills: ["Circuit Analysis", "Blueprint Reading"],
      availability: "Part-time",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "apprentice-demo-3",
      firstName: "David",
      lastName: "P",
      city: "San Jose",
      state: "CA",
      rating: 4.5,
      experienceLevel: "Some Knowledge",
      skills: ["Hand Tools", "Power Tools"],
      availability: "Weekends only",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold">Crew Solutions</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/signup" className="text-sm font-medium hover:underline underline-offset-4">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect with Top Electrical Apprentices
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Find skilled electrical apprentices for your projects, or discover job opportunities as an
                    apprentice.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup?type=shop"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-600 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-700 disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Hire an Apprentice
                  </Link>
                  <Link
                    href="/signup?type=apprentice"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                  >
                    Find a Job
                  </Link>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  width="400"
                  height="400"
                  alt="Hero"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                />
                {/* Perfect Match! box moved down and left */}
                <Card className="absolute bottom-4 left-4 w-64 bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">Perfect Match!</CardTitle>
                    <CardDescription className="text-sm">You've found a great apprentice.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-3 p-4 pt-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=50&width=50" />
                      <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Alex P.</p>
                      <p className="text-sm text-gray-500">4.9 Stars</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Top Apprentices</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Browse through a selection of highly-rated electrical apprentices ready for your next project.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {apprenticeProfiles.map((profile) => (
                <Card key={profile.id} className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={profile.profileImage || "/placeholder.svg"}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback>
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">
                    {profile.firstName} {profile.lastName}.
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {profile.city}, {profile.state}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500 mt-2">
                    {[...Array(Math.floor(profile.rating))].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-current" />
                    ))}
                    {profile.rating % 1 !== 0 && <StarHalfIcon className="w-5 h-5 fill-current" />}
                    <span className="text-gray-600 dark:text-gray-400 ml-1 text-sm">({profile.rating})</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Badge variant="secondary">{profile.experienceLevel}</Badge>
                    <Badge variant="secondary">{profile.availability}</Badge>
                    {profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-6 bg-transparent">
                    View Profile
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <p className="max-w-[900px] mx-auto mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our platform simplifies the process of connecting shops with qualified electrical apprentices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-full">
                  <UserPlusIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold">1. Sign Up</h3>
                <p className="text-gray-500 dark:text-gray-400">Create your shop or apprentice profile in minutes.</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-full">
                  <SearchIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold">2. Find Your Match</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Shops post jobs, apprentices browse opportunities. Our system helps find the perfect fit.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-full">
                  <HandshakeIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold">3. Get to Work</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Connect, collaborate, and complete projects efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2023 Crew Solutions. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function StarHalfIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" />
    </svg>
  )
}

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function HandshakeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m11 17 2 2 4-4" />
      <path d="m5 12 2 2 4-4" />
      <path d="M7 19H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    </svg>
  )
}
