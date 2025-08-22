import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="text-white py-16 px-6 lg:px-8 relative overflow-hidden min-h-[300px]"
          style={{
            backgroundImage: `url(/attached_assets/Terms%20%26%20Conditions.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Terms & Conditions
            </h1>
            <p className="text-base mb-4 opacity-90">
              Global Container Exchange platform terms of service and usage guidelines
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg backdrop-blur-sm" style={{backgroundColor: '#eef4ff'}}>
                <CardHeader>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2 text-blue-600">
                      Global Container Exchange
                    </h1>
                    <h2 className="text-2xl font-bold text-black">
                      Terms & Conditions
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none p-8">
                  
                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">1.</span> <span className="text-blue-600">Acceptance of Terms</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      By accessing or using the Global Container Exchange platform ("Platform"), you agree to comply with and be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use the Platform.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">2.</span> <span className="text-blue-600">Definitions</span></h2>
                    <div className="text-gray-700 leading-relaxed space-y-2">
                      <p><strong>Platform:</strong> The digital marketplace operated by Global Container Exchange for container leasing, sales, and related services.</p>
                      <p><strong>User:</strong> Any individual or entity registered on the Platform, including Suppliers and Buyers.</p>
                      <p><strong>Supplier:</strong> A User offering containers or related services on the Platform.</p>
                      <p><strong>Buyer:</strong> A User acquiring containers or related services through the Platform.</p>
                      <p><strong>Transaction:</strong> Any agreement between Users for the lease, sale, or exchange of containers facilitated by the Platform.</p>
                      <p><strong>Container Condition Categories:</strong> Includes New (1-trip), Cargo-Worthy (CW), Wind & Watertight (WWT), As-Is.</p>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">3.</span> <span className="text-blue-600">User Registration and Account Security</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      Users must register an account to access Platform services. You agree to provide accurate and up-to-date information. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">4.</span> <span className="text-blue-600">Use of the Platform</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      You agree to use the Platform in compliance with applicable international shipping regulations, local customs laws, and all relevant logistics standards. Prohibited activities include unauthorized access, disruption, or misuse of Platform data.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">5.</span> <span className="text-blue-600">Transactions and Delivery Expectations</span></h2>
                    
                    <h3 className="text-lg font-semibold mb-3"><span className="text-black">5.1</span> <span className="text-gray-600">Standard Delivery Window</span></h3>
                    <div className="text-gray-700 leading-relaxed mb-4">
                      <p className="mb-2">For all confirmed Transactions:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Delivery (Depot Pickup or Drop-Off) must occur within 5–10 business days of payment confirmation unless otherwise stated in the listing or agreed upon by both parties in writing.</li>
                        <li>Delayed Pickup or Delivery by either party exceeding 10 business days without prior mutual agreement may result in cancellation or penalties as per Section 10.</li>
                      </ul>
                    </div>

                    <h3 className="text-lg font-semibold mb-3"><span className="text-black">5.2</span> <span className="text-gray-600">Delivery Responsibility</span></h3>
                    <div className="text-gray-700 leading-relaxed mb-4">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Supplier is responsible for making the container available at the designated depot in the condition described.</li>
                        <li>Buyer is responsible for organizing transportation unless the transaction includes delivery service.</li>
                      </ul>
                    </div>

                    <h3 className="text-lg font-semibold mb-3"><span className="text-black">5.3</span> <span className="text-gray-600">Delivery Documentation</span></h3>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="mb-2">All container handoffs must be accompanied by:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Condition inspection report</li>
                        <li>Container Release Order (CRO) or Equipment Interchange Receipt (EIR)</li>
                        <li>Photo evidence (upon request)</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">6.</span> <span className="text-blue-600">Inspection and Acceptance of Containers</span></h2>
                    
                    <h3 className="text-lg font-semibold mb-3"><span className="text-black">6.1</span> <span className="text-gray-600">Inspection Rights</span></h3>
                    <div className="text-gray-700 leading-relaxed mb-4">
                      <p className="mb-2">Buyers have the right to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Inspect containers prior to pickup</li>
                        <li>Reject containers not matching the advertised condition or specifications (within 48 hours of pickup)</li>
                      </ul>
                    </div>

                    <h3 className="text-lg font-semibold mb-3"><span className="text-black">6.2</span> <span className="text-gray-600">Acceptable Condition Discrepancies</span></h3>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="mb-2">If containers are delivered in worse condition than listed (e.g. WWT listed as CW), the Buyer may:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Accept with compensation</li>
                        <li>Request replacement</li>
                        <li>Cancel the transaction (within 2 business days)</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">7.</span> <span className="text-blue-600">Container Return (Lease Agreements)</span></h2>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="mb-2">For leased containers:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Containers must be returned clean, empty, and in equal or better condition than when received (excluding normal wear and tear).</li>
                        <li>Return must occur by the lease-end date unless an extension is mutually agreed upon.</li>
                        <li>Late returns are subject to daily penalties based on the original lease rate.</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">8.</span> <span className="text-blue-600">Fees and Charges</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      Platform service fees, transaction fees, or dispute mediation fees may apply. All fees are transparently listed on the Fee Schedule page and are subject to change with prior notice.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">9.</span> <span className="text-blue-600">Dispute Resolution</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      The Platform provides optional dispute resolution and mediation support. Buyers and Suppliers must attempt resolution independently first. The Platform's decision in mediation is advisory but not legally binding.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">10.</span> <span className="text-blue-600">Termination and Cancellation</span></h2>
                    <div className="text-gray-700 leading-relaxed">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Transactions may be cancelled by either party prior to fulfillment, provided written notice is given and costs incurred are compensated.</li>
                        <li>Cancellations after pickup or confirmed delivery may incur penalties or forfeiture of deposit.</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">11.</span> <span className="text-blue-600">Limitation of Liability</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      The Platform acts solely as a facilitator. We are not responsible for disputes, damages, or non-performance by Users. Our maximum liability is limited to any service fee paid by the complainant to the Platform.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">12.</span> <span className="text-blue-600">Indemnification</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      You agree to indemnify and hold harmless Global Container Exchange and its affiliates from any claims arising from your use of the Platform, breach of Terms, or third-party disputes resulting from your actions.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">13.</span> <span className="text-blue-600">Changes to Terms</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms may be updated at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4"><span className="text-black">14.</span> <span className="text-blue-600">Governing Law</span></h2>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms are governed by the laws of Singapore, with exclusive jurisdiction in its courts for any disputes arising from use of the Platform.
                    </p>
                  </section>

                  <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 text-center">
                      Last updated: January 2025 | For questions regarding these terms, please contact our support team.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}