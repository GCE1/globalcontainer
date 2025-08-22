import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Container Shipping: Sustainable Solutions for 2025",
    excerpt: "Explore how the container shipping industry is evolving towards more sustainable practices, including eco-friendly container designs and green logistics solutions.",
    content: "The container shipping industry is undergoing a significant transformation...",
    author: "Sarah Mitchell",
    date: "2025-01-15",
    category: "Sustainability",
    tags: ["Green Shipping", "Sustainability", "Future Trends"],
    image: "/attached_assets/Future-of-Containers.png",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Container Grades Explained: Choosing the Right Quality for Your Needs",
    excerpt: "Understanding the different container grades available in the market and how to select the best option for your specific shipping and storage requirements.",
    content: "When purchasing or leasing containers, understanding quality grades is crucial...",
    author: "Michael Chen",
    date: "2025-01-12",
    category: "Container Guide",
    tags: ["Container Quality", "Buying Guide", "IICL Standards"],
    image: "/attached_assets/Container-Grades.png",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Global Trade Trends: How Container Demand is Shaping Markets",
    excerpt: "Analyzing current global trade patterns and their impact on container availability, pricing, and logistics networks worldwide.",
    content: "The global container market continues to evolve with changing trade patterns...",
    author: "David Rodriguez",
    date: "2025-01-10",
    category: "Market Analysis",
    tags: ["Global Trade", "Market Trends", "Economics"],
    image: "/attached_assets/Global-trade-trends.png",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Refrigerated Containers: Maintaining Cold Chain Excellence",
    excerpt: "Best practices for using refrigerated containers to maintain temperature-sensitive cargo throughout the supply chain.",
    content: "Cold chain logistics requires precision and reliability...",
    author: "Jennifer Park",
    date: "2025-01-08",
    category: "Specialized Equipment",
    tags: ["Reefer Containers", "Cold Chain", "Food Logistics"],
    image: "/attached_assets/Refridgerated-Containers.png",
    readTime: "8 min read"
  },
  {
    id: 5,
    title: "Container Modifications: Transforming Steel Boxes into Custom Solutions",
    excerpt: "Discover the possibilities of container modifications for unique applications, from mobile offices to specialized storage units.",
    content: "Container modifications offer endless possibilities for creative applications...",
    author: "Robert Kim",
    date: "2025-01-05",
    category: "Innovation",
    tags: ["Container Modifications", "Custom Solutions", "Architecture"],
    image: "/attached_assets/Container-Modifications.png",
    readTime: "9 min read"
  },
  {
    id: 6,
    title: "Digital Transformation in Container Logistics",
    excerpt: "How technology is revolutionizing container tracking, management, and optimization in the modern supply chain.",
    content: "The digital revolution is transforming how we manage container logistics...",
    author: "Lisa Wang",
    date: "2025-01-03",
    category: "Technology",
    tags: ["Digital Transformation", "IoT", "Supply Chain"],
    image: "/attached_assets/Digital-Transformation.png",
    readTime: "6 min read"
  }
];

const categories = ["All", "Sustainability", "Container Guide", "Market Analysis", "Specialized Equipment", "Innovation", "Technology"];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/newsletter/subscribe', { email });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message,
        variant: "default",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    newsletterMutation.mutate(email);
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Blog Post Header */}
          <section 
            className="text-white py-16 relative overflow-hidden"
            style={{
              backgroundImage: (selectedPost.id === 1 || selectedPost.id === 2 || selectedPost.id === 3 || selectedPost.id === 4 || selectedPost.id === 5 || selectedPost.id === 6) 
                ? `url(${selectedPost.image})` 
                : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {(selectedPost.id === 1 || selectedPost.id === 2 || selectedPost.id === 3 || selectedPost.id === 4 || selectedPost.id === 5 || selectedPost.id === 6) && (
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            )}
            <div className="container mx-auto px-4 relative z-10">
              <Button 
                variant="ghost" 
                className="text-white hover:text-secondary mb-6"
                onClick={() => setSelectedPost(null)}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Blog
              </Button>
              
              <div className="max-w-4xl mx-auto">
                <Badge className="bg-secondary text-white mb-4">{selectedPost.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{selectedPost.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {selectedPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(selectedPost.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Post Content */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {(selectedPost.id !== 1 && selectedPost.id !== 2 && selectedPost.id !== 3 && selectedPost.id !== 4 && selectedPost.id !== 5 && selectedPost.id !== 6) && (
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title}
                    className="w-full h-96 object-cover rounded-lg mb-8"
                  />
                )}
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-600 mb-8">{selectedPost.excerpt}</p>
                  
                  <div className="text-gray-800 leading-relaxed space-y-6">
                    <p>
                      The global container industry continues to evolve at an unprecedented pace, driven by 
                      technological advancements, environmental concerns, and changing market demands. As we 
                      navigate through 2025, several key trends are reshaping how businesses approach container 
                      logistics and supply chain management.
                    </p>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Industry Transformation</h3>
                    <p>
                      Digital transformation has become a cornerstone of modern container operations. From 
                      IoT-enabled tracking systems to AI-powered route optimization, technology is enabling 
                      unprecedented visibility and efficiency in container logistics. Companies are leveraging 
                      real-time data to make informed decisions, reduce costs, and improve customer satisfaction.
                    </p>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Sustainability Focus</h3>
                    <p>
                      Environmental sustainability has moved from a nice-to-have to a business imperative. 
                      The industry is investing heavily in eco-friendly container materials, energy-efficient 
                      transportation methods, and circular economy principles. This shift is not only helping 
                      companies meet regulatory requirements but also driving innovation and cost savings.
                    </p>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Future Outlook</h3>
                    <p>
                      Looking ahead, the container industry is poised for continued growth and innovation. 
                      Emerging technologies like blockchain for supply chain transparency, autonomous vehicles 
                      for last-mile delivery, and advanced materials for container construction promise to 
                      further transform the industry landscape.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-8">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Blog Header */}
        <section className="relative text-white py-20 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/optimized_assets/Blog-Hero-image-optimized.webp)`
            }}
          />
          
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          {/* Content */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Container Industry Insights
            </h1>
            <p className="text-xl mb-8 opacity-95 max-w-3xl mx-auto text-white drop-shadow-md">
              Stay informed with the latest trends, insights, and innovations in the global container industry. 
              Expert analysis and practical guidance for logistics professionals.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-3"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="whitespace-nowrap"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No articles found matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article 
                      key={post.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          <span className="text-sm text-gray-500">{post.readTime}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 text-secondary hover:text-blue-700 transition-colors">
                          <span className="text-sm font-medium">Read More</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Stay Updated with Container Industry News
              </h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter for the latest insights, market analysis, and industry trends 
                delivered directly to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-secondary hover:bg-blue-700"
                  disabled={newsletterMutation.isPending}
                >
                  {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}