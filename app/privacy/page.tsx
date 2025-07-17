import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Your privacy is important to us. This Privacy Policy explains how Crew Solutions ("we," "us," or "our")
          collects, uses, discloses, and safeguards your information when you visit our website and use our services.
          Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
          do not access the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We may collect information about you in a variety of ways. The information we may collect via the Service
          depends on the content and materials you use, and includes:
        </p>
        <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
          <li>
            **Personal Data:** Personally identifiable information, such as your name, shipping address, email address,
            telephone number, age, date of birth, gender, occupation, and demographic information, that you voluntarily
            give to us when you register with the Service or when you choose to participate in various activities
            related to the Service.
          </li>
          <li>
            **Derivative Data:** Information our servers automatically collect when you access the Service, such as your
            IP address, your browser type, your operating system, your access times, and the pages you have viewed
            directly before and after accessing the Service.
          </li>
          <li>
            **Financial Data:** Financial information, such as data related to your payment method (e.g., valid credit
            card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or
            request information about our services from the Service.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized
          experience. Specifically, we may use information collected about you via the Service to:
        </p>
        <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
          <li>Create and manage your account.</li>
          <li>Process your transactions and send you related information.</li>
          <li>Enable user-to-user communications.</li>
          <li>Request feedback and contact you about your use of the Service.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Disclosure of Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We may share information we have collected about you in certain situations. Your information may be disclosed
          as follows:
        </p>
        <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
          <li>
            **By Law or to Protect Rights:** If we believe the release of information about you is necessary to respond
            to legal process, to investigate or remedy potential violations of our policies, or to protect the rights,
            property, or safety of others, we may share your information as permitted or required by any applicable law,
            rule, or regulation.
          </li>
          <li>
            **Third-Party Service Providers:** We may share your information with third parties that perform services
            for us or on our behalf, including payment processing, data analysis, email delivery, hosting services,
            customer service, and marketing assistance.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Security of Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We use administrative, technical, and physical security measures to help protect your personal information.
          While we have taken reasonable steps to secure the personal information you provide to us, please be aware
          that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission
          can be guaranteed against any interception or other type of misuse.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Policy for Children</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We do not knowingly solicit information from or market to children under the age of 13. If you become aware of
          any data we have collected from children under age 13, please contact us using the contact information
          provided below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices
          or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>
      </section>

      <div className="text-center">
        <Link href="/" className="text-crew-accent hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
