import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
};

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Refund Policy</h1>
        </div>
      </header>
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Commitment</h2>
              <p className="text-lg text-gray-600">
                At Data Canvas, we are dedicated to providing a reliable and valuable service to help school teachers and staff manage food expenses efficiently. Our goal is to ensure you are satisfied with our web-based automation tool. This policy outlines the terms under which refunds and cancellations are handled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Refund Eligibility</h2>
              <p className="text-lg text-gray-600 mb-2">
                Our services are offered on a subscription basis. Refunds are handled as follows:
              </p>
              <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li>
                  <strong>Annual Subscriptions:</strong> You are eligible for a full refund if you cancel your annual subscription within 14 days of the initial purchase. No refunds will be provided for cancellations made after this 14-day period.
                </li>
                <li>
                  <strong>Monthly Subscriptions:</strong> Monthly subscriptions are non-refundable. When you cancel a monthly subscription, you will continue to have access to the service until the end of your current billing cycle, and you will not be charged for the subsequent month.
                </li>
                <li>
                  <strong>Non-Refundable Services:</strong> Any one-time service fees or charges for specific report generation outside of a subscription plan are non-refundable once the service has been rendered.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancellation Process</h2>
              <p className="text-lg text-gray-600 mb-2">
                You can cancel your subscription at any time from your account settings dashboard. The cancellation will become effective at the end of your current billing period.
              </p>
              <ol className="list-decimal list-inside text-lg text-gray-600 space-y-2">
                <li>Log in to your Data Canvas account.</li>
                <li>Navigate to the 'Subscription' or 'Billing' section.</li>
                <li>Follow the on-screen instructions to cancel your plan.</li>
              </ol>
              <p className="text-lg text-gray-600 mt-4">
                There are no cancellation fees. Upon cancellation, your access to premium features will be revoked at the end of the subscription term.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Return/Replacement Requests</h2>
              <p className="text-lg text-gray-600">
                As a software-as-a-service (SaaS) provider, the concepts of 'return' or 'replacement' do not directly apply. If you are experiencing technical issues or are unsatisfied with the service, please contact our support team. We are committed to resolving any problems you may encounter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-lg text-gray-600">
                If you have any questions about our Refund Policy, please contact us at <a href="mailto:support@gov.nonexistential.dev" className="text-blue-600 hover:underline">ady@nonexistential.dev</a>. We are here to help and will do our best to address your concerns.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RefundPolicyPage;
