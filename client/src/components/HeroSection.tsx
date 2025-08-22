import { Button } from "@/components/ui/button";
import { Container, Mail } from "lucide-react";
import OptimizedHeroImage from "./OptimizedHeroImage";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <OptimizedHeroImage 
      src="/attached_assets/hero%20image.png"
      className="h-[43vh] flex items-center"
      fallbackColor="from-blue-900 via-blue-800 to-slate-900"
    >
      <div className="container mx-auto px-4 text-center text-white w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in-up">
            Connecting Continents, Containers, & Commerce
          </h1>
          <p className="text-xl md:text-2xl mb-8 fade-in-up opacity-90" style={{ animationDelay: "0.2s" }}>
            World-wide Container Solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button
              onClick={() => scrollToSection("about")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 btn-hover"
            >
              <Container className="mr-2 h-5 w-5" />
              Discover Our Story
            </Button>
            <Button
              onClick={() => window.location.href = "mailto:support@globalcontainerexchange.com"}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 btn-hover font-semibold bg-transparent"
            >
              <Mail className="mr-2 h-5 w-5 text-white" />
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </OptimizedHeroImage>
  );
}