import { useEffect } from 'react';
import Hero from '@/components/Hero';
import KeyDifferentiators from '@/components/KeyDifferentiators';
import ContainerTypes from '@/components/ContainerTypes';
import SpecialtyContainers from '@/components/SpecialtyContainers';
import TechnicalSpecs from '@/components/TechnicalSpecs';
import ArchitecturalInnovation from '@/components/ArchitecturalInnovation';
import RefrigeratedContainers from '@/components/RefrigeratedContainers';
import BicCodeCapacity from '@/components/BicCodeCapacity';
import ContainerHistory from '@/components/ContainerHistory';
import ContainerComponents from '@/components/ContainerComponents';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export default function BuyersGuide() {
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
    <div className="bg-[#F5F5F5]">
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
    </div>
  );
}
