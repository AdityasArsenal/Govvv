export default function ExplanationSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Fast Deployment</h3>
            <p className="text-gray-600">Deploy your projects in seconds, not hours. Our streamlined process gets you up and running faster than ever.</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Intuitive UI</h3>
            <p className="text-gray-600">A user-friendly interface designed for developers of all skill levels. Focus on your code, not on configuration.</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Secure and Reliable</h3>
            <p className="text-gray-600">Your projects are safe with us. We provide top-notch security and a 99.9% uptime guarantee.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
