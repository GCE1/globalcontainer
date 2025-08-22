import poweringGlobalTradeImage from "@assets/Untitled-16.png";

export default function PoweringGlobalTradeSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Content */}
          <div className="lg:w-1/2 lg:order-1">
            <h2 className="text-3xl font-bold text-[#001937] mb-6">
              Powering Global Trade: Strategic Container Solutions
            </h2>
            
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Global Container Exchange Inc.</strong> strategic network of <strong>410 depots</strong> across <strong>89 countries</strong> ensures seamless access to our premium container fleet, empowering your business to operate efficiently across international borders. Whether you need standard shipping containers or specialized units, our vast inventory of <strong>1.4 million containers</strong> stands ready to meet your dynamic trade requirements.
              </p>
              
              {/* Mobile: Image positioned within text content for text wrapping */}
              <div className="lg:hidden float-right ml-4 mb-4 w-1/2">
                <img 
                  src={poweringGlobalTradeImage} 
                  alt="Global container solutions powering international trade" 
                  className="w-full h-auto"
                />
              </div>
              
              <p>
                We don't just provide containers – we deliver strategic advantages that power your global trade success. Our innovative leasing solutions adapt to your business rhythm, while our expert team provides personalized support to optimize your container operations.
              </p>
              
              <p>
                From Asia to Europe and North America, we've streamlined the container procurement process, allowing you to focus on what matters most: growing your business and serving your customers. Experience the difference of working with a partner who understands the pulse of international trade and is committed to your success in the global marketplace.
              </p>
            </div>
          </div>
          
          {/* Right side - Image (Desktop only) */}
          <div className="hidden lg:block lg:w-1/2 lg:order-2 flex justify-center lg:justify-end">
            <img 
              src={poweringGlobalTradeImage} 
              alt="Global container solutions powering international trade" 
              className="w-3/5 h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}