import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-300">
          Join the largest global container marketplace today and access wholesale prices, reliable shipping, and dedicated support.
        </p>
        <Button
          variant="outline"
          className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-6 py-3 rounded-lg inline-flex items-center transition duration-300 h-auto group"
        >
          <span>Get Started Now</span>
          <i className="fas fa-arrow-right ml-2 text-[#33d2b9] group-hover:text-white"></i>
        </Button>
      </div>
    </section>
  );
}
