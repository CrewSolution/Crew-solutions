import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap } from "lucide-react"

export default function TermsPage() {
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
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
            <CardTitle>Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 15, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-muted-foreground">
                By accessing and using Crew Solutions, you accept and agree to be bound by the terms and provision of
                this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Use License</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Permission is granted to temporarily use Crew Solutions for personal, non-commercial transitory viewing
                only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. User Accounts</h2>
              <p className="text-sm text-muted-foreground">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Payment Terms</h2>
              <p className="text-sm text-muted-foreground">
                Payment processing is handled through our secure payment partners. All payments are subject to our
                refund policy. Jobs running longer than one week require weekly payments.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Privacy Policy</h2>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Prohibited Uses</h2>
              <p className="text-sm text-muted-foreground mb-2">You may not use our service:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>
                  To violate any international, federal, provincial, or state regulations, rules, laws, or local
                  ordinances
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights or the intellectual property rights of
                  others
                </li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Termination</h2>
              <p className="text-sm text-muted-foreground">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever and without limitation.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Contact Information</h2>
              <p className="text-sm text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at legal@crewsolutions.work
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
