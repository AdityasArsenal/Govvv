export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Contact Us</h1>
        <p className="mt-4 text-center text-gray-500">
          Have a question or want to work with us? Fill out the form below..
        </p>

        {/* Owner contact details */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-sm text-gray-700 space-y-2">
          <p><strong>Owner Name:</strong> Asha Vijay Patil</p>
          <p><strong>Mobile Number:</strong> 8310339822</p>
          <p><strong>Email:</strong> 24aditya.v.patil@gmail.com</p>
          <p><strong>Address:</strong> Belgaum, Karnataka</p>
        </div>

        {/* Contact form */}
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input id="name" name="name" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Your Name" />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea id="message" name="message" rows={4} required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Your Message"></textarea>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
