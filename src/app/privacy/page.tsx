export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Privacy Policy</h1>
        <div className="mt-8 prose prose-indigo text-gray-500 mx-auto">
          <p>Last updated: 01/08/2025</p>

          <h1>Refund Policy..</h1>
          <p>We are not providing any refund for our services.</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to Data Canvas. This policy outlines how we handle and protect your information.
            Your privacy matters to us. If you have any questions, contact us at 24aditya.v.patil@gmail.com.
          </p>

          <h2>2. What Information We Collect</h2>
          <p>
            Data Canvas does not collect any personal data unless you choose to save your sheet.
            Authentication is done via Google OAuth, and we do not store your Google credentials.
          </p>

          <h2>3. How Your Information Is Used</h2>
          <p>
            Saved data is used only to allow you to revisit or export your expense sheets.
            No personal data is used for analytics, advertising, or shared with third parties.
          </p>

          <h2>4. Sharing of Data</h2>
          <p>
            We do not share any user data. Google handles the OAuth process and we do not access
            any profile information unless explicitly provided for future features (which will be optional).
          </p>

          <h2>5. Data Security</h2>
          <p>
            All saved data is encrypted and securely stored. The platform uses HTTPS for all communications.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use minimal session cookies only to enhance usability. No tracking or third-party cookies are used.
          </p>

          <h2>7. Your Control</h2>
          <p>
            Users who sign in can request deletion of their saved data by emailing us.
            You may also use the app without logging in, in which case no data is stored.
          </p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions or requests, reach us at 24aditya.v.patil@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}
