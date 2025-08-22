import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Palette, Download } from "lucide-react";
import { useState, useMemo } from "react";

// RAL Color data with container images
const ralColors = [
  { code: "RAL-Camo", name: "Camouflage", hex: "#4A5D23", category: "Special" },
  { code: "RAL1001", name: "Beige", hex: "#C2B078", category: "Yellow" },
  { code: "RAL1002", name: "Sand Yellow", hex: "#C6A664", category: "Yellow" },
  { code: "RAL1003", name: "Signal Yellow", hex: "#E5BE01", category: "Yellow" },
  { code: "RAL1004", name: "Golden Yellow", hex: "#CDA434", category: "Yellow" },
  { code: "RAL1005", name: "Honey Yellow", hex: "#A98307", category: "Yellow" },
  { code: "RAL1006", name: "Maize Yellow", hex: "#E4A010", category: "Yellow" },
  { code: "RAL1007", name: "Daffodil Yellow", hex: "#DC9D00", category: "Yellow" },
  { code: "RAL1011", name: "Brown Beige", hex: "#8A6642", category: "Yellow" },
  { code: "RAL1012", name: "Lemon Yellow", hex: "#C7B446", category: "Yellow" },
  { code: "RAL1013", name: "Oyster White", hex: "#EAE6CA", category: "Yellow" },
  { code: "RAL1014", name: "Ivory", hex: "#E1CC4F", category: "Yellow" },
  { code: "RAL1015", name: "Light Ivory", hex: "#E6D690", category: "Yellow" },
  { code: "RAL1016", name: "Sulfur Yellow", hex: "#EDFF21", category: "Yellow" },
  { code: "RAL1017", name: "Saffron Yellow", hex: "#F5D033", category: "Yellow" },
  { code: "RAL1018", name: "Zinc Yellow", hex: "#F8F32B", category: "Yellow" },
  { code: "RAL1019", name: "Grey Beige", hex: "#9E9764", category: "Yellow" },
  { code: "RAL1020", name: "Olive Yellow", hex: "#999950", category: "Yellow" },
  { code: "RAL1021", name: "Rape Yellow", hex: "#F3DA0B", category: "Yellow" },
  { code: "RAL1023", name: "Traffic Yellow", hex: "#FAD201", category: "Yellow" },
  { code: "RAL1024", name: "Ochre Yellow", hex: "#AEA04B", category: "Yellow" },
  { code: "RAL1026", name: "Luminous Yellow", hex: "#FFFF00", category: "Yellow" },
  { code: "RAL1027", name: "Curry", hex: "#9D9101", category: "Yellow" },
  { code: "RAL1028", name: "Melon Yellow", hex: "#F4A900", category: "Yellow" },
  { code: "RAL1032", name: "Broom Yellow", hex: "#D6AE01", category: "Yellow" },
  { code: "RAL1033", name: "Dahlia Yellow", hex: "#F3A505", category: "Yellow" },
  { code: "RAL1034", name: "Pastel Yellow", hex: "#EFA94A", category: "Yellow" },
  { code: "RAL1037", name: "Sun Yellow", hex: "#F39800", category: "Yellow" },
  { code: "RAL2000", name: "Yellow Orange", hex: "#ED760E", category: "Orange" },
  { code: "RAL2001", name: "Red Orange", hex: "#C93C20", category: "Orange" },
  { code: "RAL2002", name: "Vermillion", hex: "#CB2821", category: "Orange" },
  { code: "RAL2003", name: "Pastel Orange", hex: "#FF7514", category: "Orange" },
  { code: "RAL2004", name: "Pure Orange", hex: "#F44611", category: "Orange" },
  { code: "RAL2005", name: "Luminous Orange", hex: "#FF2301", category: "Orange" },
  { code: "RAL2007", name: "Luminous Bright Orange", hex: "#FFA420", category: "Orange" },
  { code: "RAL2008", name: "Bright Red Orange", hex: "#F75E25", category: "Orange" },
  { code: "RAL2009", name: "Traffic Orange", hex: "#F54021", category: "Orange" },
  { code: "RAL2010", name: "Signal Orange", hex: "#D84B20", category: "Orange" },
  { code: "RAL2011", name: "Deep Orange", hex: "#EC7C26", category: "Orange" },
  { code: "RAL2012", name: "Salmon Range", hex: "#E55137", category: "Orange" },
  { code: "RAL3000", name: "Flame Red", hex: "#AF2B1E", category: "Red" },
  { code: "RAL3001", name: "Signal Red", hex: "#A52019", category: "Red" },
  { code: "RAL3002", name: "Carmine Red", hex: "#A2231D", category: "Red" },
  { code: "RAL3003", name: "Ruby Red", hex: "#9B111E", category: "Red" },
  { code: "RAL3004", name: "Purple Red", hex: "#75151E", category: "Red" },
  { code: "RAL3005", name: "Wine Red", hex: "#5E2129", category: "Red" },
  { code: "RAL3011", name: "Brown Red", hex: "#781F19", category: "Red" },
  { code: "RAL3012", name: "Beige Red", hex: "#C1876B", category: "Red" },
  { code: "RAL3013", name: "Tomato Red", hex: "#A12312", category: "Red" },
  { code: "RAL3014", name: "Antique Pink", hex: "#D36E70", category: "Red" },
  { code: "RAL3015", name: "Light Pink", hex: "#EA899A", category: "Red" },
  { code: "RAL3016", name: "Coral Red", hex: "#B32821", category: "Red" },
  { code: "RAL3017", name: "Rose", hex: "#E63244", category: "Red" },
  { code: "RAL3020", name: "Traffic Red", hex: "#CC0605", category: "Red" },
  { code: "RAL3022", name: "Salmon Pink", hex: "#D95030", category: "Red" },
  { code: "RAL3024", name: "Luminous Red", hex: "#F80000", category: "Red" },
  { code: "RAL3026", name: "Luminous Bright Red", hex: "#FE0000", category: "Red" },
  { code: "RAL3027", name: "Raspberry Red", hex: "#C51D34", category: "Red" },
  { code: "RAL3031", name: "Orient Red", hex: "#B32428", category: "Red" },
  { code: "RAL3032", name: "Pearl Ruby Red", hex: "#721422", category: "Red" },
  { code: "RAL3033", name: "Pearl Pink", hex: "#B44C43", category: "Red" },
  { code: "RAL4001", name: "Red Lilac", hex: "#6D3F5B", category: "Violet" },
  { code: "RAL4002", name: "Red Violet", hex: "#922B3E", category: "Violet" },
  { code: "RAL4003", name: "Heather Violet", hex: "#DE4C8A", category: "Violet" },
  { code: "RAL4004", name: "Claret Violet", hex: "#641C34", category: "Violet" },
  { code: "RAL4005", name: "Blue Lilac", hex: "#6C4675", category: "Violet" },
  { code: "RAL4006", name: "Traffic Purple", hex: "#A03472", category: "Violet" },
  { code: "RAL4007", name: "Purple Violet", hex: "#4A192C", category: "Violet" },
  { code: "RAL4008", name: "Signal Violet", hex: "#924373", category: "Violet" },
  { code: "RAL4009", name: "Pastel Violet", hex: "#A18594", category: "Violet" },
  { code: "RAL4010", name: "Telemagenta", hex: "#CF3476", category: "Violet" },
  { code: "RAL4011", name: "Pearl Violet", hex: "#8673A1", category: "Violet" },
  { code: "RAL4012", name: "Pearl Black Berry", hex: "#6C6874", category: "Violet" },
  { code: "RAL5000", name: "Violet Blue", hex: "#354D73", category: "Blue" },
  { code: "RAL5001", name: "Green Blue", hex: "#1F3A93", category: "Blue" },
  { code: "RAL5002", name: "Ultramarine Blue", hex: "#20214F", category: "Blue" },
  { code: "RAL5004", name: "Black Blue", hex: "#18171C", category: "Blue" },
  { code: "RAL5005", name: "Signal Blue", hex: "#1E2460", category: "Blue" },
  { code: "RAL5008", name: "Grey Blue", hex: "#26252D", category: "Blue" },
  { code: "RAL5009", name: "Azure Blue", hex: "#025669", category: "Blue" },
  { code: "RAL5010", name: "Gentian Blue", hex: "#0E294B", category: "Blue" },
  { code: "RAL5011", name: "Steel Blue", hex: "#231A24", category: "Blue" },
  { code: "RAL5012", name: "Light Blue", hex: "#3B83BD", category: "Blue" },
  { code: "RAL5013", name: "Cobalt Blue", hex: "#1E213D", category: "Blue" },
  { code: "RAL5014", name: "Pigeon Blue", hex: "#606E8C", category: "Blue" },
  { code: "RAL5015", name: "Sky Blue", hex: "#2271B3", category: "Blue" },
  { code: "RAL5017", name: "Traffic Blue", hex: "#063971", category: "Blue" },
  { code: "RAL5018", name: "Turquoise Blue", hex: "#3F888F", category: "Blue" },
  { code: "RAL5019", name: "Capri Blue", hex: "#1B5583", category: "Blue" },
  { code: "RAL5020", name: "Ocean Blue", hex: "#1D334A", category: "Blue" },
  { code: "RAL5021", name: "Water Blue", hex: "#256D7B", category: "Blue" },
  { code: "RAL5022", name: "Night Blue", hex: "#252850", category: "Blue" },
  { code: "RAL5023", name: "Distant Blue", hex: "#49678D", category: "Blue" },
  { code: "RAL5024", name: "Pastel Blue", hex: "#5D9B9B", category: "Blue" },
  { code: "RAL5025", name: "Pearl Gentian Blue", hex: "#2A6478", category: "Blue" },
  { code: "RAL5026", name: "Pearl Night Blue", hex: "#102C54", category: "Blue" },
  { code: "RAL6000", name: "Patina Green", hex: "#316650", category: "Green" },
  { code: "RAL6001", name: "Emerald Green", hex: "#287233", category: "Green" },
  { code: "RAL6002", name: "Leaf Green", hex: "#2D5016", category: "Green" },
  { code: "RAL6003", name: "Olive Green", hex: "#424632", category: "Green" },
  { code: "RAL6004", name: "Blue Green", hex: "#1F3A3D", category: "Green" },
  { code: "RAL6005", name: "Moss Green", hex: "#2F4F4F", category: "Green" },
  { code: "RAL6006", name: "Grey Olive", hex: "#3E3B32", category: "Green" },
  { code: "RAL6007", name: "Bottle Green", hex: "#343B29", category: "Green" },
  { code: "RAL6009", name: "Fir Green", hex: "#31372B", category: "Green" },
  { code: "RAL6010", name: "Grass Green", hex: "#35682D", category: "Green" },
  { code: "RAL6011", name: "Reseda Green", hex: "#587246", category: "Green" },
  { code: "RAL6012", name: "Black Green", hex: "#343E40", category: "Green" },
  { code: "RAL6013", name: "Reed Green", hex: "#6C7156", category: "Green" },
  { code: "RAL6014", name: "Yellow Olive", hex: "#47402E", category: "Green" },
  { code: "RAL6015", name: "Black Olive", hex: "#3B3C36", category: "Green" },
  { code: "RAL6016", name: "Turquoise Green", hex: "#1E5945", category: "Green" },
  { code: "RAL6017", name: "Yellow Green", hex: "#4C9141", category: "Green" },
  { code: "RAL6018", name: "May Green", hex: "#57A639", category: "Green" },
  { code: "RAL6019", name: "Pastel Green", hex: "#BDECB6", category: "Green" },
  { code: "RAL6020", name: "Chrome Green", hex: "#2E3A23", category: "Green" },
  { code: "RAL6021", name: "Pale Green", hex: "#89AC76", category: "Green" },
  { code: "RAL6022", name: "Olive Drab", hex: "#25221B", category: "Green" },
  { code: "RAL6024", name: "Traffic Green", hex: "#308446", category: "Green" },
  { code: "RAL6025", name: "Fern Green", hex: "#3D642D", category: "Green" },
  { code: "RAL6026", name: "Opal Green", hex: "#015D52", category: "Green" },
  { code: "RAL6027", name: "Light Green", hex: "#84C3CE", category: "Green" },
  { code: "RAL6028", name: "Pine Green", hex: "#2C5545", category: "Green" },
  { code: "RAL6032", name: "Signal Green", hex: "#317F43", category: "Green" },
  { code: "RAL6033", name: "Mint Turquoise", hex: "#497E76", category: "Green" },
  { code: "RAL6034", name: "Pastel Turquoise", hex: "#7FB5B5", category: "Green" },
  { code: "RAL6035", name: "Pearl Green", hex: "#1C542D", category: "Green" },
  { code: "RAL6036", name: "Pearl Opal Green", hex: "#193737", category: "Green" },
  { code: "RAL6037", name: "Pure Green", hex: "#008F39", category: "Green" },
  { code: "RAL6038", name: "Luminous Green", hex: "#00BB2D", category: "Green" },
  { code: "RAL7000", name: "Squirrel Grey", hex: "#78858B", category: "Grey" },
  { code: "RAL7002", name: "Olive Grey", hex: "#7E7B52", category: "Grey" },
  { code: "RAL7003", name: "Moss Grey", hex: "#6C7059", category: "Grey" },
  { code: "RAL7004", name: "Signal Grey", hex: "#969992", category: "Grey" },
  { code: "RAL7005", name: "Mouse Grey", hex: "#646B63", category: "Grey" },
  { code: "RAL7006", name: "Beige Grey", hex: "#6D6552", category: "Grey" },
  { code: "RAL7008", name: "Khaki Grey", hex: "#6A5F31", category: "Grey" },
  { code: "RAL7009", name: "Green Grey", hex: "#4D5645", category: "Grey" },
  { code: "RAL7010", name: "Tarpaulin Grey", hex: "#4C514A", category: "Grey" },
  { code: "RAL7011", name: "Iron Grey", hex: "#434B4D", category: "Grey" },
  { code: "RAL7012", name: "Basalt Grey", hex: "#4E5754", category: "Grey" },
  { code: "RAL7013", name: "Brown Grey", hex: "#464531", category: "Grey" },
  { code: "RAL7015", name: "Slate Grey", hex: "#434750", category: "Grey" },
  { code: "RAL7016", name: "Anthracite Grey", hex: "#293133", category: "Grey" },
  { code: "RAL7021", name: "Black Grey", hex: "#23282B", category: "Grey" },
  { code: "RAL7022", name: "Umbra Grey", hex: "#332F2C", category: "Grey" },
  { code: "RAL7023", name: "Concrete Grey", hex: "#686C5E", category: "Grey" },
  { code: "RAL7024", name: "Graphite Grey", hex: "#474A51", category: "Grey" },
  { code: "RAL7026", name: "Granite Grey", hex: "#2F353B", category: "Grey" },
  { code: "RAL7030", name: "Stone Grey", hex: "#8B8C7A", category: "Grey" },
  { code: "RAL7031", name: "Blue Grey", hex: "#474B4E", category: "Grey" },
  { code: "RAL7032", name: "Pebble Grey", hex: "#B8B799", category: "Grey" },
  { code: "RAL7033", name: "Cement Grey", hex: "#7D8471", category: "Grey" },
  { code: "RAL7034", name: "Yellow Grey", hex: "#8F8B66", category: "Grey" },
  { code: "RAL7035", name: "Light Grey", hex: "#D7D7D7", category: "Grey" },
  { code: "RAL7036", name: "Platinum Grey", hex: "#7F7679", category: "Grey" },
  { code: "RAL7037", name: "Dusty Grey", hex: "#7D7F7D", category: "Grey" },
  { code: "RAL7038", name: "Agate Grey", hex: "#B5B8B1", category: "Grey" },
  { code: "RAL7039", name: "Quartz Grey", hex: "#6C6960", category: "Grey" },
  { code: "RAL7040", name: "Window Grey", hex: "#9DA1AA", category: "Grey" },
  { code: "RAL7042", name: "Traffic Grey A", hex: "#8D948D", category: "Grey" },
  { code: "RAL7043", name: "Traffic Grey B", hex: "#4E5452", category: "Grey" },
  { code: "RAL7044", name: "Silk Grey", hex: "#CAC4B0", category: "Grey" },
  { code: "RAL7045", name: "Telegrey 1", hex: "#909090", category: "Grey" },
  { code: "RAL7046", name: "Telegrey 2", hex: "#82898F", category: "Grey" },
  { code: "RAL7047", name: "Telegrey 4", hex: "#D0D0D0", category: "Grey" },
  { code: "RAL7048", name: "Pearl Mouse Grey", hex: "#898176", category: "Grey" },
  { code: "RAL8000", name: "Green Brown", hex: "#826C34", category: "Brown" },
  { code: "RAL8001", name: "Ochre Brown", hex: "#955F20", category: "Brown" },
  { code: "RAL8002", name: "Signal Brown", hex: "#6C3B2A", category: "Brown" },
  { code: "RAL8003", name: "Clay Brown", hex: "#734222", category: "Brown" },
  { code: "RAL8004", name: "Copper Brown", hex: "#8E402A", category: "Brown" },
  { code: "RAL8007", name: "Fawn Brown", hex: "#59351F", category: "Brown" },
  { code: "RAL8008", name: "Olive Brown", hex: "#6F4F28", category: "Brown" },
  { code: "RAL8011", name: "Nut Brown", hex: "#5B3A29", category: "Brown" },
  { code: "RAL8012", name: "Red Brown", hex: "#592321", category: "Brown" },
  { code: "RAL8014", name: "Sepia Brown", hex: "#382C1E", category: "Brown" },
  { code: "RAL8015", name: "Chestnut Brown", hex: "#633A34", category: "Brown" },
  { code: "RAL8016", name: "Mahogany Brown", hex: "#4C2F27", category: "Brown" },
  { code: "RAL8017", name: "Chocolate Brown", hex: "#45322E", category: "Brown" },
  { code: "RAL8019", name: "Grey Brown", hex: "#403A3A", category: "Brown" },
  { code: "RAL8022", name: "Black Brown", hex: "#212121", category: "Brown" },
  { code: "RAL8023", name: "Orange Brown", hex: "#A65E2E", category: "Brown" },
  { code: "RAL8024", name: "Beige Brown", hex: "#79553D", category: "Brown" },
  { code: "RAL8025", name: "Pale Brown", hex: "#755C48", category: "Brown" },
  { code: "RAL8028", name: "Terra Brown", hex: "#4E3629", category: "Brown" },
  { code: "RAL8029", name: "Pearl Copper", hex: "#763C28", category: "Brown" },
  { code: "RAL9001", name: "Cream", hex: "#FDF4E3", category: "White" },
  { code: "RAL9002", name: "Grey White", hex: "#E7EBDA", category: "White" },
  { code: "RAL9003", name: "Signal White", hex: "#F4F4F4", category: "White" },
  { code: "RAL9004", name: "Signal Black", hex: "#282828", category: "Black" },
  { code: "RAL9005", name: "Jet Black", hex: "#0A0A0A", category: "Black" },
  { code: "RAL9006", name: "White Aluminium", hex: "#A5A5A5", category: "White" },
  { code: "RAL9007", name: "Grey Aluminium", hex: "#8F8F8F", category: "Grey" },
  { code: "RAL9010", name: "Pure White", hex: "#FFFFFF", category: "White" },
  { code: "RAL9011", name: "Graphite Black", hex: "#1C1C1C", category: "Black" },
  { code: "RAL9016", name: "Traffic White", hex: "#F6F6F6", category: "White" },
  { code: "RAL9017", name: "Traffic Black", hex: "#1E1E1E", category: "Black" },
  { code: "RAL9018", name: "Papyrus White", hex: "#D7D7D7", category: "White" },
  { code: "RAL9022", name: "Pearl Light Grey", hex: "#9C9C9C", category: "Grey" },
  { code: "RAL9023", name: "Pearl Dark Grey", hex: "#828282", category: "Grey" },
];

const categories = ["All", "Yellow", "Orange", "Red", "Violet", "Blue", "Green", "Grey", "Brown", "White", "Black", "Special"];

export default function ColorPaletteViewer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredColors = useMemo(() => {
    return ralColors.filter(color => {
      const matchesSearch = color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           color.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || color.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getContainerImagePath = (ralCode: string) => {
    return `/attached_assets/20GP-${ralCode}.png`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-bg text-white py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Palette className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Container Color Palette
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Explore our comprehensive RAL color collection for shipping containers
            </p>
            <Badge className="bg-green-500 text-white px-6 py-2 text-lg">
              {ralColors.length} Available Colors
            </Badge>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search colors</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by color name or RAL code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Color Grid */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Showing {filteredColors.length} of {ralColors.length} colors
                {selectedCategory !== "All" && ` in ${selectedCategory} category`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredColors.map((color) => (
                <Card key={color.code} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={getContainerImagePath(color.code)}
                      alt={`20GP Container in ${color.name}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        // Fallback to color swatch if image doesn't exist
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'block';
                        }
                      }}
                    />
                    <div 
                      className="w-full h-32 hidden"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge variant="secondary" className="text-xs">
                        {color.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-bold text-gray-800 mb-1">{color.code}</h3>
                      <p className="text-sm text-gray-600 mb-2">{color.name}</p>
                      <div className="flex items-center justify-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-mono text-gray-500">{color.hex}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredColors.length === 0 && (
              <div className="text-center py-12">
                <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No colors found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or selecting a different category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">About RAL Colors</h2>
                <p className="text-gray-600 text-lg">
                  Professional color standards for shipping container customization
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-blue-600" />
                      RAL Standard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      RAL is a European color matching system that defines colors for paint and coatings, 
                      ensuring consistent color reproduction across different manufacturers.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Download className="h-5 w-5 mr-2 text-blue-600" />
                      Color Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Our container colors are professionally matched to RAL standards, providing 
                      durable, weather-resistant finishes that maintain their appearance over time.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="h-5 w-5 mr-2 text-blue-600" />
                      Custom Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Contact our team to discuss custom color options for your container fleet. 
                      We can accommodate special color requirements for branding and identification.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}