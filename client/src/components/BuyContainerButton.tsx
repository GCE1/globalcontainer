import { Button } from "@/components/ui/button";
import { usePurchaseCart } from "@/hooks/usePurchaseCart";
import { ShoppingCart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BuyContainerButtonProps {
  container: {
    id: string;
    sku: string;
    type: string;
    condition: string;
    price: number;
    depot_name: string;
    city?: string;
    state?: string;
  };
  distanceMiles?: number; // Distance from customer to depot
  className?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

export default function BuyContainerButton({
  container,
  distanceMiles,
  className = "",
  variant = "default",
  size = "default",
  showIcon = true,
}: BuyContainerButtonProps) {
  const { addToCart, cartItems } = usePurchaseCart();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  // Check if container is already in cart
  const isInCart = cartItems.some(item => item.sku === container.sku);

  // Check if this is a 20HC unavailable container
  const is20HCUnavailableContainer = (container.type?.toLowerCase().includes('20hc') || 
                                     container.sku?.toLowerCase().includes('20hc')) &&
                                    (container.condition?.toLowerCase().includes('as is') ||
                                     container.condition?.toLowerCase().includes('asis') ||
                                     container.condition?.toLowerCase().includes('cargo worthy') ||
                                     container.condition?.toLowerCase().includes('cargoworthy') ||
                                     container.condition?.toLowerCase().includes('cw') ||
                                     container.condition?.toLowerCase().includes('iicl') ||
                                     container.condition?.toLowerCase().includes('wind and water tight') ||
                                     container.condition?.toLowerCase().includes('wind & water tight') ||
                                     container.condition?.toLowerCase().includes('wwt') ||
                                     container.condition?.toLowerCase().includes('watertight') ||
                                     container.type?.toLowerCase().includes('open top') ||
                                     container.type?.toLowerCase().includes('open-top') ||
                                     container.type?.toLowerCase().includes('ot') ||
                                     container.type?.toLowerCase().includes('double door') ||
                                     container.type?.toLowerCase().includes('double-door') ||
                                     container.type?.toLowerCase().includes('doubledoor') ||
                                     container.type?.toLowerCase().includes('full open') ||
                                     container.type?.toLowerCase().includes('full-open') ||
                                     container.type?.toLowerCase().includes('side door') ||
                                     container.type?.toLowerCase().includes('side-door') ||
                                     container.type?.toLowerCase().includes('sidedoor') ||
                                     container.type?.toLowerCase().includes('multi-side') ||
                                     container.type?.toLowerCase().includes('multi side') ||
                                     container.type?.toLowerCase().includes('multisidedoor') ||
                                     container.type?.toLowerCase().includes('refrigerated') ||
                                     container.type?.toLowerCase().includes('rf'));

  // Check if this is a 53HC unavailable container (CW, IICL, WWT)
  const is53HCUnavailableContainer = (container.type?.toLowerCase().includes('53hc') || 
                                     container.type?.toLowerCase().includes('53 hc') ||
                                     container.sku?.toLowerCase().includes('53hc') ||
                                     container.sku?.toLowerCase().includes('53 hc')) &&
                                    (container.condition?.toLowerCase().includes('cargo worthy') ||
                                     container.condition?.toLowerCase().includes('cargoworthy') ||
                                     container.condition?.toLowerCase().includes('cw') ||
                                     container.condition?.toLowerCase().includes('iicl') ||
                                     container.condition?.toLowerCase().includes('wind water tight') ||
                                     container.condition?.toLowerCase().includes('wind & water tight') ||
                                     container.condition?.toLowerCase().includes('wwt'));



  const handleAddToCart = () => {
    const containerData = {
      sku: container.sku,
      type: container.type,
      condition: container.condition,
      price: container.price,
      depot_name: container.depot_name,
      city: container.city || '',
      state: container.state || '',
      miles: distanceMiles
    };
    
    addToCart(containerData);
    setIsAdded(true);

    // Reset the "added" state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Show disabled button for 20HC unavailable containers
  if (is20HCUnavailableContainer) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`${className} border-gray-400 text-gray-500 bg-gray-100 cursor-not-allowed`}
        disabled
      >
        Unavailable
      </Button>
    );
  }

  // Show disabled button for 53HC unavailable containers
  if (is53HCUnavailableContainer) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`${className} border-gray-400 text-gray-500 bg-gray-100 cursor-not-allowed`}
        disabled
      >
        Unavailable
      </Button>
    );
  }

  if (isInCart) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`${className} border-green-500 text-green-600 hover:bg-green-50`}
        disabled
      >
        {showIcon && <Check className="h-4 w-4 mr-2" />}
        In Cart
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={`${className} ${
        isAdded ? 'bg-green-600 hover:bg-green-700' : ''
      }`}
    >
      {showIcon && (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {isAdded ? 'Added!' : 'Buy Container Now'}
    </Button>
  );
}