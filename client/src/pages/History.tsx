import HeroSection from "@/components/HeroSection";
import HistorySection from "@/components/HistorySection";
import AboutSection from "@/components/AboutSection";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function History() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <HistorySection />

      </main>
      <Footer />
    </div>
  );
}