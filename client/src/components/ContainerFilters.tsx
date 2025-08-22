import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ContainerFiltersProps {
  containerSize: string;
  containerType: string;
  containerCondition: string;
  onSizeChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onConditionChange: (value: string) => void;
}

// Authentic container data from CSV file
const containerSizes = [
  { id: "20DC", name: "20' Dry Container" },
  { id: "20HC", name: "20' High Cube" },
  { id: "40DC", name: "40' Dry Container" },
  { id: "40HC", name: "40' High Cube" },
  { id: "45HC", name: "45' High Cube" },
  { id: "53HC", name: "53' High Cube" }
];

const containerTypes = [
  { id: "Standard Container", name: "Standard Container" },
  { id: "Open Top Container", name: "Open Top Container" },
  { id: "Double Door Container", name: "Double Door Container" },
  { id: "Full Open Side", name: "Full Open Side" },
  { id: "Multi-Side Door", name: "Multi-Side Door" },
  { id: "Refrigerated Container", name: "Refrigerated Container" }
];

const containerConditions = [
  { id: "AS IS", name: "AS IS" },
  { id: "Brand New", name: "Brand New" },
  { id: "Cargo Worthy", name: "Cargo Worthy" },
  { id: "IICL", name: "IICL" },
  { id: "Wind and Water Tight", name: "Wind and Water Tight" }
];

export default function ContainerFilters({
  containerSize,
  containerType,
  containerCondition,
  onSizeChange,
  onTypeChange,
  onConditionChange
}: ContainerFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Container Size Filter */}
      <div className="space-y-2">
        <Label htmlFor="container-size" className="text-white">Container Size</Label>
        <Select value={containerSize} onValueChange={onSizeChange}>
          <SelectTrigger id="container-size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {containerSizes.map((size) => (
              <SelectItem key={size.id} value={size.id}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Container Type Filter */}
      <div className="space-y-2">
        <Label htmlFor="container-type" className="text-white">Container Type</Label>
        <Select value={containerType} onValueChange={onTypeChange}>
          <SelectTrigger id="container-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {containerTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Container Condition Filter */}
      <div className="space-y-2">
        <Label htmlFor="container-condition" className="text-white">Container Condition</Label>
        <Select value={containerCondition} onValueChange={onConditionChange}>
          <SelectTrigger id="container-condition">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {containerConditions.map((condition) => (
              <SelectItem key={condition.id} value={condition.id}>
                {condition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}