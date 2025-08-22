import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Leaf, Zap } from "lucide-react";

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



export default function AboutSection() {
  const [currentStats, setCurrentStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate each counter
            stats.forEach((stat, index) => {
              setTimeout(() => {
                let current = 0;
                const duration = 2000; // 2 seconds
                const frameRate = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameRate);
                const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
                
                const counter = setInterval(() => {
                  const progress = current / totalFrames;
                  const easedProgress = easeOutQuart(progress);
                  const value = Math.round(easedProgress * stat.number);
                  
                  setCurrentStats(prev => {
                    const newStats = [...prev];
                    newStats[index] = value;
                    return newStats;
                  });
                  
                  current++;
                  
                  if (current > totalFrames) {
                    setCurrentStats(prev => {
                      const newStats = [...prev];
                      newStats[index] = stat.number;
                      return newStats;
                    });
                    clearInterval(counter);
                  }
                }, frameRate);
              }, index * 300); // Stagger each counter by 300ms
            });
            
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      const statsElement = document.getElementById("stats");
      if (statsElement) {
        observer.observe(statsElement);
      }
    }, 500);

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
              <Card 
                key={index} 
                className="stats-card stats-gradient text-white text-center p-6 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <CardContent className="p-0">
                  <div className="text-4xl font-bold mb-2 transition-all duration-300 group-hover:text-5xl group-hover:text-yellow-300">
                    {currentStats[index]}{stat.suffix}
                  </div>
                  <h6 className="font-semibold text-sm opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:text-blue-100">
                    {stat.label}
                  </h6>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="h-1 w-12 bg-yellow-300 mx-auto rounded-full"></div>
                  </div>
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


      </div>
    </section>
  );
}