"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Zap,
  Briefcase,
  UserCheck,
  FileText,
  DollarSign,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
} from "lucide-react"

const apprenticeProfiles = [
  {
    id: 1,
    name: "Marcus C.",
    age: 24,
    location: "San Francisco, CA",
    experience: "Basic Experience",
    rating: 4.8,
    skills: ["Wiring Installation", "Safety Protocols", "Hand Tools"],
    availability: "Full-time",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Sofia R.",
    age: 22,
    location: "Oakland, CA",
    experience: "Some Knowledge",
    rating: 4.6,
    skills: ["Basic Electrical Theory", "Circuit Analysis", "Blueprint Reading"],
    availability: "Part-time",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "David K.",
    age: 26,
    location: "San Jose, CA",
    experience: "Intermediate",
    rating: 4.9,
    skills: ["Motor Controls", "Panel Installation", "Conduit Bending"],
    availability: "Full-time",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Ashley T.",
    age: 23,
    location: "Fremont, CA",
    experience: "Basic Experience",
    rating: 4.7,
    skills: ["Wiring Installation", "Power Tools", "Safety Protocols"],
    availability: "Flexible",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function Home() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % apprenticeProfiles.length)
  }

  const prevProfile = () => {
    setCurrentProfileIndex((prev) => (prev - 1 + apprenticeProfiles.length) % apprenticeProfiles.length)
  }

  const currentProfile = apprenticeProfiles[currentProfileIndex]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold">Crew Solutions</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit border-yellow-500 text-yellow-700 dark:text-yellow-400">
                    Connecting Talent with Opportunity
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Simplifying Electrical Apprenticeship Hiring
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Crew Solutions connects electrical businesses with vetted apprentices while handling all the
                    administrative overhead.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
                    <Link href="/signup?type=shop">I'm a Shop Owner</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-gray-800 bg-transparent"
                    asChild
                  >
                    <Link href="/signup?type=apprentice">I'm an Apprentice</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="relative w-full max-w-sm mx-auto">
                  <h3 className="text-lg font-semibold mb-4 text-center">Available Apprentices</h3>

                  {/* Navigation Arrows */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg"
                    onClick={prevProfile}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg"
                    onClick={nextProfile}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Profile Card */}
                  <Card className="mx-8 shadow-lg">
                    <CardHeader className="text-center pb-2">
                      <img
                        src={currentProfile.image || "/placeholder.svg"}
                        alt={currentProfile.name}
                        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                      />
                      <CardTitle className="text-xl">{currentProfile.name}</CardTitle>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {currentProfile.location}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{currentProfile.experience}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{currentProfile.rating}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentProfile.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{currentProfile.availability}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Pass
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profile Indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {apprenticeProfiles.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentProfileIndex ? "bg-yellow-500" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentProfileIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Match notification - moved further down and to the left */}
                <div className="absolute -bottom-24 -left-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Perfect Match!</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {currentProfile.name} matches 94% of your requirements
                  </p>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm dark:bg-yellow-800/30">
                  Our Platform
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Solving Real Industry Problems</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our two-sided platform removes barriers for both electrical shops and aspiring apprentices.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Briefcase className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Simplified Hiring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Post openings and browse pre-vetted apprentice profiles to find the perfect match for your shop.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <UserCheck className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Vetted Talent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    All apprentices complete skill assessments and background checks before joining our platform.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <FileText className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Admin Handled</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We manage payroll, insurance, benefits, and compliance so you can focus on your business.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Cost Effective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reduce hiring costs and administrative overhead while finding quality apprentices.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <ShieldCheck className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Risk Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We handle liability concerns, insurance requirements, and regulatory compliance.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Time Saving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Spend less time on paperwork and more time growing your electrical business.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm dark:bg-yellow-800/30">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Process, Powerful Results</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform makes it easy for both shops and apprentices to connect and work together.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12">
              <Tabs defaultValue="shops" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="shops">For Electrical Shops</TabsTrigger>
                  <TabsTrigger value="apprentices">For Apprentices</TabsTrigger>
                </TabsList>
                <TabsContent value="shops" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
                            1
                          </div>
                          <span>Create Profile</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Sign up and create your shop profile with details about your business.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
                            2
                          </div>
                          <span>{"Select Apprentice"}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {"Easily find the right apprentice based on skills, location, and availability.\n"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
                            3
                          </div>
                          <span>We Handle the Rest</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Once matched, we handle all payroll, insurance, and administrative tasks.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="apprentices" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
                            1
                          </div>
                          <span>Create Profile</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Sign up and create your profile with your skills, certifications, and career goals.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
                            2
                          </div>
                          <span>Complete Assessment</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Take our skill assessment to verify your knowledge and showcase your abilities.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
                            3
                          </div>
                          <span>Get Matched</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get matched with local electrical shops and start building your career with benefits.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm dark:bg-yellow-800/30">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Success Stories</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hear from shops and apprentices who have found success with Crew Solutions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 mt-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Mike Johnson"
                      className="rounded-full h-12 w-12 object-cover"
                      width={60}
                      height={60}
                    />
                    <div>
                      <CardTitle className="text-lg">Mike Johnson</CardTitle>
                      <CardDescription>Owner, Johnson Electric - Palo Alto</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "Crew Solutions has transformed how I find and manage apprentices. The administrative support alone
                    has saved me countless hours, and the quality of candidates has been exceptional."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Sarah Martinez"
                      className="rounded-full h-12 w-12 object-cover"
                      width={60}
                      height={60}
                    />
                    <div>
                      <CardTitle className="text-lg">Sarah Martinez</CardTitle>
                      <CardDescription>Electrical Apprentice - San Jose</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "Finding an apprenticeship was a struggle until I discovered Crew Solutions. Within two weeks, I was
                    matched with a great local shop where I'm gaining valuable experience while receiving benefits."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-yellow-500 text-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Hiring?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join Crew Solutions today and experience the difference for your electrical business or apprenticeship
                  journey.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white" asChild>
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black text-black hover:bg-yellow-400 bg-transparent"
                >
                  Request a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="w-full py-12 md:py-24 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-bold">Crew Solutions</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connecting electrical shops with vetted apprentices while handling all the administrative overhead.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="#" className="hover:underline">
                    For Shops
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    For Apprentices
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="#" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="mailto:info@crewsolutions.com" className="hover:underline">
                    info@crewsolutions.work
                  </Link>
                </li>
                <li>
                  <Link href="tel:+1234567890" className="hover:underline">
                    {""}
                  </Link>
                </li>
                <li>{""}</li>
                <li>{""}</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Crew Solutions, LLC. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Terms
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Privacy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
