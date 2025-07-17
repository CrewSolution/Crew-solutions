"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Wrench, Lightbulb, Handshake, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-yellow-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Zap className="h-8 w-8" />
            <span>Crew Solutions</span>
          </Link>
          <nav className="space-x-4">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex h-[600px] items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background pattern or image */}
          <svg className="absolute inset-0 h-full w-full stroke-yellow-300 opacity-20" fill="none">
            <defs>
              <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight">Connect Electrical Shops with Top Apprentices</h1>
          <p className="mb-8 text-xl">
            Streamline your hiring process and find skilled electrical talent for your projects.
          </p>
          <div className="space-x-4">
            <Button asChild className="bg-white text-yellow-600 hover:bg-gray-100">
              <Link href="/signup?type=shop">Join as a Shop</Link>
            </Button>
            <Button asChild className="border border-white bg-transparent hover:bg-white hover:text-yellow-600">
              <Link href="/signup?type=apprentice">Join as an Apprentice</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Platform Section */}
      <section id="platform" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="mb-12 text-4xl font-bold text-gray-800">Our Platform</h2>

          {/* Features */}
          <div id="features" className="mb-16">
            <h3 className="mb-8 text-3xl font-semibold text-gray-700">Features</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <Wrench className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                  <CardTitle className="text-xl font-semibold">Job Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Intelligent algorithms connect electrical shops with apprentices whose skills and availability match
                    job requirements.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <Lightbulb className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                  <CardTitle className="text-xl font-semibold">Profile Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Apprentices can showcase their electrical skills, experience, and certifications. Shops can create
                    detailed job postings.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <Handshake className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                  <CardTitle className="text-xl font-semibold">Seamless Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Built-in messaging and notification systems facilitate easy communication between shops and
                    apprentices.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it Works */}
          <div id="how-it-works" className="mb-16">
            <h3 className="mb-8 text-3xl font-semibold text-gray-700">How it Works</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-yellow-600">1.</CardTitle>
                  <CardDescription className="text-lg font-medium">Sign Up</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Create your electrical shop or apprentice profile in minutes.</p>
                </CardContent>
              </Card>
              <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-yellow-600">2.</CardTitle>
                  <CardDescription className="text-lg font-medium">Match & Connect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Shops post electrical jobs, apprentices find matching opportunities. Connect directly.</p>
                </CardContent>
              </Card>
              <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-yellow-600">3.</CardTitle>
                  <CardDescription className="text-lg font-medium">Get to Work</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Apprentices start working, track hours, and get paid. Shops get the job done.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonial */}
          <div id="testimonial" className="mb-16 bg-yellow-100 p-8 rounded-lg shadow-inner">
            <h3 className="mb-8 text-3xl font-semibold text-gray-700">What Our Users Say</h3>
            <div className="max-w-3xl mx-auto">
              <Card className="bg-white p-6 shadow-md">
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <p className="text-lg italic text-gray-700 mb-4">
                    "Crew Solutions has revolutionized how we find skilled electrical apprentices. The matching system
                    is incredibly accurate, and the communication tools are a game-changer. Highly recommend for any
                    electrical business!"
                  </p>
                  <p className="font-semibold text-yellow-600">- Jane Doe, Owner of Spark Innovations</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact */}
          <div id="contact" className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="mb-8 text-3xl font-semibold text-gray-700">Contact Us</h3>
            <p className="mb-6 text-gray-600">Have questions? We'd love to hear from you!</p>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="h-6 w-6 text-yellow-500" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span>info@crewsolutionselectric.com</span>
              </div>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
                <Link href="/contact">Send us a message</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 p-8 text-white">
        <div className="container mx-auto text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            <span className="text-xl font-bold">Crew Solutions</span>
          </div>
          <nav className="mb-4 space-x-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </nav>
          <p className="text-sm">&copy; 2024 Crew Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
