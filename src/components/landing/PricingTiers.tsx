export default function PricingTiers() {
  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free</h3>
            <p className="text-5xl font-extrabold text-gray-900 mb-4">$0</p>
            <p className="text-gray-600 mb-6">For individuals and small projects</p>
            <ul className="text-left space-y-2 mb-8 flex-grow">
              <li>✅ 1 Project</li>
              <li>✅ 1GB Storage</li>
              <li>✅ Community Support</li>
            </ul>
            <button className="w-full bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-300">Current Plan</button>
          </div>

          {/* Pro Tier - Highlighted */}
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 text-center flex flex-col ring-4 ring-blue-400 ring-opacity-75">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-5xl font-extrabold mb-4">$15</p>
            <p className="opacity-90 mb-6">For growing teams and businesses</p>
            <ul className="text-left space-y-2 mb-8 flex-grow">
              <li>✅ 10 Projects</li>
              <li>✅ 50GB Storage</li>
              <li>✅ Priority Support</li>
              <li>✅ Advanced Analytics</li>
            </ul>
            <button className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">Upgrade Now</button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Enterprise</h3>
            <p className="text-5xl font-extrabold text-gray-900 mb-4">$49</p>
            <p className="text-gray-600 mb-6">For large-scale applications</p>
            <ul className="text-left space-y-2 mb-8 flex-grow">
              <li>✅ Unlimited Projects</li>
              <li>✅ 1TB Storage</li>
              <li>✅ 24/7 Dedicated Support</li>
              <li>✅ Custom Integrations</li>
            </ul>
            <button className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-300">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}
