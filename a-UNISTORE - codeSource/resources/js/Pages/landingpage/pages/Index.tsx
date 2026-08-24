import React from 'react';
import '../index.css';
import Navbar from '@/Pages/landingpage/components/Navbar';
import HeroSection from '@/Pages/landingpage/components/HeroSection';
import FeaturesSection from '@/Pages/landingpage/components/FeaturesSection';
import PricingSection from '@/Pages/landingpage/components/PricingSection';
import TestimonialsSection from '@/Pages/landingpage/components/TestimonialsSection';
import FaqSection from '@/Pages/landingpage/components/FaqSection';
import CtaSection from '@/Pages/landingpage/components/CtaSection';
import Footer from '@/Pages/landingpage/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-saas-black text-white">
      <Navbar />
      <main>
        <HeroSection />

        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
