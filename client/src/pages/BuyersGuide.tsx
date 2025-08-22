import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/container-guide/Hero';
import KeyDifferentiators from '@/components/container-guide/KeyDifferentiators';
import ContainerTypes from '@/components/container-guide/ContainerTypes';
import SpecialtyContainers from '@/components/container-guide/SpecialtyContainers';
import TechnicalSpecs from '@/components/container-guide/TechnicalSpecs';
import ArchitecturalInnovation from '@/components/container-guide/ArchitecturalInnovation';
import RefrigeratedContainers from '@/components/container-guide/RefrigeratedContainers';
import BicCodeCapacity from '@/components/container-guide/BicCodeCapacity';
import ContainerHistory from '@/components/container-guide/ContainerHistory';
import ContainerComponents from '@/components/container-guide/ContainerComponents';
import FAQ from '@/components/container-guide/FAQ';
import CTASection from '@/components/container-guide/CTASection';

export default function BuyersGuide() {
  useSEO({
    title: "Container Buyers Guide - Complete Shipping Container Information",
    description: "Comprehensive guide to buying shipping containers including types, conditions, sizes, pricing, and expert tips for making the right choice.",
    keywords: ["container buyers guide", "shipping container guide", "container types", "container buying tips"]
  });
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        const targetElement = document.querySelector(targetId || '');
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="bg-gray-50">
      <Navbar />
      <Hero />
      <KeyDifferentiators />
      <ContainerTypes />
      <SpecialtyContainers />
      <TechnicalSpecs />
      <ContainerComponents />
      <RefrigeratedContainers />
      <ArchitecturalInnovation />
      <BicCodeCapacity />
      <ContainerHistory />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}