import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Background Image */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat text-white py-32 px-6 lg:px-8"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/container-port-hero.jpg')"
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              About Global Container Exchange
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
              Driving innovation in global container logistics
            </p>
          </div>
        </section>

        {/* About Section Component */}
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}