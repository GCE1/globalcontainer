import { Button } from "@/components/ui/button";
import { Anchor, Mail, Container } from "lucide-react";
import heroImagePath from "@assets/hero image.png";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-[60vh] flex items-center overflow-hidden">
      {heroimage}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImagePath})` }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in-up">
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
              onClick={() => scrollToSection("contact")}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 btn-hover font-semibold bg-transparent"
              style={{ color: 'white !important' }}
            >
              <Mail className="mr-2 h-5 w-5 text-white" />
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
