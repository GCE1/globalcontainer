import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface CartItem {
  // Container purchase data
  sku?: string;
  type?: string;
  condition?: string;
  depot_name?: string;
  city?: string;
  state?: string;
  
  // Leasing data
  leasingRecordId?: string;
  origin?: string;
  destination?: string;
  containerSize?: string;
  freeDays?: number | string;
  perDiem?: string;
  
  // Common fields
  price: number | string;
  quantity?: number;
}

interface AddToCartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCart: () => void;
  onContinueShopping: () => void;
  item: CartItem | null;
}

export default function AddToCartConfirmModal({ 
  isOpen, 
  onClose, 
  onProceedToCart, 
  onContinueShopping, 
  item 
}: AddToCartConfirmModalProps) {
  const [showButtons, setShowButtons] = useState(false);
  

  
  useEffect(() => {
    console.log('AddToCartConfirmModal: isOpen changed to:', isOpen, 'item:', item);
    if (isOpen) {
      // Show buttons immediately for better UX
      setShowButtons(true);
    } else {
      setShowButtons(false);
    }
  }, [isOpen, item]);
  
  if (!item) {
    return null;
  }

  // Determine if this is a leasing item or purchase item

  // Leasing items have leasingRecordId, wholesale items have condition === 'Wholesale'
  const isLeasingItem = !!item.leasingRecordId;
  
  // Multiple robust checks for wholesale items
  const isWholesaleItem = 
    item.condition === 'Wholesale' || 
    item.condition?.toLowerCase() === 'wholesale' ||
    item.sku?.startsWith('WS-') ||
    item.id?.includes('wholesale');
  
  // Function to get container title
  const getContainerTitle = () => {
    if (isLeasingItem) {
      return `${item.containerSize || 'Container'} Leasing`;
    }
    
    // For wholesale/purchase items
    if (isWholesaleItem) {
      return `${item.type} Container - ${item.condition}`;
    }
    
    // Default for other container types
    if (!item.type || !item.condition) return 'Container Purchase';
    
    const skuLower = item.sku?.toLowerCase() || '';
    let title = `${item.type} Container - ${item.condition}`;
    
    // Add special type descriptions based on SKU
    if (skuLower.includes('sd') || skuLower.includes('sidedoor')) {
      title = `${item.type} Side Door Container - ${item.condition}`;
    } else if (skuLower.includes('dd') || skuLower.includes('doubledoor')) {
      title = `${item.type} Double Door Container - ${item.condition}`;
    } else if (skuLower.includes('ot') || skuLower.includes('opentop')) {
      title = `${item.type} Open Top Container - ${item.condition}`;
    } else if (skuLower.includes('rf') || skuLower.includes('reefer')) {
      title = `${item.type} Refrigerated Container - ${item.condition}`;
    }
    
    return title;
  };
  
  // Format price to ensure single dollar sign
  const formatPrice = (price: number | string) => {
    const priceStr = String(price);
    // Remove existing dollar signs and clean the price
    const cleanPrice = priceStr.replace(/\$/g, '').replace(/,/g, '');
    const numPrice = parseFloat(cleanPrice);
    if (isNaN(numPrice)) return '$0';
    return `$${numPrice.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[9999] bg-white shadow-2xl border-2 border-[#33d2b9] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-[#33d2b9]" />
            <span>Added to Cart!</span>
          </DialogTitle>
          <DialogDescription>
            Your {isLeasingItem ? 'leasing contract' : isWholesaleItem ? 'wholesale container' : 'container'} has been successfully added to your cart.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="font-semibold text-lg">
              {getContainerTitle()}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {isLeasingItem ? (
                // Leasing item details
                <>
                  <div><span className="font-bold text-blue-600">Container Size:</span> {item.containerSize}</div>
                  <div><span className="font-bold text-blue-600">Origin Port:</span> {item.origin}</div>
                  <div><span className="font-bold text-blue-600">Destination Port:</span> {item.destination}</div>
                  <div><span className="font-bold text-blue-600">Lease Price:</span> <span className="text-green-600 font-medium">{formatPrice(item.price)}</span></div>
                  <div><span className="font-bold text-blue-600">Free Days:</span> <span className="text-orange-600 font-medium">{item.freeDays || 0} days</span></div>
                  <div><span className="font-bold text-blue-600">Per Diem Rate:</span> <span className="text-red-600 font-medium">{item.perDiem || 'N/A'}</span></div>
                  <div><span className="font-bold text-blue-600">Quantity:</span> <span className="text-green-600 font-medium">{item.quantity || 1}</span></div>
                </>
              ) : (
                // Container purchase details
                <>
                  <div><span className="font-bold text-blue-600">SKU:</span> {item.sku}</div>
                  <div><span className="font-bold text-blue-600">Type:</span> {item.type}</div>
                  <div><span className="font-bold text-blue-600">Condition:</span> {item.condition}</div>
                  <div><span className="font-bold text-blue-600">Price:</span> <span className="text-green-600 font-medium">{formatPrice(item.price)}</span></div>
                  <div><span className="font-bold text-blue-600">Location:</span> {item.depot_name}, {item.city}, {item.state}</div>
                  <div><span className="font-bold text-blue-600">Quantity:</span> <span className="text-green-600 font-medium">{item.quantity || 1}</span></div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          {!showButtons ? (
            <div className="flex-1 text-center py-2">
              <div className="animate-pulse text-[#33d2b9] font-medium">Processing...</div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onContinueShopping}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={onProceedToCart}
                className="flex-1 bg-[#33d2b9] hover:bg-[#2bb8a6] text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}