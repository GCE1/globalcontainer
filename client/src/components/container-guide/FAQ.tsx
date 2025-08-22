import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, Globe, Award, Wrench, DollarSign, Truck, Building2, HelpCircle } from 'lucide-react';
import { LuContainer } from 'react-icons/lu';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqs: FAQItem[] = [
    {
      question: "What types of containers do you offer?",
      answer: "Global Container Exchange offers a wide range of containers including 20ft, 40ft containers. Our inventory includes standard dry containers, high cube containers, refrigerated containers, and specialized equipment to meet your needs.",
      category: "Products & Inventory"
    },
    {
      question: "Where do you operate?",
      answer: "Global Container Exchange operates in 89 countries across Asia, Europe, and North America, with 410 depots strategically located worldwide to provide convenient access to our inventory.",
      category: "Global Operations"
    },
    {
      question: "What certification standards do your containers meet?",
      answer: "Our containers are classified according to industry standards including IICL (Institute of International Container Lessors), CWO (Cargo Worthy), and WWT (Wind and Water Tight) certifications. Each certification level indicates the container's condition and appropriate use cases.",
      category: "Quality & Certification"
    },
    {
      question: "Can containers be modified for special purposes?",
      answer: "Yes, containers can be modified for various applications including housing, offices, storage, and specialized facilities. We offer consultation services to help determine the right container type for your modification project and can recommend qualified modification specialists.",
      category: "Customization & Services"
    },
    {
      question: "What is the Buyers Assurance Program?",
      answer: "Our Buyers Assurance Program guarantees that every container undergoes rigorous inspection and meets the certification standards advertised. If a container doesn't meet the specified standards upon delivery, we offer replacement or refund options according to our customer satisfaction policy.",
      category: "Quality & Certification"
    },
    {
      question: "How do I determine which container size I need?",
      answer: "Container selection depends on your specific requirements including cargo volume, weight, transportation method, and intended use. Our container capacity guide provides detailed specifications, and our consultants are available to help you make the right choice based on your needs.",
      category: "Products & Inventory"
    },
    {
      question: "What payment methods do you accept?",
      answer: "Global Container Exchange accepts various payment methods including bank transfers, credit cards (Visa, Mastercard, American Express), and letters of credit for international transactions. For large orders, we also offer flexible financing options and can work with your company's procurement processes.",
      category: "Purchasing & Finance"
    },
    {
      question: "How long does delivery typically take?",
      answer: "Delivery timelines vary based on your location and inventory availability. For in-stock containers at nearby depots, delivery can be arranged within 3-5 business days. For special orders or remote locations, delivery may take 2-3 weeks. Our logistics team provides precise delivery estimates with every quote.",
      category: "Logistics & Delivery"
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getCategoryIcon = (category?: string) => {
    switch(category) {
      case "Products & Inventory":
        return <LuContainer className="w-6 h-6 text-[#0054A6]" />;
      case "Global Operations":
        return <Globe className="w-6 h-6 text-[#00A651]" />;
      case "Quality & Certification":
        return <Award className="w-6 h-6 text-[#F7941D]" />;
      case "Customization & Services":
        return <Wrench className="w-6 h-6 text-[#9747FF]" />;
      case "Purchasing & Finance":
        return <DollarSign className="w-6 h-6 text-[#2E7D32]" />;
      case "Logistics & Delivery":
        return <Truck className="w-6 h-6 text-[#1565C0]" />;
      case "Business Solutions":
        return <Building2 className="w-6 h-6 text-[#6A1B9A]" />;
      default:
        return <HelpCircle className="w-6 h-6 text-[#666666]" />;
    }
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0054A6]">Frequently Asked Questions</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12 text-lg">
          Find answers to common questions about our containers, services, and processes.
        </p>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <button
                className="w-full px-8 py-6 text-left bg-[#F8F9FA] hover:bg-[#F0F2F5] transition-colors duration-200 flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    {getCategoryIcon(faq.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333333] text-lg">{faq.question}</h3>
                    {faq.category && (
                      <span className="text-sm text-[#0054A6] mt-2 font-medium">{faq.category}</span>
                    )}
                  </div>
                </div>
                {activeIndex === index ? (
                  <ChevronUpIcon className="w-6 h-6 text-[#0054A6]" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-[#666666]" />
                )}
              </button>
              
              {activeIndex === index && (
                <div className="px-8 py-6 bg-white border-t border-gray-200">
                  <p className="text-[#555555] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}