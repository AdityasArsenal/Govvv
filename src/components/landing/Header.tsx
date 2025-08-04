import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="w-full md:w-auto flex justify-center md:justify-start text-2xl font-bold mb-4 md:mb-0">
            <Link href="/">MDM SMART CALCULATOR</Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="hover:text-gray-300">Features</Link>
            <Link href="#pricing" className="hover:text-gray-300">Pricing</Link>
            <Link href="#roadmap" className="hover:text-gray-300">Roadmap</Link>
          </div>
          <div>
            <Link href="/contact" className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
