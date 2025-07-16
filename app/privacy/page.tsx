import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold">Crew Solutions</span>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: January 15, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <div className="space-y-2">
                <h3 className="font-medium">Personal Information:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Business information (for shops)</li>
                  <li>Skills, experience, and education (for apprentices)</li>
                  <li>Profile photos and documents</li>
                </ul>

                <h3 className="font-medium mt-4">Usage Information:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Platform usage patterns and preferences</li>
                  <li>Job applications and communications</li>
                  <li>Device information and IP addresses</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Facilitate job matching between shops and apprentices</li>
                <li>Process payments and handle administrative tasks</li>
                <li>Communicate about platform updates and opportunities</li>
                <li>Improve our services and user experience</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                We share information only as necessary to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Between matched shops and apprentices for job purposes</li>
                <li>With service providers who help us operate the platform</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Privacy Protection for Apprentices</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We take special care to protect apprentice privacy by displaying only first names and last name initials
                in public profiles. Full names are only shared with matched employers during the hiring process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We implement industry-standard security measures to protect your personal information, including
                encryption, secure servers, and regular security audits. However, no method of transmission over the
                internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Report privacy concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We use cookies and similar technologies to improve your experience, remember your preferences, and
                analyze platform usage. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Our platform is not intended for users under 18 years of age. We do not knowingly collect personal
                information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We may update this Privacy Policy periodically. We will notify users of significant changes and post the
                updated policy on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400">
                For questions about this Privacy Policy or our data practices, contact us at:
                <br />
                Email: privacy@crewsolutions.com
                <br />
                Phone: (415) 555-0123
                <br />
                Address: 123 Market Street, Suite 100, San Francisco, CA 94102
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
