import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Last updated: July 16, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing or using the Crew Solutions platform (the "Service"), you agree to be bound by these Terms of
            Service ("Terms"), our Privacy Policy, and all applicable laws and regulations. If you do not agree with any
            of these Terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Crew Solutions provides a platform connecting electrical shops ("Shops") with electrical apprentices
            ("Apprentices") for job opportunities. The Service facilitates job postings, application management,
            communication, and review systems. We do not employ Apprentices and are not responsible for the direct
            interactions between Shops and Apprentices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>You must be at least 18 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>
              You agree to provide accurate, current, and complete information during the registration process and to
              update such information to keep it accurate, current, and complete.
            </li>
            <li>You are solely responsible for all activities that occur under your account.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. User Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>For Shops:</strong> You are responsible for the accuracy of job postings, verifying apprentice
              qualifications, and managing the work relationship.
            </li>
            <li>
              <strong>For Apprentices:</strong> You are responsible for the accuracy of your profile, your
              qualifications, and fulfilling your commitments to Shops.
            </li>
            <li>All users agree to conduct themselves professionally and respectfully.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Prohibited Conduct</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You agree not to use the Service for any unlawful purpose or in any way that could harm Crew Solutions or
            any third party. Prohibited conduct includes, but is not limited to:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-2">
            <li>Posting false or misleading information.</li>
            <li>Harassing, abusing, or harming another person.</li>
            <li>Attempting to gain unauthorized access to the Service or its systems.</li>
            <li>Violating any applicable laws or regulations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Disclaimers</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The Service is provided on an "as is" and "as available" basis. Crew Solutions makes no warranties,
            expressed or implied, and hereby disclaims all other warranties including, without limitation, implied
            warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual
            property or other violation of rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p className="text-gray-700 dark:text-gray-300">
            In no event shall Crew Solutions or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
            use the materials on Crew Solutions' website, even if Crew Solutions or a Crew Solutions authorized
            representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Crew Solutions reserves the right to revise these Terms at any time without notice. By using this Service,
            you are agreeing to be bound by the then current version of these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Governing Law</h2>
          <p className="text-gray-700 dark:text-gray-300">
            These terms and conditions are governed by and construed in accordance with the laws of California and you
            irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/signup" className="text-yellow-600 hover:text-yellow-500 underline">
            Back to Signup
          </Link>
        </div>
      </div>
    </div>
  )
}
