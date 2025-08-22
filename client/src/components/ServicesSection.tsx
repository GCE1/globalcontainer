export default function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#001937] mb-12">
          Our Container Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-shipping-fast text-secondary text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-[#001937] mb-3">Container Sales</h3>
            <p className="text-gray-600 mb-4">
              New and used shipping containers available for purchase with competitive pricing and global delivery options.
            </p>
            <a href="/container-sales" className="text-secondary font-medium hover:underline flex items-center">
              Learn more <i className="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
          
          {/* Service Card 2 */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-exchange-alt text-secondary text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-[#001937] mb-3">Container Leasing</h3>
            <p className="text-gray-600 mb-4">
              Flexible short and long-term container leasing solutions with maintenance support and competitive rates.
            </p>
            <a href="/container-leasing" className="text-secondary font-medium hover:underline flex items-center">
              Learn more <i className="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
          
          {/* Service Card 3 */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-truck text-secondary text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-[#001937] mb-3">Container Transport</h3>
            <p className="text-gray-600 mb-4">
              Reliable container transportation services across 83 countries with real-time tracking and competitive pricing.
            </p>
            <a href="/container-transport" className="text-secondary font-medium hover:underline flex items-center">
              Learn more <i className="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
