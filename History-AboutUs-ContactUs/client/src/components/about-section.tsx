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
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Leaf, Zap } from "lucide-react";
import joshFairBankImage from "@assets/Josh-FairBank.png";
import jasonStachowImage from "@assets/Jason-Stachow-2.png";
import tysonStelImage from "@assets/Tyson-Stel.png";
import valuedCustomersImage from "@assets/Valued-Customers.png";

const values = [
  {
    icon: Shield,
    title: "Reliability",
    description: "Ensuring secure and dependable container transactions with 99.9% platform uptime and comprehensive insurance coverage.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Committed to reducing carbon footprint through smart routing, container optimization, and green technology initiatives.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leading the industry with AI-powered logistics, blockchain transparency, and IoT-enabled container tracking.",
  },
];

const stats = [
  { number: 10000, label: "Containers Traded Monthly", suffix: "+" },
  { number: 89, label: "Countries Served with Wholesale Rates", suffix: "+" },
  { number: 400, label: "Depots with Available Containers", suffix: "+" },
  { number: 7000, label: "New Containers Manufactured Monthly", suffix: "" },
];

const team = [
  {
    name: "Josh Fairbank",
    role: "CEO & Founder",
    bio: "10+ years in Container Sales, Leasing with the Global trade industry",
    image: joshFairBankImage,
  },
  {
    name: "Jason Stachow",
    role: "President & Managing Partner",
    bio: "25+ years Operations and Sales Management throughout a variety of industries",
    image: jasonStachowImage,
  },
  {
    name: "Tyson Stel",
    role: "CFO & Managing Partner",
    bio: "Global operations expert, former Hapag-Lloyd director",
    image: tysonStelImage,
  },
];

export default function AboutSection() {
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
              let start = 0;
              const increment = stat.number / 100;
              const timer = setInterval(() => {
                start += increment;
                if (start >= stat.number) {
                  setAnimatedStats((prev) => {
                    const newStats = [...prev];
                    newStats[index] = stat.number;
                    return newStats;
                  });
                  clearInterval(timer);
                } else {
                  setAnimatedStats((prev) => {
                    const newStats = [...prev];
                    newStats[index] = Math.floor(start);
                    return newStats;
                  });
                }
              }, 20);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById("stats");
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">About Global Container Exchange</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Driving innovation in global container logistics
          </p>
        </div>

        {/* Comprehensive About Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl text-gray-800 font-semibold">
                <strong>Global Container Exchange</strong> Inc. stands at the forefront of the maritime logistics revolution, transforming how the world trades containers through cutting-edge digital innovation and unparalleled industry expertise.
              </p>
              
              <p>
                Founded in 2017 with a bold vision to digitize the traditional container trading industry, <strong>Global Container Exchange</strong> has emerged as the world's premier digital container exchange platform. Our comprehensive ecosystem connects freight forwarders, customs brokers, shipping lines, and logistics providers across 89 countries, facilitating seamless container transactions through our state-of-the-art online marketplace.
              </p>
              
              <p>
                At the heart of our operations lies an extensive fleet of 1.6 million containers strategically positioned across our global network of 410 depots spanning Asia, Europe, and North America. Our platform processes over 10,000 container transactions monthly, supported by rigorous IICL inspection standards and comprehensive insurance coverage through our partnerships with Chubb and HUATAI Insurance.
              </p>
              
              <p>
                What sets <strong>Global Container Exchange</strong> apart is our commitment to transparency, reliability, and customer-centric innovation. Our proprietary technology platform provides real-time container availability, competitive wholesale pricing, and streamlined logistics coordination. With an impressive 80% customer retention rate and over 100,000 satisfied customers worldwide, we've built a reputation for delivering exceptional value and service excellence.
              </p>
              
              <p>
                Our manufacturing capabilities are equally impressive, producing 7,000 new containers monthly to meet the growing demands of global trade. Each container undergoes stringent quality control processes, ensuring our clients receive equipment that meets the highest industry standards for durability, security, and operational efficiency.
              </p>
              
              <p>
                As we continue to expand our global footprint, <strong>Global Container Exchange</strong> remains committed to sustainable practices and environmental responsibility. Our smart logistics solutions have reduced empty container movements by 30%, contributing to more efficient supply chains and reduced carbon emissions across the maritime industry.
              </p>
              
              <p className="text-xl text-blue-600 font-semibold">
                Today, <strong>Global Container Exchange</strong> is not just a container trading platform – we are the trusted partner enabling global commerce, connecting businesses worldwide, and driving the future of maritime logistics through innovation, reliability, and unwavering commitment to customer success.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="value-card border-0 shadow-lg border-t-4 border-t-blue-600">
                <CardContent className="p-8 text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h5 className="text-xl font-bold mb-4 text-gray-800">{value.title}</h5>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Company Stats */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-600">Our Impact by Numbers</h3>
          <div id="stats" className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="stats-card stats-gradient text-white text-center p-6">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold mb-2">
                    {animatedStats[index]}{stat.suffix}
                  </div>
                  <h6 className="font-semibold text-sm opacity-90">{stat.label}</h6>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Valued Customers Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-600">Our Valued Customers</h3>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  At Global Container Exchange Inc., our success story is written by the 100,000+ valued customers who trust us across 89 countries. From freight forwarders and customs brokers to international shipping carriers, we're proud to serve a diverse network of industry leaders who rely on our extensive fleet of 1.6M containers and our commitment to excellence.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our customer relationships are built on a foundation of reliability, transparency, and unparalleled service. With an impressive 80% customer retention rate, we continue to deliver value through our comprehensive container solutions, whether through our flexible leasing programs or wholesale options. Our global network of 410 depots across Asia, Europe, and North America ensures that our customers receive seamless access to high-quality containers, backed by rigorous IICL inspections, professional insurance coverage through Chubb and HUATAI, and our dedicated support team.
                </p>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  We don't just provide containers; we deliver peace of mind and strategic partnership to businesses driving global trade forward.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={valuedCustomersImage}
                alt="Professional business handshake at container port representing valued customer relationships"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-600">Leadership Team</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="value-card border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <img
                    src={member.image}
                    alt={`${member.name} portrait`}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h5 className="text-xl font-bold mb-2 text-gray-800">{member.name}</h5>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
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
