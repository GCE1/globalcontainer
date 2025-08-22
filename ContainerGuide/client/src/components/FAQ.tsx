import { useState } from 'react';

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
    },
    {
      question: "What happens if I receive a damaged container?",
      answer: "If you receive a container that doesn't match the condition specified in your purchase agreement, please document the issues with photographs within 24 hours of delivery and contact your account manager. Our Buyers Assurance Program covers replacement, repair, or compensation depending on the nature of the discrepancy.",
      category: "Quality & Certification"
    },
    {
      question: "Do you offer container transportation services?",
      answer: "Yes, Global Container Exchange provides comprehensive transportation services through our logistics network. We can arrange for the delivery of containers to your specified location, manage cross-border transportation, and coordinate with shipping lines for international movements. Our team handles all necessary documentation and customs requirements.",
      category: "Logistics & Delivery"
    },
    {
      question: "What industries do you typically serve?",
      answer: "We serve a diverse range of industries including shipping and logistics, construction, agriculture, retail, manufacturing, disaster relief, military, education, and event management. Our specialized containers meet industry-specific requirements, and our team has expertise in addressing the unique challenges of each sector.",
      category: "Business Solutions"
    },
    {
      question: "How can I verify the dimensions and specifications of containers?",
      answer: "All our containers come with detailed specification sheets that include precise interior and exterior dimensions, door openings, floor strength, and maximum payload. For IICL and CWO certified containers, we provide inspection certificates. We can also arrange pre-purchase inspections where you can personally verify all specifications.",
      category: "Products & Inventory"
    }
  ];
  
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  // Get category colors
  const getCategoryColor = (category?: string) => {
    switch(category) {
      case "Products & Inventory":
        return "border-[#0054A6]";
      case "Global Operations":
        return "border-[#00A651]";
      case "Quality & Certification":
        return "border-[#F7941D]";
      case "Customization & Services":
        return "border-[#9747FF]";
      case "Purchasing & Finance":
        return "border-[#2E7D32]";
      case "Logistics & Delivery":
        return "border-[#1565C0]";
      case "Business Solutions":
        return "border-[#6A1B9A]";
      default:
        return "border-[#0054A6]";
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category?: string) => {
    switch(category) {
      case "Products & Inventory":
        return "📦";
      case "Global Operations":
        return "🌎";
      case "Quality & Certification":
        return "✓";
      case "Customization & Services":
        return "🔧";
      case "Purchasing & Finance":
        return "💰";
      case "Logistics & Delivery":
        return "🚚";
      case "Business Solutions":
        return "💼";
      default:
        return "ℹ️";
    }
  };
  
  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-[#0054A6] mx-auto mb-6"></div>
          <p className="text-[#666666] max-w-3xl mx-auto">
            Find answers to common questions about our containers, services, and global operations.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-[#F8F9FA] rounded-xl p-8 shadow-lg">
          <div className="faq-list space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item bg-white rounded-lg border-l-4 ${getCategoryColor(faq.category)} shadow-sm overflow-hidden transition-all duration-300 ${activeIndex === index ? 'ring-1 ring-gray-200' : ''}`}
              >
                <div 
                  className="faq-question p-5 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center">
                    <span className="inline-block w-8 h-8 flex items-center justify-center bg-[#F5F7FA] rounded-full mr-3 text-sm">
                      {getCategoryIcon(faq.category)}
                    </span>
                    <h3 className="font-heading font-semibold text-lg text-[#333333]">{faq.question}</h3>
                  </div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F7FA] transition-transform duration-300 ${activeIndex === index ? 'transform rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0054A6]">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
                
                <div 
                  className={`transition-all duration-300 overflow-hidden ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                    {faq.category && (
                      <div className="mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-[#F5F7FA] rounded-full text-[#666666]">
                          {faq.category}
                        </span>
                      </div>
                    )}
                    <p className="text-[#555555] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-[#666666] mb-4">Still have questions? Our team is ready to help.</p>
            <button className="inline-flex items-center justify-center bg-[#0054A6] hover:bg-opacity-90 text-white font-heading font-semibold px-6 py-3 rounded-lg transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
