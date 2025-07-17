import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  Zap,
  StarIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
  GraduationCapIcon,
  Users,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function LandingPage() {
  // Hardcoded demo apprentice profiles, now tailored for electricians
  const apprenticeProfiles = [
    {
      id: "demo-apprentice-1",
      name: "Marcus Chen",
      title: "Electrical Apprentice",
      rating: 4.8,
      jobsCompleted: 12,
      location: "San Francisco, CA",
      experience: "2 years experience",
      education: "Trade School Graduate",
      skills: ["Wiring", "Troubleshooting", "Safety Protocols", "Blueprint Reading"],
      bio: "Dedicated electrical apprentice with 2 years of hands-on experience in residential and commercial projects. Eager to learn and contribute to a dynamic team.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "demo-apprentice-2",
      name: "Sarah Lee",
      title: "Electrical Apprentice",
      rating: 4.7,
      jobsCompleted: 9,
      location: "Oakland, CA",
      experience: "1.5 years experience",
      education: "Community College Program",
      skills: ["Circuit Analysis", "Panel Installation", "Conduit Bending", "Motor Controls"],
      bio: "Enthusiastic electrical apprentice committed to mastering the trade. Proficient in various electrical techniques and always ready for a new challenge.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "demo-apprentice-3",
      name: "David Kim",
      title: "Electrical Apprentice",
      rating: 4.9,
      jobsCompleted: 15,
      location: "San Jose, CA",
      experience: "3 years experience",
      education: "Vocational Training",
      skills: ["Industrial Wiring", "High Voltage Systems", "PLC Programming", "Electrical Code Compliance"],
      bio: "Experienced electrical apprentice specializing in industrial and commercial electrical systems. Detail-oriented and committed to quality work.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "demo-apprentice-4",
      name: "Jessica Brown",
      title: "Electrical Apprentice",
      rating: 4.6,
      jobsCompleted: 10,
      location: "Berkeley, CA",
      experience: "1 year experience",
      education: "Apprenticeship Program",
      skills: ["Residential Wiring", "Low Voltage Systems", "Fixture Installation", "Electrical Safety"],
      bio: "Passionate electrical apprentice with a keen eye for detail and a strong work ethic. Eager to build on foundational skills and contribute to diverse projects.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
  ]

  const testimonials = [
    {
      name: "John Smith",
      role: "Owner, Elite Electrical Services",
      content:
        "Crew Solutions has transformed how we find skilled electrical apprentices. The quality of candidates is exceptional, and the platform makes hiring so much easier.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sarah Johnson",
      role: "Electrical Apprentice",
      content:
        "I found my dream job through Crew Solutions! The platform connected me with amazing electrical shops and helped advance my career in the electrical trade.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mike Rodriguez",
      role: "Owner, Bay Area Electrical",
      content:
        "The electrical apprentices we've hired through Crew Solutions have been outstanding. Great work ethic, skills, and professionalism. Highly recommend!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-yellow-600">Crew Solutions</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link className="font-medium hover:underline text-gray-700 hover:text-yellow-600" href="/login">
            Login
          </Link>
          <Link className="font-medium hover:underline text-gray-700 hover:text-yellow-600" href="/signup">
            Sign Up
          </Link>
        </nav>
        <Button asChild className="md:hidden bg-yellow-500 hover:bg-yellow-600">
          <Link href="/login">Login</Link>
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                    Connect with Top Electrical Apprentices for Your Crew
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Crew Solutions helps electrical shops find skilled apprentices for short-term projects and long-term
                    needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Link href="/signup?type=shop">Join as an Electrical Shop</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                  >
                    <Link href="/signup?type=apprentice">Join as an Electrical Apprentice</Link>
                  </Button>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-lg"
                height="400"
                src="/placeholder.svg?height=400&width=600"
                width="600"
              />
            </div>
          </div>
        </section>

        {/* Our Platform Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  Our Platform
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Connecting Electrical Professionals
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We bridge the gap between experienced electrical shops and talented electrical apprentices, creating
                  opportunities for growth and success in the electrical industry.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-2">
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-8 w-8 text-yellow-500" />
                    <CardTitle className="text-yellow-600">For Electrical Shops</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Find qualified electrical apprentices quickly and efficiently. Post jobs, review profiles, and
                    connect with skilled workers ready to contribute to your electrical projects.
                  </CardDescription>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-yellow-500" />
                      Access to pre-screened electrical apprentices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-yellow-500" />
                      Easy job posting and management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-yellow-500" />
                      Review and rating system
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <GraduationCapIcon className="h-8 w-8 text-yellow-500" />
                  <CardTitle className="text-yellow-600">For Electrical Apprentices</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Discover exciting opportunities with reputable electrical shops. Build your skills, gain experience,
                    and advance your career in the electrical trade.
                  </CardDescription>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-yellow-500" />
                      Browse quality electrical job opportunities
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-yellow-500" />
                      Build your professional profile
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-yellow-500" />
                      Connect with established electrical shops
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-yellow-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-200 px-3 py-1 text-sm text-yellow-800">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Everything You Need to Succeed in Electrical
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides comprehensive tools for both electrical shops and apprentices to thrive in the
                  electrical industry.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <Users className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-600">Smart Electrical Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Our algorithm matches electrical apprentices with shops based on skills, location, and project
                    requirements.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <Clock className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-600">Time Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Built-in time tracking and project management tools to keep everyone on the same page.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <Shield className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-600">Verified Electrical Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    All users are verified with background checks and skill assessments for your peace of mind.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <StarIcon className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-600">Review System</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Transparent review and rating system helps build trust and reputation in the electrical community.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <BriefcaseIcon className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-600">Job Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Complete job lifecycle management from posting to completion and payment processing.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <MapPinIcon className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-600">Local Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Find electrical opportunities in your local area with our location-based matching system.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Simple Steps to Build Your Electrical Crew
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're an electrical shop looking for talent or an electrical apprentice seeking
                  opportunities, Crew Solutions makes connections easy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-center p-6 text-center border-yellow-200 shadow-lg">
                <div className="rounded-full bg-yellow-100 p-4 mb-4">
                  <CheckCircleIcon className="h-12 w-12 text-yellow-500" />
                </div>
                <CardTitle className="text-yellow-600 mb-2">1. Sign Up</CardTitle>
                <CardDescription className="text-gray-600">
                  Create your profile as an electrical shop or an electrical apprentice.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center border-yellow-200 shadow-lg">
                <div className="rounded-full bg-yellow-100 p-4 mb-4">
                  <BriefcaseIcon className="h-12 w-12 text-yellow-500" />
                </div>
                <CardTitle className="text-yellow-600 mb-2">2. Post or Browse Electrical Jobs</CardTitle>
                <CardDescription className="text-gray-600">
                  Electrical shops post projects, apprentices find matching opportunities.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center border-yellow-200 shadow-lg">
                <div className="rounded-full bg-yellow-100 p-4 mb-4">
                  <StarIcon className="h-12 w-12 text-yellow-500" />
                </div>
                <CardTitle className="text-yellow-600 mb-2">3. Connect & Collaborate</CardTitle>
                <CardDescription className="text-gray-600">
                  Electrical apprentices get hired, complete jobs, and build their reputation.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Apprentices Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-yellow-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-200 px-3 py-1 text-sm text-yellow-800">
                  Featured Electrical Apprentices
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Meet Our Top Electrical Talent
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse highly-rated electrical apprentices ready for their next project.
                </p>
              </div>
            </div>
            <div className="relative mx-auto max-w-6xl py-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {apprenticeProfiles.map((apprentice) => (
                    <CarouselItem key={apprentice.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl border-yellow-200">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                          <Avatar className="mb-4 h-24 w-24">
                            <AvatarImage alt={apprentice.name} src={apprentice.profileImage || "/placeholder.svg"} />
                            <AvatarFallback className="bg-yellow-100 text-yellow-600">
                              {apprentice.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-xl font-bold text-gray-900">{apprentice.name}</CardTitle>
                          <CardDescription className="text-gray-600">{apprentice.title}</CardDescription>
                          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>
                              {apprentice.rating.toFixed(1)} ({apprentice.jobsCompleted} jobs)
                            </span>
                          </div>
                          <Separator className="my-4 w-full" />
                          <div className="grid w-full gap-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="h-4 w-4 text-yellow-500" />
                              <span>{apprentice.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BriefcaseIcon className="h-4 w-4 text-yellow-500" />
                              <span>{apprentice.experience}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCapIcon className="h-4 w-4 text-yellow-500" />
                              <span>{apprentice.education}</span>
                            </div>
                          </div>
                          <Separator className="my-4 w-full" />
                          <div className="flex flex-wrap justify-center gap-2">
                            {apprentice.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="mt-4 text-sm text-gray-600 line-clamp-3">{apprentice.bio}</p>
                          <Button asChild className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600">
                            <Link href={`/apprentice/${apprentice.id}`}>View Profile</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-yellow-600 border-yellow-300" />
                <CarouselNext className="text-yellow-600 border-yellow-300" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  What Our Electrical Users Say
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from electrical shops and apprentices who have found success through Crew Solutions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-yellow-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-600">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-yellow-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-yellow-200 px-3 py-1 text-sm text-yellow-800">
                  Contact Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Get in Touch</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We're here to help you succeed in the electrical industry.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-2">
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-yellow-600">Contact Information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">support@crewsolutions.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">123 Trade Street, San Francisco, CA 94102</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-yellow-600">Send us a Message</CardTitle>
                  <CardDescription className="text-gray-600">We'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="First Name" className="border-yellow-200 focus:border-yellow-500" />
                      </div>
                      <div>
                        <Input placeholder="Last Name" className="border-yellow-200 focus:border-yellow-500" />
                      </div>
                    </div>
                    <Input placeholder="Email" type="email" className="border-yellow-200 focus:border-yellow-500" />
                    <Input placeholder="Subject" className="border-yellow-200 focus:border-yellow-500" />
                    <Textarea placeholder="Message" className="border-yellow-200 focus:border-yellow-500" rows={4} />
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900">
                Ready to Build Your Electrical Crew or Start Your Electrical Career?
              </h2>
              <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up today and discover the future of the electrical trade.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
                <Link href="/signup?type=shop">Join as an Electrical Shop</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
              >
                <Link href="/signup?type=apprentice">Join as an Electrical Apprentice</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-yellow-200 bg-yellow-50">
        <p className="text-xs text-gray-600">Copyright 2024 Crew Solutions. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-600 hover:text-yellow-600"
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-600 hover:text-yellow-600"
            href="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
