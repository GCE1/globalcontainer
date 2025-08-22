import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Laptop, Globe, Leaf, Trophy } from "lucide-react";
import foundationImage from "@assets/2017 - Foundation.png";
import digitalPlatformImage from "@assets/2018 - Digital Platform.png";
import globalExpansionImage from "@assets/2020 - Global Expansion.png";
import sustainabilityImage from "@assets/2022 - Sustainability Initiative.png";
import industryLeadershipImage from "@assets/2025 - Industry Leadership.png";

const timelineData = [
  {
    year: "2017",
    title: "Foundation",
    subtitle: "The Beginning",
    description: "Founded with a vision to revolutionize container trading through digital innovation. Started with a small team of maritime industry experts in Singapore.",
    icon: Rocket,
    image: foundationImage,
  },
  {
    year: "2020",
    title: "Global Expansion",
    subtitle: "International Reach",
    description: "Expanded operations to 15 countries across Asia, Europe, and Americas. Established regional hubs in Hamburg, Los Angeles, and Dubai.",
    icon: Globe,
    image: globalExpansionImage,
  },
  {
    year: "2022",
    title: "Sustainability Initiative",
    subtitle: "Green Container Program",
    description: "Launched carbon-neutral shipping solutions and smart container tracking technology, reducing empty container movements by 30%.",
    icon: Leaf,
    image: sustainabilityImage,
  },
  {
    year: "2025",
    title: "Industry Leadership",
    subtitle: "Market Recognition",
    description: "Re-Launched the Global Container Exchange on-line platform with an enriched Customer Experience.",
    icon: Trophy,
    image: industryLeadershipImage,
  },
];

export default function HistorySection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
    timelineItems?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="history" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Milestones that shaped our global presence
          </p>
        </div>

        <div ref={timelineRef} className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full timeline-line hidden md:block"></div>

          {timelineData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className={`timeline-item flex items-center mb-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Year Badge */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{item.year}</span>
                  </div>
                </div>

                {/* Image */}
                <div className={`md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:ml-8" : "md:ml-auto md:mr-8"}`}>
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={item.image}
                      alt={`${item.year} - ${item.title}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`md:w-5/12 ${index % 2 === 0 ? "md:ml-auto md:mr-8" : "md:ml-8"}`}>
                  <Card className="value-card border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4 md:justify-start justify-center">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-blue-600">{item.year} - {item.title}</h4>
                      </div>
                      <h5 className="text-lg font-semibold mb-3 text-gray-800">{item.subtitle}</h5>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
