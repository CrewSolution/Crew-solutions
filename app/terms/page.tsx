import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

export default function TermsOfService() {
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
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: January 15, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                By accessing and using Crew Solutions, you accept and agree to be bound by the terms and provision of
                this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Crew Solutions is a platform that connects electrical contractors with qualified apprentices. We
                facilitate job matching, handle administrative tasks, and provide support services for both parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <div className="space-y-2">
                <h3 className="font-medium">For Electrical Shops:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Provide accurate business information and licensing details</li>
                  <li>Maintain proper insurance and safety standards</li>
                  <li>Treat apprentices fairly and professionally</li>
                  <li>Comply with all applicable labor laws and regulations</li>
                </ul>

                <h3 className="font-medium mt-4">For Apprentices:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Provide accurate information about skills and experience</li>
                  <li>Maintain professional conduct on job sites</li>
                  <li>Follow all safety protocols and procedures</li>
                  <li>Complete assigned work to the best of your ability</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Privacy and Data Protection</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We are committed to protecting your privacy. Personal information is collected and used in accordance
                with our Privacy Policy. We implement appropriate security measures to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Payment Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Payment terms vary by service level. All fees are clearly disclosed before commitment. We handle payroll
                processing for matched apprentices according to agreed terms between shops and apprentices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Crew Solutions acts as a facilitator and is not responsible for the actions of users on the platform. We
                do not guarantee employment outcomes or job performance. Users assume responsibility for their own
                actions and decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Either party may terminate their account at any time. We reserve the right to suspend or terminate
                accounts that violate these terms or engage in inappropriate behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes
                and continued use constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-400">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@crewsolutions.com
                <br />
                Phone: (415) 555-0123
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
