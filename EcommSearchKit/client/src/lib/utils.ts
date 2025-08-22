import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const containerTypes = [
  { id: "20DC", name: "20ft Dry Container" },
  { id: "40DC", name: "40ft Dry Container" },
  { id: "20HC", name: "20ft High Cube" },
  { id: "40HC", name: "40ft High Cube" },
  { id: "45HC", name: "45ft High Cube" },
  { id: "53HC", name: "53ft High Cube" },
  { id: "20RF", name: "20ft Refrigerated" },
  { id: "40RF", name: "40ft Refrigerated" },
  { id: "20OT", name: "20ft Open Top" },
  { id: "40OT", name: "40ft Open Top" },
  { id: "20SD", name: "20ft Side Door" },
  { id: "40SD", name: "40ft Side Door" },
  { id: "20DD", name: "20ft Double Door" },
  { id: "40DD", name: "40ft Double Door" },
  { id: "40PW", name: "40ft Pallet Wide" },
  { id: "45PW", name: "45ft Pallet Wide" },
];

export const containerConditions = [
  { id: "Brand New", name: "Brand New", class: "container-condition-new" },
  { id: "Cargo Worthy", name: "Cargo Worthy", class: "container-condition-used" },
  { id: "Wind and Water Tight", name: "Wind & Water Tight", class: "container-condition-used" },
  { id: "IICL", name: "IICL Certified", class: "container-condition-used" },
  { id: "AS IS", name: "As Is", class: "container-condition-damaged" },
];

export const regions = [
  { id: "all", name: "All States" },
  { id: "TX", name: "Texas" },
  { id: "CO", name: "Colorado" },
  { id: "MI", name: "Michigan" },
  { id: "GA", name: "Georgia" },
  { id: "MD", name: "Maryland" },
  { id: "IL", name: "Illinois" },
  { id: "OH", name: "Ohio" },
  { id: "FL", name: "Florida" },
  { id: "CA", name: "California" },
  { id: "TN", name: "Tennessee" },
  { id: "MN", name: "Minnesota" },
  { id: "VA", name: "Virginia" },
  { id: "LA", name: "Louisiana" },
  { id: "NY", name: "New York" },
  { id: "OR", name: "Oregon" },
  { id: "WA", name: "Washington" },
  { id: "MO", name: "Missouri" },
  { id: "KY", name: "Kentucky" },
];

export const sortOptions = [
  { id: "relevance", name: "Most Relevant" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "newest", name: "Newest First" },
  { id: "location", name: "Closest Location" },
];

export const membershipPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    popular: false,
    features: [
      "Container leasing options",
      "5% discount on purchases",
      "Basic customer support"
    ],
    color: "primary"
  },
  {
    id: "intermediate",
    name: "Intermediate",
    price: 99,
    popular: true,
    features: [
      "Flexible leasing terms",
      "10% discount on purchases",
      "Priority customer support",
      "Early inventory access"
    ],
    color: "accent"
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    popular: false,
    features: [
      "Premium leasing options",
      "15% discount on purchases",
      "24/7 dedicated support",
      "First access to new inventory"
    ],
    color: "primary-dark"
  }
];

export const memberBenefits = [
  {
    icon: "shield",
    text: "Secured lease rates for 12-month terms"
  },
  {
    icon: "lightning",
    text: "Priority shipping and preferential delivery schedules"
  },
  {
    icon: "clipboard",
    text: "Customized container specifications and modifications"
  },
  {
    icon: "currency-dollar",
    text: "Volume discounts and special pricing on bulk orders"
  }
];
