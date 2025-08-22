import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ralColors, type RALColor } from "@/data/colors";
import { Search, ChevronDown, ChevronUp, Layers, Box, DoorOpen } from "lucide-react";
import SpecialRequirements from "@/components/SpecialRequirements";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColorSelectorProps {
  selectedColor: RALColor;
  onSelectColor: (color: RALColor) => void;
  onSelectSize?: (size: string) => void;
  onSelectFeature?: (feature: string) => void;
  requirements?: {
    insurance: string;
    containerFeature: string;
    lockingBox: string;
    forkLiftPocket: string;
    easyOpenDoor: string;
    logo: string;
    quantity: number;
  };
  onRequirementsChange?: (requirements: any) => void;
}

// Container size options - ordered by size with prices
const containerSizes = [
  { id: "20ft", name: "20ft Standard ($2,000)" },
  { id: "20ft-hc", name: "20ft High Cube ($2,750)" },
  { id: "40ft", name: "40ft Standard ($3,500)" },
  { id: "40ft-hc", name: "40ft High Cube ($3,650)" },
  { id: "45ft-hc", name: "45ft High Cube ($6,750)" },
  { id: "53ft-hc", name: "53ft High Cube ($8,550)" },
];

// Container feature options - ordered by price (lowest to highest)
const containerFeatures = [
  { id: "optional", name: "Optional" },
  { id: "double-door", name: "Double Door ($1,000)" },
  { id: "multi-side-door", name: "Multi-Side Door ($2,000)" },
  { id: "full-open-side", name: "Full Open Side Door ($2,250)" },
  { id: "open-top", name: "Open Top ($2,500)" },
];

const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onSelectColor,
  onSelectSize,
  onSelectFeature,
  requirements,
  onRequirementsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColors, setVisibleColors] = useState(ralColors);
  const [isColorGridOpen, setIsColorGridOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("20ft");
  const [selectedFeature, setSelectedFeature] = useState("optional");
  const colorsPerRow = 5;
  const maxRows = 3;
  
  // Calculate initial displayed colors (first 3 rows) and remaining colors (for scrollable section)
  const initialColors = visibleColors.slice(0, colorsPerRow * maxRows);
  const remainingColors = visibleColors.slice(colorsPerRow * maxRows);

  useEffect(() => {
    if (searchTerm) {
      const filtered = ralColors.filter(
        (color) =>
          color.ral.toLowerCase().includes(searchTerm.toLowerCase()) ||
          color.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVisibleColors(filtered);
    } else {
      setVisibleColors(ralColors);
    }
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleColorGrid = () => {
    setIsColorGridOpen(!isColorGridOpen);
  };

  const handleSelectChange = (value: string) => {
    const selectedRalColor = ralColors.find(color => color.ral === value);
    if (selectedRalColor) {
      onSelectColor(selectedRalColor);
    }
  };

  return (
    <Card className="bg-white w-full shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardContent className="p-5 h-full">
        <div className="mb-1">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Color Selection</label>
        </div>

        {/* Color dropdown selector */}
        <div className="mb-2">
          <Select onValueChange={handleSelectChange} defaultValue={selectedColor.ral}>
            <SelectTrigger className="w-full h-8 text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: selectedColor.hex }}
                ></div>
                <SelectValue placeholder="Select a color" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[250px] overflow-y-auto">
              {ralColors.map((color) => (
                <SelectItem key={color.ral} value={color.ral}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-xs">{color.ral} - {color.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expandable color grid toggle */}
        <div className="w-full text-center mb-2">
          <button 
            onClick={toggleColorGrid}
            className="text-sm text-gray-600 flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded"
          >
            {isColorGridOpen ? (
              <>Hide Color Grid <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show Color Grid <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </button>
          
          {/* Color grid - moved here to display directly below the button */}
          {isColorGridOpen && (
            <div className="color-grid mt-2 mb-4 grid grid-cols-5 gap-1 p-2 border rounded-md bg-white max-h-48 overflow-y-auto">
              {ralColors.map((color) => (
                <div
                  key={color.ral}
                  className={`color-item p-1 border rounded cursor-pointer transition-transform hover:scale-105 ${
                    selectedColor.ral === color.ral ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => onSelectColor(color)}
                >
                  <div
                    className="w-full h-6 rounded mb-1"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="text-xs text-center">{color.ral}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Container Size dropdown */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Container Size</label>
          <Select onValueChange={(size) => {
            setSelectedSize(size);
            onSelectSize?.(size);
          }} defaultValue={selectedSize}>
            <SelectTrigger className="w-full h-8 text-xs">
              <div className="flex items-center gap-2">
                <Box className="h-3 w-3 text-gray-500" />
                <SelectValue placeholder="Select a container size" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {containerSizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  <span>{size.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Container Features dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Container Features</label>
          <Select onValueChange={(feature) => {
            setSelectedFeature(feature);
            onSelectFeature?.(feature);
          }} defaultValue={selectedFeature}>
            <SelectTrigger className="w-full h-8 text-xs">
              <div className="flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Select container features" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {containerFeatures.map((feature) => (
                <SelectItem key={feature.id} value={feature.id}>
                  <span>{feature.name.replace(" (Optional)", "")}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Special Requirements section */}
        <div className="mb-4">
          <SpecialRequirements 
            selectedColor={selectedColor} 
            selectedSize={selectedSize} 
            selectedFeature={selectedFeature}
          />
        </div>


      </CardContent>
    </Card>
  );
};

export default ColorSelector;
