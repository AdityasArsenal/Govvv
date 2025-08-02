export default function PricingTiers() {
  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Trial Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Trial</h3>
            <p className="text-5xl font-extrabold text-gray-900 mb-4">Free</p>
            <p className="text-gray-600 mb-6">Get a taste of our core features</p>
            <ul className="text-left space-y-2 mb-8 flex-grow">
              <li>✅ Access to the dashboard</li>
              <li>✅ Access to your account</li>
              <li>✅ Make calculations</li>
            </ul>
            <button className="w-full bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-300">Start Trial</button>
          </div>

          {/* Pro Tier - Highlighted */}
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 text-center flex flex-col ring-4 ring-blue-400 ring-opacity-75">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-5xl font-extrabold mb-4">₹149</p>
            <p className="opacity-90 mb-6">1 MONTH PLAN</p>
            <ul className="text-left space-y-2 mb-8 flex-grow">
              <li>✅ All features from Free Trial</li>
              <li>✅ Download calculations as PDF</li>
              <li>✅ Unlimited downloads</li>
              <li>✅ Priority Support</li>
            </ul>
            <button className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">Upgrade Now</button>
          </div>

          {/* Max Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Max</h3>
            <p className="text-5xl font-extrabold text-gray-900 mb-4">₹399</p>
            <p className="text-gray-600 mb-6">3 MONTH PLAN</p>
            <ul className="text-left space-y-2 mb-8 flex-grow">
              <li>✅ All features from Pro</li>
              <li>✅ 1 month free</li>
              <li>✅ 1 year complete backup</li>
              <li>✅ And more...</li>
            </ul>
            <button className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-300">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}
