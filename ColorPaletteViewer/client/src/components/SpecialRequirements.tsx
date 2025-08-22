import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Plus, Minus, FileText, CreditCard } from "lucide-react";
import { RALColor } from "@/data/colors";
import { Input } from "@/components/ui/input";
import PayPalButton from "./PayPalButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpecialRequirementsProps {
  selectedColor: RALColor;
  selectedSize?: string;
  selectedFeature?: string;
}

interface Requirements {
  insurance: string;
  containerFeature: string;
  lockingBox: string;
  forkLiftPocket: string;
  easyOpenDoor: string;
  logo: string;
  quantity: number;
}

const SpecialRequirements: React.FC<SpecialRequirementsProps> = ({ selectedColor, selectedSize = "20ft", selectedFeature = "optional" }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [requirements, setRequirements] = useState({
    insurance: "none",
    containerFeature: "optional",
    lockingBox: "no",
    forkLiftPocket: "no",
    easyOpenDoor: "no",
    logo: "no",
    quantity: 1
  });

  const handleValueChange = (name: string, value: string) => {
    setRequirements(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset logo image if logo option is set to "no"
    if (name === "logo" && value === "no") {
      setLogoImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string);
        
        // Show success message
        toast({
          title: "Logo uploaded",
          description: "Your logo has been uploaded successfully.",
          duration: 3000,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Pricing data for calculations
  const prices = {
    basePrice: 0, // Base price is now determined by container size
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
        "lockingBox": 250,
        "forkLiftPocket": 350,
        "easyOpenDoor": 300,
        "ventilation": 250,
        "double-door": 1000,
        "open-top": 2500,
        "full-open-side": 2250,
        "multi-side-door": 2000
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
  
  // Calculate the invoice total
  const calculateTotal = () => {
    // Start with the container size price
    let total = prices.containerSize[selectedSize as keyof typeof prices.containerSize] || prices.containerSize["20ft"];
    
    // Add container feature (door type) cost (always included, "optional" is $0)
    total += prices.features.containerFeature[selectedFeature as keyof typeof prices.features.containerFeature] || 0;
    
    // Add logo cost
    if (requirements.logo === "yes") total += prices.features.logo;
    
    // Add Lock Box cost
    if (requirements.lockingBox === "yes") total += prices.features.lockingBox;
    
    // Add Fork Lift Pockets cost
    if (requirements.forkLiftPocket === "yes") total += prices.features.forkLiftPocket;
    
    // Add Easy Open Doors cost
    if (requirements.easyOpenDoor === "yes") total += prices.features.easyOpenDoor;
    
    // Add insurance costs
    if (requirements.insurance !== "none") {
      total += prices.features.insurance[requirements.insurance as keyof typeof prices.features.insurance];
    }
    
    // Multiply by quantity
    return total * requirements.quantity;
  };

  const handleSaveConfiguration = async () => {
    try {
      setIsSaving(true);
      
      // Here you would normally send the configuration to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Configuration saved!",
        description: "Your container configuration has been saved successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your configuration. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format container feature name for display
  const formatFeatureName = (feature: string) => {
    if (feature === "none") return "None";
    
    return feature
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Generate invoice for current configuration
  const renderInvoice = () => {
    return (
      <div className="space-y-2">
        {/* Container Size */}
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Container Size:</span>
          <span>
            {selectedSize === "20ft" ? "20ft Standard" : 
             selectedSize === "20ft-hc" ? "20ft High Cube" :
             selectedSize === "40ft" ? "40ft Standard" :
             selectedSize === "40ft-hc" ? "40ft High Cube" :
             selectedSize === "45ft-hc" ? "45ft High Cube" :
             selectedSize === "53ft-hc" ? "53ft High Cube" : "20ft Standard"}
          </span>
        </div>
        
        {/* Container Size Price */}
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Base Container Price:</span>
          <span>${prices.containerSize[selectedSize as keyof typeof prices.containerSize].toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Selected RAL Color:</span>
          <span>{selectedColor.ral} - {selectedColor.name}</span>
        </div>
        
        {/* Selected Door Type */}
        {selectedFeature !== "optional" && (
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Door Type:</span>
            <span>
              {selectedFeature === "full-open-side" ? "Full Open Side Door" :
               selectedFeature === "multi-side-door" ? "Multi-Side Door" :
               selectedFeature === "double-door" ? "Double Door" :
               selectedFeature === "open-top" ? "Open Top" : "Optional"}
              {" "}(${prices.features.containerFeature[selectedFeature as keyof typeof prices.features.containerFeature].toFixed(2)})
            </span>
          </div>
        )}
        
        {/* Insurance Option */}
        {requirements.insurance !== "none" && (
          <div className="flex justify-between py-2 border-b">
            <span>Insurance: {requirements.insurance.charAt(0).toUpperCase() + requirements.insurance.slice(1)}</span>
            <span>${prices.features.insurance[requirements.insurance as keyof typeof prices.features.insurance].toFixed(2)}</span>
          </div>
        )}
        
        {/* Container Add-Ons */}
        {requirements.lockingBox === "yes" && (
          <div className="flex justify-between py-2 border-b">
            <span>Lock Box:</span>
            <span>${prices.features.lockingBox.toFixed(2)}</span>
          </div>
        )}
        
        {requirements.forkLiftPocket === "yes" && (
          <div className="flex justify-between py-2 border-b">
            <span>Fork Lift Pockets:</span>
            <span>${prices.features.forkLiftPocket.toFixed(2)}</span>
          </div>
        )}
        
        {requirements.easyOpenDoor === "yes" && (
          <div className="flex justify-between py-2 border-b">
            <span>Easy Open Doors:</span>
            <span>${prices.features.easyOpenDoor.toFixed(2)}</span>
          </div>
        )}
        
        {requirements.logo === "yes" && (
          <div className="flex justify-between py-2 border-b">
            <span>Custom Logo:</span>
            <span>${prices.features.logo.toFixed(2)}</span>
          </div>
        )}
        
        {/* Quantity and Subtotal */}
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Container Quantity:</span>
          <span>{requirements.quantity}</span>
        </div>
        
        <div className="flex justify-between py-2 border-t-2 border-black mt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    );
  };

  // Comment about requirements handling
  // The invoice is now handled at the page level
  
  return (
    <div className="w-full">
      <div className="space-y-2">
        {/* Insurance Option */}
        <div className="flex flex-col gap-1 mb-4">
          <Label className="font-medium text-sm">Insurance Coverage:</Label>
          <Select 
            value={requirements.insurance} 
            onValueChange={(value) => handleValueChange("insurance", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select insurance coverage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Insurance</SelectItem>
              <SelectItem value="basic">Basic Coverage (+$350)</SelectItem>
              <SelectItem value="premium">Premium Coverage (+$800)</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Coverage (+$1,200)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Container Add-Ons Dropdown (multiselect) */}
        <div className="flex flex-col gap-1 mb-4">
          <Label className="font-medium text-sm">Container Add-Ons:</Label>
          <div className="border border-input rounded-md p-2 space-y-2">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="addon-lockbox"
                className="mr-2"
                checked={requirements.lockingBox === "yes"}
                onChange={(e) => handleValueChange("lockingBox", e.target.checked ? "yes" : "no")}
              />
              <Label htmlFor="addon-lockbox" className="text-sm cursor-pointer">Lock Box ($50)</Label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="addon-forklift"
                className="mr-2"
                checked={requirements.forkLiftPocket === "yes"}
                onChange={(e) => handleValueChange("forkLiftPocket", e.target.checked ? "yes" : "no")}
              />
              <Label htmlFor="addon-forklift" className="text-sm cursor-pointer">Fork Lift Pockets ($150)</Label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="addon-easydoor"
                className="mr-2"
                checked={requirements.easyOpenDoor === "yes"}
                onChange={(e) => handleValueChange("easyOpenDoor", e.target.checked ? "yes" : "no")}
              />
              <Label htmlFor="addon-easydoor" className="text-sm cursor-pointer">Easy Open Doors ($150)</Label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <Label className="font-medium text-sm">Logo Option:</Label>
          <RadioGroup 
            value={requirements.logo}
            onValueChange={(value) => handleValueChange("logo", value)} 
            className="flex gap-2" 
            name="logo-option"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="yes" id="logo-yes" />
              <Label htmlFor="logo-yes" className="text-xs">Yes</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="no" id="logo-no" />
              <Label htmlFor="logo-no" className="text-xs">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {requirements.logo === "yes" && (
          <div className="mt-1 mb-1 pl-4">
            <div className="flex flex-col gap-2">
              {logoImage && (
                <div className="mb-2 border p-1 rounded-md w-20 h-20 flex items-center justify-center bg-gray-50">
                  <img 
                    src={logoImage} 
                    alt="Uploaded Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full h-8 text-xs hidden"
                  id="logo-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs flex items-center gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3 w-3" />
                  {logoImage ? "Change Logo" : "Upload Logo"}
                </Button>
                
                {logoImage && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="h-8 text-xs text-red-500 hover:text-red-600"
                    onClick={() => {
                      setLogoImage(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">Upload your company logo (max 2MB)</p>
            </div>
          </div>
        )}
        
        {/* Container Quantity Section */}
        <div className="flex items-center justify-between py-1 mt-4 border-t pt-4">
          <Label className="font-medium text-sm">Container Quantity:</Label>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (requirements.quantity > 1) {
                  handleValueChange("quantity", String(requirements.quantity - 1));
                }
              }}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="w-10 text-center font-medium">
              {requirements.quantity}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleValueChange("quantity", String(requirements.quantity + 1))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* No invoice summary here as it's moved to the full-width section */}
      </div>
    </div>
  );
};

export default SpecialRequirements;