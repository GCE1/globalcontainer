import React, { useState, useEffect } from "react";
import ContainerPreview from "@/components/ContainerPreview";
import ColorSelector from "@/components/ColorSelector";
import SpecialRequirements from "@/components/SpecialRequirements";
import { ralColors, type RALColor } from "@/data/colors";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayPalButton from "@/components/PayPalButton";

const Home: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<RALColor>(ralColors.find(c => c.ral === "RAL 7015")!);
  const [selectedSize, setSelectedSize] = useState<string>("20ft");
  const [selectedFeature, setSelectedFeature] = useState<string>("optional");
  const [requirements, setRequirements] = useState({
    insurance: "none",
    containerFeature: "optional",
    lockingBox: "no",
    forkLiftPocket: "no", 
    easyOpenDoor: "no",
    logo: "no",
    quantity: 1
  });
  const [totalPrice, setTotalPrice] = useState(0);

  // Pricing data
  const prices = {
    containerSize: { 
      "20ft": 2000,       // 20ft Standard ($2,000)
      "20ft-hc": 2750,    // 20ft High Cube ($2,750)
      "40ft": 3500,       // 40ft Standard ($3,500)
      "40ft-hc": 3650,    // 40ft High Cube ($3,650)
      "45ft-hc": 6750,    // 45ft High Cube ($6,750)
      "53ft-hc": 8550     // 53ft High Cube ($8,550)
    },
    features: {
      containerFeature: {
        "optional": 0,
        "double-door": 1000,
        "multi-side-door": 2000,
        "full-open-side": 2250,
        "open-top": 2500
      },
      lockingBox: 50,        // $50 for Lock Box
      forkLiftPocket: 150,   // $150 for Fork Lift Pockets
      easyOpenDoor: 150,     // $150 for Easy Open Doors
      logo: 200,
      insurance: {
        "none": 0,
        "basic": 350,
        "premium": 800,
        "comprehensive": 1200
      }
    }
  };

  // Calculate total price
  useEffect(() => {
    const calculateTotal = () => {
      // Start with container size price
      let total = prices.containerSize[selectedSize as keyof typeof prices.containerSize] || prices.containerSize["20ft"];
      
      // Add door feature price
      total += prices.features.containerFeature[selectedFeature as keyof typeof prices.features.containerFeature] || 0;
      
      // Add optional add-ons
      if (requirements.lockingBox === "yes") total += prices.features.lockingBox;
      if (requirements.forkLiftPocket === "yes") total += prices.features.forkLiftPocket;
      if (requirements.easyOpenDoor === "yes") total += prices.features.easyOpenDoor;
      if (requirements.logo === "yes") total += prices.features.logo;
      
      // Add insurance
      if (requirements.insurance !== "none") {
        total += prices.features.insurance[requirements.insurance as keyof typeof prices.features.insurance];
      }
      
      // Multiply by quantity
      total *= requirements.quantity;
      
      return total;
    };
    
    setTotalPrice(calculateTotal());
  }, [selectedSize, selectedFeature, requirements]);

  const handleSelectColor = (color: RALColor) => {
    setSelectedColor(color);
  };
  
  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleSelectFeature = (feature: string) => {
    setSelectedFeature(feature);
  };
  
  const handleRequirementsChange = (newRequirements: any) => {
    setRequirements(newRequirements);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 pb-12">
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A3B6E]">Customize Your Container</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="h-full flex flex-col">
              <ContainerPreview 
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                selectedFeature={selectedFeature}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-full">
              <ColorSelector 
                selectedColor={selectedColor} 
                onSelectColor={handleSelectColor}
                onSelectSize={handleSelectSize}
                onSelectFeature={handleSelectFeature}
                requirements={requirements}
                onRequirementsChange={handleRequirementsChange}
              />
            </div>
          </div>
        </div>
        
        {/* Invoice Preview - Full Width Section */}
        <div className="w-full mt-4 mb-6">
          <div className="border rounded-md p-6 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              {/* Left Column - Invoice Details */}
              <div className="md:col-span-6 space-y-3">
                <h2 className="text-xl font-bold mb-6 text-center">Container Customization Invoice</h2>
                {/* Container Base Price */}
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Container Size:</span>
                  <span>{selectedSize === "20ft" ? "20ft Standard" : 
                          selectedSize === "20ft-hc" ? "20ft High Cube" :
                          selectedSize === "40ft" ? "40ft Standard" :
                          selectedSize === "40ft-hc" ? "40ft High Cube" :
                          selectedSize === "45ft-hc" ? "45ft High Cube" :
                          selectedSize === "53ft-hc" ? "53ft High Cube" : "20ft Standard"}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Base Container Price:</span>
                  <span>${prices.containerSize[selectedSize as keyof typeof prices.containerSize].toFixed(2)}</span>
                </div>
                
                {/* Door Configuration (only show if not optional) */}
                {selectedFeature !== "optional" && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Door Configuration:</span>
                      <span>
                        {selectedFeature === "full-open-side" ? "Full Open Side Door" :
                        selectedFeature === "multi-side-door" ? "Multi-Side Door" :
                        selectedFeature === "double-door" ? "Double Door" :
                        selectedFeature === "open-top" ? "Open Top" : ""}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Door Option Price:</span>
                      <span>${prices.features.containerFeature[selectedFeature as keyof typeof prices.features.containerFeature].toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {/* Selected Color */}
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Selected Color:</span>
                  <span>{selectedColor.ral} - {selectedColor.name}</span>
                </div>
                
                {/* Container Add-Ons */}
                {requirements.lockingBox === "yes" && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Lock Box:</span>
                    <span>${prices.features.lockingBox.toFixed(2)}</span>
                  </div>
                )}
                
                {requirements.forkLiftPocket === "yes" && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Fork Lift Pockets:</span>
                    <span>${prices.features.forkLiftPocket.toFixed(2)}</span>
                  </div>
                )}
                
                {requirements.easyOpenDoor === "yes" && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Easy Open Doors:</span>
                    <span>${prices.features.easyOpenDoor.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Insurance Option */}
                {requirements.insurance !== "none" && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Insurance: {requirements.insurance.charAt(0).toUpperCase() + requirements.insurance.slice(1)}</span>
                    <span>${prices.features.insurance[requirements.insurance as keyof typeof prices.features.insurance].toFixed(2)}</span>
                  </div>
                )}
                
                {/* Logo Option */}
                {requirements.logo === "yes" && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Custom Logo:</span>
                    <span>${prices.features.logo.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Quantity */}
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Container Quantity:</span>
                  <span>{requirements.quantity}</span>
                </div>
                
                {/* Total Price */}
                <div className="flex justify-between py-3 mt-4 border-t-2 border-black">
                  <span className="font-bold text-lg">Total Price:</span>
                  <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Right Column - Payment Options */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-center">Proceed to Checkout</h4>
                  
                  {/* Credit Card Payment */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 mb-2 py-3 text-sm"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay with Credit Card
                  </Button>
                  
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-blue-50 px-2 text-gray-500">Or pay with</span>
                    </div>
                  </div>
                  
                  {/* PayPal Payment Options */}
                  <div className="space-y-2">
                    {/* PayPal Pay Now */}
                    <div className="flex justify-center items-center h-[35px] bg-[#ffc439] text-white rounded-md cursor-pointer font-medium text-sm">
                      <PayPalButton 
                        amount={totalPrice.toFixed(2)} 
                        currency="USD" 
                        intent="CAPTURE"
                      />
                    </div>
                    
                    {/* PayPal Credit */}
                    <div className="flex justify-center items-center h-[35px] bg-[#003087] hover:bg-[#002a75] text-white rounded-md cursor-pointer font-medium text-sm transition-colors">
                      PayPal Credit
                    </div>
                    
                    {/* Buy Now Pay Later */}
                    <div className="flex justify-center items-center h-[35px] bg-gradient-to-r from-[#662d91] to-[#9d4edd] hover:from-[#5a2780] hover:to-[#8b44cc] text-white rounded-md cursor-pointer font-medium text-sm transition-all">
                      Buy Now, Pay Later
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
