import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import HistorySection from "@/components/history-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import FooterSection from "@/components/footer-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <HistorySection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
