import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white text-center py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-extrabold mb-4">Your All-in-One Teacher's Assistant</h1>
        <p className="text-xl mb-8">Effortlessly manage student records, inventory, and meal accounting, all in one place.</p>
        <div className="flex flex-col items-center space-y-4">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shine-effect">
              Get Started
            </button>
          </Link>
          <Link href="/guide">
            <button className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-md transition duration-300 border border-blue-500">
              How to use
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
