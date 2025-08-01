import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Teacher's Helper</h2>
            <p className="text-gray-400">Simplifying school management.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <Link href="/terms" className="text-gray-400 hover:text-white mx-4 my-2 md:my-0">Terms</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white mx-4 my-2 md:my-0">Privacy</Link>
            <Link href="/refund" className="text-gray-400 hover:text-white mx-4 my-2 md:my-0">Refund Policy</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white mx-4 my-2 md:my-0">Contact</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left">© {new Date().getFullYear()} Teacher's Helper. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0">
            {/* Add social media icons here if you have them */}
          </div>
        </div>
      </div>
    </footer>
  );
}

