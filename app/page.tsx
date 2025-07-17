import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { StarIcon, CheckCircleIcon, BriefcaseIcon, MapPinIcon, GraduationCapIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function LandingPage() {
  // Hardcoded demo apprentice profiles
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
      title: "Plumbing Apprentice",
      rating: 4.7,
      jobsCompleted: 9,
      location: "Oakland, CA",
      experience: "1.5 years experience",
      education: "Community College Program",
      skills: ["Pipe Fitting", "Drain Cleaning", "Fixture Installation", "Water Heater Repair"],
      bio: "Enthusiastic plumbing apprentice committed to mastering the trade. Proficient in various plumbing techniques and always ready for a new challenge.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "demo-apprentice-3",
      name: "David Kim",
      title: "HVAC Apprentice",
      rating: 4.9,
      jobsCompleted: 15,
      location: "San Jose, CA",
      experience: "3 years experience",
      education: "Vocational Training",
      skills: ["HVAC Installation", "Refrigeration", "System Diagnostics", "Maintenance"],
      bio: "Experienced HVAC apprentice specializing in installation and maintenance of heating and cooling systems. Detail-oriented and committed to quality work.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "demo-apprentice-4",
      name: "Jessica Brown",
      title: "Carpentry Apprentice",
      rating: 4.6,
      jobsCompleted: 10,
      location: "Berkeley, CA",
      experience: "1 year experience",
      education: "Apprenticeship Program",
      skills: ["Framing", "Finishing", "Cabinetry", "Tool Usage"],
      bio: "Passionate carpentry apprentice with a keen eye for detail and a strong work ethic. Eager to build on foundational skills and contribute to diverse projects.",
      profileImage: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <BriefcaseIcon className="h-6 w-6" />
          <span>Crew Solutions</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link className="font-medium hover:underline" href="/login">
            Login
          </Link>
          <Link className="font-medium hover:underline" href="/signup">
            Sign Up
          </Link>
        </nav>
        <Button asChild className="md:hidden">
          <Link href="/login">Login</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect with Top Apprentices for Your Crew
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Crew Solutions helps shops find skilled apprentices for short-term projects and long-term needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="/signup?type=shop">Join as a Shop</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/signup?type=apprentice">Join as an Apprentice</Link>
                  </Button>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                height="400"
                src="/placeholder.svg?height=400&width=600"
                width="600"
              />
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple Steps to Build Your Dream Crew
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Whether you're a shop looking for talent or an apprentice seeking opportunities, Crew Solutions makes
                  connections easy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-center p-6 text-center">
                <CheckCircleIcon className="mb-4 h-12 w-12 text-crew-accent" />
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create your profile as a shop or an apprentice.</CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center">
                <BriefcaseIcon className="mb-4 h-12 w-12 text-crew-accent" />
                <CardTitle>Post or Browse Jobs</CardTitle>
                <CardDescription>Shops post projects, apprentices find matching opportunities.</CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center">
                <StarIcon className="mb-4 h-12 w-12 text-crew-accent" />
                <CardTitle>Connect & Collaborate</CardTitle>
                <CardDescription>Apprentices get hired, complete jobs, and build their reputation.</CardDescription>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Featured Apprentices
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet Our Top Talent</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Browse highly-rated apprentices ready for their next project.
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
                      <Card className="h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                          <Avatar className="mb-4 h-24 w-24">
                            <AvatarImage alt={apprentice.name} src={apprentice.profileImage || "/placeholder.svg"} />
                            <AvatarFallback>
                              {apprentice.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-xl font-bold">{apprentice.name}</CardTitle>
                          <CardDescription className="text-gray-500 dark:text-gray-400">
                            {apprentice.title}
                          </CardDescription>
                          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span>
                              {apprentice.rating.toFixed(1)} ({apprentice.jobsCompleted} jobs)
                            </span>
                          </div>
                          <Separator className="my-4 w-full" />
                          <div className="grid w-full gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="h-4 w-4 text-crew-accent" />
                              <span>{apprentice.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BriefcaseIcon className="h-4 w-4 text-crew-accent" />
                              <span>{apprentice.experience}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCapIcon className="h-4 w-4 text-crew-accent" />
                              <span>{apprentice.education}</span>
                            </div>
                          </div>
                          <Separator className="my-4 w-full" />
                          <div className="flex flex-wrap justify-center gap-2">
                            {apprentice.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{apprentice.bio}</p>
                          <Button asChild className="mt-6 w-full">
                            <Link href={`/apprentice/${apprentice.id}`}>View Profile</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
                  Why Choose Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  The Best Solution for Your Crew Needs
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Crew Solutions offers unparalleled benefits for both shops and apprentices.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Verified Talent</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access a pool of thoroughly vetted and highly-rated apprentices.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Flexible Engagements</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hire for short-term projects or find long-term team members.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Streamlined Process</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easy job posting, invitation, and management tools.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Skill Development</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Apprentices gain valuable experience and build their portfolios.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Transparent Reviews</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Build trust with a comprehensive review and rating system.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Community Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Join a thriving community of trade professionals.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Build Your Crew or Start Your Career?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up today and discover the future of skilled trades.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button asChild>
                <Link href="/signup?type=shop">Join as a Shop</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup?type=apprentice">Join as an Apprentice</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Crew Solutions. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
