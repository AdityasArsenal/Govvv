export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Privacy Policy</h1>
        <div className="mt-8 prose prose-indigo text-gray-500 mx-auto">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Studio. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the Studio, express an interest in obtaining information about us or our products and services, when you participate in activities on the Studio or otherwise when you contact us.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use personal information collected via our Studio for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>

          <h2>4. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h2>5. How We Keep Your Information Safe</h2>
          <p>We aim to protect your personal information through a system of organizational and technical security measures.</p>

          <h2>6. Contact Us</h2>
          <p>If you have questions or comments about this policy, you may email us at contact@studio.app.</p>
        </div>
      </div>
    </div>
  );
}
