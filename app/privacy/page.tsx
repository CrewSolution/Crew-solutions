import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Last updated: July 16, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300">We collect information to provide and improve our Service.</p>
          <h3 className="text-xl font-medium mt-4 mb-2">1.1. Personal Information You Provide:</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>For Shops:</strong> Business name, owner name, email, phone number, business address, license
              number, and payment information.
            </li>
            <li>
              <strong>For Apprentices:</strong> Name, email, phone number, address, date of birth, experience level,
              education, skills, availability, and payment information.
            </li>
            <li>
              <strong>Communication Data:</strong> Information you provide when you communicate with us or other users
              through the Service.
            </li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">1.2. Information Collected Automatically:</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>Usage Data:</strong> Information about how you access and use the Service, such as your IP
              address, browser type, pages visited, and time spent on pages.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track
              activity on our Service and hold certain information.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300">We use the collected information for various purposes:</p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>To provide and maintain our Service.</li>
            <li>To manage your account and provide customer support.</li>
            <li>To connect Shops with Apprentices and facilitate job matching.</li>
            <li>To improve, personalize, and expand our Service.</li>
            <li>To monitor the usage of our Service.</li>
            <li>To detect, prevent, and address technical issues.</li>
            <li>To send you updates, security alerts, and administrative messages.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Sharing Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may share your personal information in the following situations:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>With Other Users:</strong> Information necessary to facilitate job connections (e.g., Shop
              business name to Apprentices, Apprentice skills to Shops).
            </li>
            <li>
              <strong>With Service Providers:</strong> We may share your information with third-party vendors to perform
              services on our behalf (e.g., hosting, payment processing).
            </li>
            <li>
              <strong>For Business Transfers:</strong> In connection with any merger, sale of company assets, financing,
              or acquisition of all or a portion of our business by another company.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> If required to do so by law or in response to valid requests by public
              authorities.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with
              your consent.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We implement reasonable security measures to protect your personal information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of
            electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Your Data Protection Rights</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right to rectify any inaccurate information.</li>
            <li>The right to object to our processing of your personal data.</li>
            <li>The right to request that we restrict the processing of your personal information.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent.</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">To exercise any of these rights, please contact us.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at support@crewsolution.com.
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
