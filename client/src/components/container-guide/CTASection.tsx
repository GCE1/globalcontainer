export default function CTASection() {
  return (
    <section className="py-12 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Transform Your Container Experience?</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">Join thousands of satisfied customers who have revolutionized their shipping, storage, and architectural projects with Global Container Exchange.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/contact" className="bg-white text-green-600 hover:bg-opacity-90 font-semibold px-8 py-4 rounded-lg transition duration-300">Contact Our Experts</a>
          <a href="/" className="bg-blue-600 hover:bg-opacity-90 text-white font-semibold px-8 py-4 rounded-lg transition duration-300 border border-white">View Inventory</a>
        </div>
      </div>
    </section>
  );
}