export default function TermsPage() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Terms and Conditions</h1>
        <div className="mt-8 prose prose-indigo text-gray-500 mx-auto">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Agreement to Terms</h2>
          <p>By using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services.</p>

          <h2>2. Changes to Terms or Services</h2>
          <p>We may modify the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the modified Terms on the Site or through other communications. It’s important that you review the Terms whenever we modify them because if you continue to use the Services after we have posted modified Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.</p>

          <h2>3. Who May Use the Services</h2>
          <p>You may use the Services only if you are 13 years or older and are not barred from using the Services under applicable law.</p>

          <h2>4. Content and Content Rights</h2>
          <p>For purposes of these Terms: (i) “Content” means text, graphics, images, music, software, audio, video, works of authorship of any kind, and information or other materials that are posted, generated, provided or otherwise made available through the Services; and (ii) “User Content” means any Content that Account holders (including you) provide to be made available through the Services.</p>

          <h2>5. General Prohibitions</h2>
          <p>You agree not to do any of the following: Post, upload, publish, submit or transmit any User Content that: (i) infringes, misappropriates or violates a third party’s patent, copyright, trademark, trade secret, moral rights or other intellectual property rights, or rights of publicity or privacy; (ii) violates, or encourages any conduct that would violate, any applicable law or regulation or would give rise to civil liability.</p>
        </div>
      </div>
    </div>
  );
}

