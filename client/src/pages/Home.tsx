import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import ServiceBlocksSection from "@/components/ServiceBlocksSection";
import CoverageSection from "@/components/CoverageSection";
import EcommSearchKit from "@/components/EcommSearchKit";
import Testimonials from "@/components/Testimonials";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import PoweringGlobalTradeSection from "@/components/PoweringGlobalTradeSection";
import QualityAssuredSection from "@/components/QualityAssuredSection";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEOWrapper } from "@/components/SEOWrapper";
import { useSEO } from "@/hooks/useSEO";

export default function Home() {
  // Apply SEO optimization for the home page
  useSEO();

  useEffect(() => {
    // Handle hash navigation when page loads
    const hash = window.location.hash;
    if (hash) {
      // Minimal delay for DOM rendering
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - 100;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <TrustedCompanies />
        <ServiceBlocksSection />
        <EcommSearchKit />
        <WhyChooseUsSection />
        <CoverageSection />


        <Testimonials />
        <PoweringGlobalTradeSection />
        <QualityAssuredSection />
      </main>
      <Footer />
    </div>
  );
}
