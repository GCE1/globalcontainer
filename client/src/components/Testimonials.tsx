import michaelJohnsonImage from "@assets/Michael Johnson.png";
import sarahWilliamsImage from "@assets/Sarah Williams.png";
import robertChenImage from "@assets/Robert Chen.png";

export default function Testimonials() {
  return (
    <section className="pt-6 pb-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#001937] mb-12">
          What Our Clients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gradient-to-br from-[#001937] to-[#4a90e2] rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            <p className="text-white/90 mb-6">
              "Global Container Exchange provided us with excellent service. Their container leasing options saved us significant costs on our international shipping requirements."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4">
                <img 
                  src={michaelJohnsonImage} 
                  alt="Michael Johnson" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
              </div>
              <div>
                <h4 className="font-medium text-white">Michael Johnson</h4>
                <p className="text-sm text-white/80">Logistics Director, Antheng Ltd</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-gradient-to-br from-[#001937] to-[#4a90e2] rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            <p className="text-white/90 mb-6">
              "The wholesale pricing and global availability of containers made our expansion into new markets seamless. Highly recommend their services."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4">
                <img 
                  src={sarahWilliamsImage} 
                  alt="Sarah Williams" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
              </div>
              <div>
                <h4 className="font-medium text-white">Sarah Williams</h4>
                <p className="text-sm text-white/80">Supply Chain Manager, M.Sons Corporation</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-gradient-to-br from-[#001937] to-[#4a90e2] rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
            <p className="text-white/90 mb-6">
              "Their customer service is exceptional. Every query was handled promptly, and they provided tailored solutions for our unique shipping requirements."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4">
                <img 
                  src={robertChenImage} 
                  alt="Robert Chen" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
              </div>
              <div>
                <h4 className="font-medium text-white">Robert Chen</h4>
                <p className="text-sm text-white/80">Operations Manager, Shenzhen Ocean & Air</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
