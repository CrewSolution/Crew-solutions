import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-bold">Crew Solutions</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/signup">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Signup
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 15, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-sm text-muted-foreground mb-2">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Create an account</li>
                <li>Complete your profile</li>
                <li>Post job listings or apply for jobs</li>
                <li>Communicate with other users</li>
                <li>Contact our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-sm text-muted-foreground mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. Information Sharing</h2>
              <p className="text-sm text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this policy. We may share your information with trusted partners who
                assist us in operating our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Data Security</h2>
              <p className="text-sm text-muted-foreground">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
                100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Your Rights</h2>
              <p className="text-sm text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Cookies</h2>
              <p className="text-sm text-muted-foreground">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide
                personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Contact Us</h2>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@crewsolutions.work
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
