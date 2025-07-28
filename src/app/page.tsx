import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ExplanationSection from '@/components/landing/ExplanationSection';
import PricingTiers from '@/components/landing/PricingTiers';
import Roadmap from '@/components/landing/Roadmap';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ExplanationSection />
        <PricingTiers />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}

