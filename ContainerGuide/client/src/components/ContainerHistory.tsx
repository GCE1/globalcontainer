import evolutionImage from '@assets/The Evolution of Shipping Container.png';

export default function ContainerHistory() {
  return (
    <section className="py-12 bg-[#0054A6] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center mb-8">The Evolution of Shipping Containers</h2>
        
        {/* Evolution Image */}
        <div className="mb-12 flex justify-center">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg max-w-4xl">
            <img 
              src={evolutionImage} 
              alt="The Evolution of Shipping Containers - From Manual Labor to Modern Containerization" 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
            <p className="text-center text-sm mt-4 text-white text-opacity-80">From manual cargo handling to automated container terminals - the transformation of global shipping</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="font-heading font-bold text-xl mb-3">The Beginning</h3>
            <p className="mb-3">In 1956, Malcolm McLean, a forward-thinking American entrepreneur, revolutionized global commerce by introducing the standardized shipping container.</p>
            <p>As the owner of the largest trucking company in America at the time, McLean's insight came from his firsthand experience with the inefficiencies of traditional cargo handling.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="font-heading font-bold text-xl mb-3">Standardization</h3>
            <p className="mb-3">McLean's innovation was simple yet profound: a standardized metal box that could be easily transferred between trucks, trains, and ships without unpacking its contents.</p>
            <p>This standardization led to the International Organization for Standardization (ISO) establishing global container dimensions in 1968, creating the foundation for modern global trade.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="font-heading font-bold text-xl mb-3">Global Impact</h3>
            <p className="mb-3">The adoption of standardized shipping containers drastically reduced loading and unloading times from days to hours, slashed shipping costs, and minimized cargo damage.</p>
            <p>Today, over 90% of the world's non-bulk cargo travels in containers, forming the backbone of our global supply chain and enabling international trade at an unprecedented scale.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
