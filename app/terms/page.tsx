import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Terms and Conditions</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-700 dark:text-gray-300">
          By accessing or using the Crew Solutions platform (the "Service"), you agree to be bound by these Terms and
          Conditions ("Terms"), all applicable laws and regulations, and agree that you are responsible for compliance
          with any applicable local laws. If you do not agree with any of these Terms, you are prohibited from using or
          accessing this Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Use License</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Permission is granted to temporarily download one copy of the materials (information or software) on Crew
          Solutions' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a
          transfer of title, and under this license you may not:
        </p>
        <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
          <li>Modify or copy the materials;</li>
          <li>
            Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
          </li>
          <li>Attempt to decompile or reverse engineer any software contained on Crew Solutions' website;</li>
          <li>Remove any copyright or other proprietary notations from the materials; or</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by
          Crew Solutions at any time. Upon terminating your viewing of these materials or upon the termination of this
          license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Disclaimer</h2>
        <p className="text-gray-700 dark:text-gray-300">
          The materials on Crew Solutions' website are provided on an 'as is' basis. Crew Solutions makes no warranties,
          expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
          implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
          intellectual property or other violation of rights.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Further, Crew Solutions does not warrant or make any representations concerning the accuracy, likely results,
          or reliability of the use of the materials on its website or otherwise relating to such materials or on any
          sites linked to this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Limitations</h2>
        <p className="text-gray-700 dark:text-gray-300">
          In no event shall Crew Solutions or its suppliers be liable for any damages (including, without limitation,
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
          use the materials on Crew Solutions' website, even if Crew Solutions or a Crew Solutions authorized
          representative has been notified orally or in writing of the possibility of such damage. Because some
          jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or
          incidental damages, these limitations may not apply to you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Accuracy of Materials</h2>
        <p className="text-gray-700 dark:text-gray-300">
          The materials appearing on Crew Solutions' website could include technical, typographical, or photographic
          errors. Crew Solutions does not warrant that any of the materials on its website are accurate, complete or
          current. Crew Solutions may make changes to the materials contained on its website at any time without notice.
          However Crew Solutions does not make any commitment to update the materials.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Links</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Crew Solutions has not reviewed all of the sites linked to its website and is not responsible for the contents
          of any such linked site. The inclusion of any link does not imply endorsement by Crew Solutions of the site.
          Use of any such linked website is at the user's own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Modifications</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Crew Solutions may revise these Terms of Service for its website at any time without notice. By using this
          website you are agreeing to be bound by the then current version of these Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Governing Law</h2>
        <p className="text-gray-700 dark:text-gray-300">
          These terms and conditions are governed by and construed in accordance with the laws of [Your State/Country]
          and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
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
