import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import CheckoutForm from '@/components/CheckoutForm';
import Footer from '@/components/Footer';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Menu, X, Home, CreditCard, Lock } from 'lucide-react';
import { LuContainer } from 'react-icons/lu';
import { calculateShippingDistance, getDepotCoordinates } from '@/lib/distanceCalculation';

interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  sameAsShipping: boolean;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  termsAccepted: boolean;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [distanceSurcharge, setDistanceSurcharge] = useState(() => {
    try {
      const stored = localStorage.getItem('gce_distance_surcharge');
      return stored ? parseInt(stored) : 0;
    } catch {
      return 0;
    }
  });
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const { cartItems, isLoading, clearCart } = useSimpleCart();
  const cartTotal = cartItems.reduce((total, item) => {
    let price: number;
    if (typeof item.price === 'string') {
      price = parseFloat(item.price.replace(/[$,]/g, ''));
    } else {
      price = item.price;
    }
    return total + (price * item.quantity);
  }, 0);
  
  // Calculate total container quantity for shipping calculation
  const totalContainerQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const { toast } = useToast();
  
  // Get delivery method from localStorage (set by cart page)
  const getDeliveryMethodFromCart = () => {
    try {
      return localStorage.getItem('gce_delivery_method') || 'tilt-bed';
    } catch {
      return 'tilt-bed';
    }
  };
  
  const getDeliveryCostFromCart = () => {
    try {
      const cost = localStorage.getItem('gce_delivery_cost');
      return cost ? parseInt(cost) : 600;
    } catch {
      return 600;
    }
  };
  
  const selectedDeliveryMethod = getDeliveryMethodFromCart();
  const selectedDeliveryCost = getDeliveryCostFromCart();
  
  // Calculate shipping cost per container (each container needs separate truck)
  const totalShippingCost = selectedDeliveryCost * totalContainerQuantity;
  
  // Calculate distance-based surcharge when shipping address is provided
  const calculateDistanceSurcharge = async (shippingAddress: string) => {
    if (!cartItems.length || selectedDeliveryMethod === 'customer-pickup') {
      setDistanceSurcharge(0);
      return;
    }
    
    // Skip distance calculation for wholesale orders (customers arrange own pickup)
    const hasWholesaleItems = cartItems.some(item => 
      item.condition === 'Wholesale' || 
      item.condition?.toLowerCase() === 'wholesale' ||
      item.sku?.startsWith('WS-')
    );
    
    if (hasWholesaleItems) {
      console.log('🏭 Skipping distance calculation for wholesale orders - customers arrange depot pickup');
      setDistanceSurcharge(0);
      return;
    }

    setIsCalculatingDistance(true);
    try {
      // Get depot coordinates from first cart item (assuming all items from same depot)
      const depotCoords = getDepotCoordinates(cartItems[0]);
      if (!depotCoords) {
        console.warn('Could not determine depot coordinates');
        setDistanceSurcharge(0);
        return;
      }

      const result = await calculateShippingDistance(depotCoords, shippingAddress);
      console.log('Distance calculation result:', result);
      
      // Calculate per container distance surcharge (each container needs separate delivery)
      const perContainerSurcharge = result.surcharge * totalContainerQuantity;
      console.log('🚛 Checkout per-container distance surcharge:', {
        baseSurcharge: result.surcharge,
        containerQuantity: totalContainerQuantity,
        totalDistanceSurcharge: perContainerSurcharge
      });
      
      setDistanceSurcharge(perContainerSurcharge);
      
      if (perContainerSurcharge > 0) {
        toast({
          title: "Distance Surcharge Applied",
          description: `${result.distanceMiles} miles from depot. $${perContainerSurcharge.toLocaleString()} total surcharge for ${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      console.error('Error calculating distance surcharge:', error);
      setDistanceSurcharge(0);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Default shipping options for checkout (these would normally come from cart state)
  const shippingOptions = {
    shippingMethod: 'tilt-bed' as 'tilt-bed' | 'roll-off' | 'custom-assist' | 'customer-pickup',
    doorDirection: 'doors-forward' as 'doors-forward' | 'doors-rearward',
    expeditedDelivery: false,
    payOnDelivery: false,
    distanceMiles: 50, // Default distance for calculation
  };
  
  const referalCode = '';
  const orderNote = '';

  const handleCheckoutSubmit = async (formData: CheckoutData) => {
    setIsProcessing(true);

    try {
      // Calculate distance surcharge first if address is provided
      if (!formData.sameAsShipping && formData.shippingAddress) {
        const fullShippingAddress = `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`;
        await calculateDistanceSurcharge(fullShippingAddress);
      } else if (formData.sameAsShipping) {
        const fullBillingAddress = `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`;
        await calculateDistanceSurcharge(fullBillingAddress);
      }

      const subtotal = cartTotal;
      const baseShippingCost = selectedDeliveryCost; // Use delivery cost from cart
      const expeditedFee = shippingOptions.expeditedDelivery ? 200 : 0;
      const totalShippingCost = baseShippingCost + distanceSurcharge;
      const totalAmount = subtotal + totalShippingCost + expeditedFee;

      const checkoutPayload = {
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          phone: formData.phone,
          billingAddress: formData.billingAddress,
          billingCity: formData.billingCity,
          billingState: formData.billingState,
          billingZip: formData.billingZip,
          shippingAddress: formData.sameAsShipping ? formData.billingAddress : formData.shippingAddress,
          shippingCity: formData.sameAsShipping ? formData.billingCity : formData.shippingCity,
          shippingState: formData.sameAsShipping ? formData.billingState : formData.shippingState,
          shippingZip: formData.sameAsShipping ? formData.billingZip : formData.shippingZip,
        },
        cartItems: cartItems.map(item => ({
          id: item.id,
          sku: item.sku,
          type: item.type,
          condition: item.condition,
          price: item.price,
          depot_name: item.depot_name,
          city: item.city,
          state: item.state,
          quantity: item.quantity,
        })),
        shippingOptions: {
          shippingMethod: shippingOptions.shippingMethod,
          doorDirection: shippingOptions.doorDirection,
          expeditedDelivery: shippingOptions.expeditedDelivery,
          payOnDelivery: shippingOptions.payOnDelivery,
          distanceMiles: shippingOptions.distanceMiles,
        },
        paymentInfo: {
          paymentMethod: formData.paymentMethod,
          paymentId: `sim_${Date.now()}`, // Simulated payment ID for demo
        },
        totals: {
          subtotal,
          shippingCost: totalShippingCost,
          distanceSurcharge,
          expeditedFee,
          totalAmount,
        },
        referralCode: referalCode,
        orderNote: orderNote,
      };

      // Process checkout
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        body: JSON.stringify(checkoutPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart after successful checkout
        clearCart();

        // Show success message
        toast({
          title: "Order Completed Successfully!",
          description: `Order #${result.orderId} has been placed. Invoice #${result.invoiceNumber} has been generated and attached to your account.`,
        });

        // Redirect to order confirmation or customer profile
        setTimeout(() => {
          setLocation(`/order-confirmation?invoice=${result.invoiceNumber}`);
        }, 2000);
      } else {
        throw new Error(result.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate shipping cost based on distance and container count
  const calculateShippingCost = () => {
    const { shippingMethod, expeditedDelivery, distanceMiles } = shippingOptions;
    const miles = distanceMiles || 0;
    const totalContainers = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    let baseCostPerContainer = 0;
    switch (shippingMethod) {
      case 'tilt-bed':
        baseCostPerContainer = (miles * 9) + 150;
        break;
      case 'roll-off':
        baseCostPerContainer = (miles * 9) + 150;
        break;
      case 'custom-assist':
        baseCostPerContainer = (miles * 9) + 250;
        break;
      case 'customer-pickup':
        baseCostPerContainer = 0;
        break;
    }
    
    const totalShippingCost = baseCostPerContainer * totalContainers;
    return expeditedDelivery ? totalShippingCost + 200 : totalShippingCost;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#33d2b9] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#001937] mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some containers to your cart before checkout.</p>
          <button
            onClick={() => setLocation('/')}
            className="bg-[#001937] hover:bg-[#42d1bd] text-white px-6 py-3 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebf8ff]">
      {/* Mobile-Responsive Checkout Header */}
      <header className="header-bg text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center min-h-[4rem]">
            {/* Logo - Left positioned */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img 
                  src="/images/gce-logo.png" 
                  alt="Global Container Exchange Logo" 
                  className="h-12 sm:h-13 md:h-14 lg:h-16 w-auto rounded-md"
                  style={{ 
                    imageRendering: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </Link>
            </div>
            
            {/* Desktop Navigation - hidden on mobile */}
            <div className="hidden md:flex items-center justify-center space-x-3 lg:space-x-6 ml-6 lg:ml-10 flex-1">
              <button 
                onClick={() => setLocation('/')}
                className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Shopping
              </button>
              <button 
                onClick={() => setLocation('/cart')}
                className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart (<span className="text-red-500 font-bold">{cartItems.length}</span>)
              </button>
            </div>
            
            {/* Right side - Checkout info and mobile controls */}
            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-5 ml-auto pl-4 lg:pl-6 border-l border-blue-700/20 flex-shrink-0">
              {/* Checkout Info */}
              <div className="text-right">
                <div className="text-sm md:text-base font-medium text-secondary flex items-center justify-end gap-2">
                  <Lock className="h-4 w-4 text-yellow-400" />
                  Secure Checkout
                </div>
                <div className="text-xs opacity-75">Complete your purchase</div>
              </div>

              {/* Mobile Hamburger Menu */}
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden text-white hover:bg-blue-700/50 hover:text-secondary p-2 rounded-lg border border-blue-600/50 bg-blue-800/30"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-blue-700/20 bg-[#001937]/95 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={() => {
                      setLocation('/');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:text-secondary transition-colors py-2 border-b border-blue-700/20 pb-3"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shopping
                  </button>
                  <button 
                    onClick={() => {
                      setLocation('/cart');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:text-secondary transition-colors py-2 border-b border-blue-700/20 pb-3"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    View Cart (<span className="text-red-400 font-bold">{cartItems.length}</span>)
                  </button>
                  <button 
                    onClick={() => {
                      setLocation('/');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:text-secondary transition-colors py-2 border-b border-blue-700/20 pb-3"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </button>
                  <button 
                    onClick={() => {
                      setLocation('/container-search');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:text-secondary transition-colors py-2 border-b border-blue-700/20 pb-3"
                  >
                    <LuContainer className="h-4 w-4" />
                    Container Search
                  </button>
                  <button 
                    onClick={() => {
                      setLocation('/membership');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:text-secondary transition-colors py-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Membership Plans
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <CheckoutForm 
        onSubmit={handleCheckoutSubmit} 
        isProcessing={isProcessing} 
        cartItems={cartItems || []}
        cartTotal={cartTotal || 0}
        shippingCost={totalShippingCost}
        deliveryMethod={selectedDeliveryMethod}
        distanceSurcharge={distanceSurcharge}
        isCalculatingDistance={isCalculatingDistance}
      />
      
      <Footer />
    </div>
  );
}