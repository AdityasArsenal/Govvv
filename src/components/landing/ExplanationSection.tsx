export default function ExplanationSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Streamlined Record-Keeping</h3>
            <p className="text-gray-600">Simplify daily attendance (tali) and meal tracking with our easy-to-use system, saving you time and effort.</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Inventory Management</h3>
            <p className="text-gray-600">Keep track of food supplies and manage your inventory with automated reports and low-stock alerts.</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🧾</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Accurate Accounting</h3>
            <p className="text-gray-600">Handle food material accounting with precision, ensuring transparency and compliance with all regulations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
