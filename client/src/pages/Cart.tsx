import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, ShoppingCart, ArrowLeft, Truck, Plus, Minus, Hash, MapPin, DollarSign, Tag, Ship, Package, MapPin as Compass, RefreshCw } from 'lucide-react';
import { LuContainer } from 'react-icons/lu';
import { useToast } from '@/hooks/use-toast';
import { calculateShippingDistance, getDepotCoordinates } from '@/lib/distanceCalculation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Container image mapping function - same as AdvancedContainerSearch
const getContainerImage = (type: string, condition: string, sku?: string) => {
  if (!type || !condition) return '/attached_assets/40HC-New/40HC New.png';
  
  const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '');
  const containerType = type.toLowerCase().trim(); // Trim whitespace from type
  const skuLower = sku?.toLowerCase() || '';
  

  
  // Check for special container types in SKU
  const isRefrigerated = skuLower.includes('rf') || skuLower.includes('reefer');
  const isOpenTop = skuLower.includes('ot') || skuLower.includes('opentop');
  const isDoubleDoor = skuLower.includes('dd') || skuLower.includes('doubledoor');
  const isSideDoor = skuLower.includes('sd') || skuLower.includes('sidedoor');
  
  // 20DC container mappings
  if (containerType === '20dc') {
    if (isDoubleDoor) return '/attached_assets/20DD-New/20GP-Doubledoor.png';
    
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/20GP-New/20GP-New.png';
      case 'iicl': return '/attached_assets/20GP-IICL/20GP-IICL.png';
      case 'cargoworthy': return '/attached_assets/20GP-Cw/20GP CW.png';
      case 'windandwatertight': return '/attached_assets/20GP-WWT/20GP-WWT.png';
      default: return '/attached_assets/Container.png';
    }
  }
  
  // 40HC container mappings
  if (containerType === '40hc') {
    if (isRefrigerated) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/40HC-RF-CW/40HC-RF-CW.png';
      return '/attached_assets/40HC-RF-New/40HC-RF-New.png';
    }
    if (isOpenTop) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/40HC-OT-CW/40HC-OT-CW.png';
      return '/attached_assets/40HC-OT-New/40HC-OT-New.png';
    }
    if (isDoubleDoor) return '/attached_assets/40HC-DD-New/40HC-DD-New.png';
    if (isSideDoor) return '/attached_assets/40HC-SD-New/40HC-SD-New.png';
    
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/40HC-New/40HC New.png';
      case 'iicl': return '/attached_assets/40HC-IICL/40HC-IICL.png'; 
      case 'cargoworthy': return '/attached_assets/40HC-CW/40HC-CW.png';
      case 'windandwatertight': return '/attached_assets/40HC-WWT/40HC-WWT.png';
      case 'asis': return '/attached_assets/40HC-AS-IS/40HCAS-IS.png';
      case 'wholesale': return '/attached_assets/40HC-CW/40HC-CW.png'; // Map wholesale to cargo worthy
      default: return '/attached_assets/40HC-New/40HC New.png';
    }
  }
  
  // 40DC/40GP container mappings (with CW variations)
  if (containerType === '40dc' || containerType === '40gp' || containerType.includes('40gp') || containerType.includes('40gp cw')) {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/40GP-New/40GP-Brandnew.png';
      case 'cargoworthy': 
      case 'cw':
      case 'wholesale': // Map wholesale to cargo worthy
        return '/attached_assets/40GP-CW/40GP-CW-2.png';
      case 'windandwatertight': return '/attached_assets/40GP-WWT/40GP-WWT.png';
      case 'asis': return '/attached_assets/40GP-AS-IS/40GPAS-IS.png';
      default: return '/attached_assets/40GP-CW/40GP-CW-2.png'; // Default to CW for 40GP
    }
  }
  
  // 20DC/20GP container mappings (with CW variations)  
  if (containerType === '20dc' || containerType === '20gp' || containerType.includes('20gp') || containerType.includes('20gp cw')) {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/20GP-New/20GP-New.png';
      case 'iicl': return '/attached_assets/20GP-IICL/20GP-IICL.png';
      case 'cargoworthy':
      case 'cw':
      case 'wholesale': // Map wholesale to cargo worthy
        return '/attached_assets/20GP-Cw/20GP CW.png';
      case 'windandwatertight': return '/attached_assets/20GP-WWT/20GP-WWT.png';
      default: return '/attached_assets/20GP-Cw/20GP CW.png'; // Default to CW for 20GP
    }
  }
  
  // Default fallback
  return '/attached_assets/40HC-New/40HC New.png';
};

interface CartPageProps {
  mode?: 'consumer' | 'b2b';
}

export default function Cart({ mode = 'consumer' }: CartPageProps) {
  const { cartItems, removeFromCart, isLoading, clearCart } = useSimpleCart();
  
  // Detect cart environment based on cart item origins
  const getCartEnvironment = () => {
    // Check cart items for context
    const hasWholesaleItems = cartItems.some(item => 
      item.condition === 'Wholesale' || 
      item.leasingRecordId?.includes('wholesale_')
    );
    const hasLeasingItems = cartItems.some(item => 
      item.leasingRecordId && !item.leasingRecordId.includes('wholesale_')
    );
    
    if (hasWholesaleItems) return 'Wholesale Manager';
    if (hasLeasingItems) return 'Leasing Manager';
    
    // Default to public purchases
    return 'GCE Platform';
  };
  
  const cartEnvironment = getCartEnvironment();
  
  // Initialize delivery method from localStorage or default to tilt-bed
  const getInitialDeliveryMethod = () => {
    try {
      return localStorage.getItem('gce_delivery_method') || 'tilt-bed';
    } catch {
      return 'tilt-bed';
    }
  };
  
  const getInitialDeliveryCost = () => {
    try {
      const cost = localStorage.getItem('gce_delivery_cost');
      return cost ? parseInt(cost) : 600;
    } catch {
      return 600;
    }
  };
  
  // Get customer zip code from search (stored during container search)
  const getCustomerZipCode = () => {
    try {
      // Check multiple possible storage keys for customer zip code
      const zipCode = localStorage.getItem('gce_customer_zipcode') || 
                     localStorage.getItem('gce_search_zipcode') || 
                     localStorage.getItem('gce_postal_code') ||
                     localStorage.getItem('search_postal_code') || '';
      
      console.log('🗺️ Retrieved customer zip code:', zipCode);
      return zipCode;
    } catch {
      return '';
    }
  };
  
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(getInitialDeliveryMethod);
  const [deliveryCost, setDeliveryCost] = useState(getInitialDeliveryCost);
  const [distanceSurcharge, setDistanceSurcharge] = useState(() => {
    try {
      const stored = localStorage.getItem('gce_distance_surcharge');
      return stored ? parseFloat(stored) : 0;
    } catch {
      return 0;
    }
  });
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  // Use actual customer postal code from search
  const [customerZipCode, setCustomerZipCode] = useState(() => {
    // Clear any cached postal codes to ensure we get the correct one
    try {
      // Remove the Fort McMurray test postal code that was cached
      const cachedPostal = localStorage.getItem('gce_customer_zipcode');
      if (cachedPostal === 'T9H 1R6') {
        console.log('🧹 Clearing cached Fort McMurray test postal code');
        localStorage.removeItem('gce_customer_zipcode');
      }
    } catch (error) {
      console.warn('Error clearing cached postal code:', error);
    }
    
    const zipCode = getCustomerZipCode();
    console.log('📍 Using customer postal code for distance calculation:', zipCode);
    return zipCode;
  });
  
  // Function to update quantity
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    // Since we don't have updateQuantity in useSimpleCart, we'll simulate it
    // For now, just remove and add logic would be needed in the hook
  };
  
  // No additional leasing options needed - per diem model handles everything

  // Calculate cart total - handle both string and number prices
  const cartSubtotal = cartItems.reduce((total, item) => {
    let price: number;
    if (typeof item.price === 'string') {
      // Handle string prices like "$2,040" from leasing
      price = parseFloat(item.price.replace(/[$,]/g, ''));
    } else {
      // Handle numeric prices from container purchases
      price = item.price;
    }
    return total + (price * (item.quantity || 1));
  }, 0);

  // Check if cart contains wholesale items (no shipping needed)
  const hasWholesaleItems = cartItems.some(item => 
    item.condition === 'Wholesale' || 
    item.condition?.toLowerCase() === 'wholesale' ||
    item.sku?.startsWith('WS-')
  );

  // Calculate total container quantity for shipping calculation
  const totalContainerQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Calculate shipping cost per container (each container needs separate truck) 
  // Wholesale orders have no shipping cost (customers arrange pickup)
  const totalShippingCost = hasWholesaleItems ? 0 : deliveryCost * totalContainerQuantity;
  
  // Calculate total including shipping per container and distance surcharge
  // Wholesale orders have no distance surcharge (depot pickup only)
  const cartTotal = cartSubtotal + totalShippingCost + (hasWholesaleItems ? 0 : distanceSurcharge);

  // Calculate delivery cost based on selected method
  const calculateDeliveryCost = (method: string) => {
    switch (method) {
      case 'tilt-bed':
        return 600;
      case 'roll-off':
        return 600;
      case 'custom-assist':
        return 700;
      case 'customer-pickup':
        return 0;
      default:
        return 600;
    }
  };

  // Calculate distance-based surcharge using customer's zip code from search
  const calculateDistanceSurcharge = async () => {
    console.log('🚚 Starting distance calculation with:', {
      cartItemsLength: cartItems.length,
      selectedDeliveryMethod,
      customerZipCode
    });

    if (!cartItems.length || !customerZipCode) {
      console.log('❌ Skipping distance calculation - missing requirements');
      setDistanceSurcharge(0);
      localStorage.setItem('gce_distance_surcharge', '0');
      return;
    }

    // Skip distance calculation only for customer pickup
    if (selectedDeliveryMethod === 'customer-pickup') {
      console.log('⭕ No distance surcharge for customer pickup');
      setDistanceSurcharge(0);
      localStorage.setItem('gce_distance_surcharge', '0');
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
      localStorage.setItem('gce_distance_surcharge', '0');
      return;
    }

    setIsCalculatingDistance(true);
    try {
      // Get depot coordinates from first cart item (assuming all items from same depot)
      const depotCoords = getDepotCoordinates(cartItems[0]);
      console.log('🏭 Depot coordinates:', depotCoords);
      
      if (!depotCoords) {
        console.warn('⚠️ Could not determine depot coordinates');
        setDistanceSurcharge(0);
        localStorage.setItem('gce_distance_surcharge', '0');
        return;
      }

      console.log('📏 Calculating distance from depot to customer:', customerZipCode);
      const result = await calculateShippingDistance(depotCoords, customerZipCode);
      console.log('📊 Distance calculation result:', result);
      
      // Calculate per container distance surcharge (each container needs separate delivery)
      const perContainerSurcharge = result.surcharge * totalContainerQuantity;
      console.log('🚛 Per-container distance surcharge:', {
        baseSurcharge: result.surcharge,
        containerQuantity: totalContainerQuantity,
        totalDistanceSurcharge: perContainerSurcharge
      });
      
      console.log('🔄 Setting distance surcharge state to:', perContainerSurcharge);
      setDistanceSurcharge(perContainerSurcharge);
      localStorage.setItem('gce_distance_surcharge', perContainerSurcharge.toString());
      console.log('✅ Distance surcharge state updated:', perContainerSurcharge);
      
      // Force re-render by updating cart total
      const newTotal = cartSubtotal + totalShippingCost + perContainerSurcharge;
      console.log('🔄 Updating cart total with surcharge:', newTotal);
      
      if (perContainerSurcharge > 0) {
        console.log('💰 Distance surcharge applied:', perContainerSurcharge);
        toast({
          title: "Distance Surcharge Applied",
          description: `${result.distanceMiles} miles from depot. $${perContainerSurcharge.toLocaleString()} total surcharge for ${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''}.`,
        });
      } else {
        console.log('✓ No distance surcharge needed (within 50 miles)');
      }
      
      return; // Successfully completed
    } catch (error) {
      console.error('❌ Error calculating distance surcharge:', error);
      // Don't reset surcharge on error - calculation might have succeeded
      // setDistanceSurcharge(0);
      // localStorage.setItem('gce_distance_surcharge', '0');
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Auto-calculate distance surcharge when cart items or delivery method changes
  useEffect(() => {
    if (customerZipCode && cartItems.length > 0) {
      // Force delivery method to tilt-bed if it's customer-pickup for testing
      if (selectedDeliveryMethod === 'customer-pickup') {
        console.log('🔄 Changing delivery method from customer-pickup to tilt-bed for distance calculation');
        handleDeliveryMethodChange('tilt-bed');
      } else {
        // Clear previous calculation and recalculate
        console.log('♻️ Recalculating distance with updated logic...');
        calculateDistanceSurcharge();
      }
    }
  }, [cartItems.length, selectedDeliveryMethod, customerZipCode]);

  // Handle delivery method change and recalculate cost
  const handleDeliveryMethodChange = (method: string) => {
    setSelectedDeliveryMethod(method);
    const newCost = calculateDeliveryCost(method);
    setDeliveryCost(newCost);
    
    // Save selected delivery method to localStorage for checkout
    localStorage.setItem('gce_delivery_method', method);
    localStorage.setItem('gce_delivery_cost', newCost.toString());
  };

  // Calculate total including delivery
  const totalWithDelivery = cartTotal + deliveryCost;

  // Optimized loading - minimal loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <Navbar />
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-[#33d2b9] border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  // Only show empty state if we're not loading AND cart is actually empty
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some containers to get started</p>
            <Link href="/container-search">
              <Button className="bg-[#001937] hover:bg-[#33d2b9] text-white">
                Browse Container Inventory
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={
            cartEnvironment === 'Wholesale Manager' ? "/wholesale-manager" :
            cartEnvironment === 'Leasing Manager' ? "/leasing-manager" : 
            "/container-search"
          }>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {cartEnvironment === 'GCE Platform' ? 'Container Search' : cartEnvironment}
            </Button>
          </Link>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3bc1b2' }}>Review Your Order</h2>
          <p className="text-gray-600">
            {cartEnvironment === 'Leasing Manager' 
              ? "Review your leasing contracts and proceed to checkout"
              : cartEnvironment === 'Wholesale Manager'
              ? "Review your wholesale orders and proceed to checkout"
              : "Review your container purchases and proceed to checkout"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-[#ebf8ff]">
              <CardHeader className="bg-[#ebf8ff] flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2" style={{ color: '#3bc1b2' }}>
                  <LuContainer className="h-5 w-5" />
                  Your Cart Items ({cartItems.length})
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4 bg-[#ebf8ff] p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg bg-white p-4 sm:p-6 space-y-4">
                    {/* Mobile Layout: Stack everything vertically */}
                    <div className="block sm:hidden">
                      {/* Container Image - Full width on mobile */}
                      <div className="w-full h-32 mb-3">
                        <img 
                          src={item.type && item.condition ? getContainerImage(item.type, item.condition, item.sku) : `/attached_assets/40HC-New/40HC New.png`}
                          alt={`${item.type || item.containerSize} Container`}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/attached_assets/40HC-New/40HC New.png';
                          }}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="space-y-2 mb-4">
                        {item.leasingRecordId ? (
                          // Leasing item display
                          <>
                            <h3 className="font-semibold text-lg">{item.origin} → {item.destination}</h3>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600"><span className="text-black font-medium">Container:</span> {item.containerSize}</p>
                              <p className="text-gray-600"><span className="text-black font-medium">Price:</span> {item.price}</p>
                              <p className="text-gray-600"><span className="text-black font-medium">Free Days:</span> {item.freeDays}</p>
                              <p className="text-gray-600"><span className="text-black font-medium">Per Diem:</span> {item.perDiem}</p>
                            </div>
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                                <LuContainer className="h-4 w-4 text-green-600" />
                                Leasing Contract Ready
                              </p>
                            </div>
                          </>
                        ) : (
                          // Container purchase item display
                          <>
                            <h3 className="font-semibold text-lg">{item.type} Container</h3>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600 flex items-center gap-2">
                                <LuContainer className="h-4 w-4 text-blue-500" />
                                <span className="text-black font-medium">SKU:</span> {item.sku}
                              </p>
                              <p className="text-gray-600 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-green-500" />
                                <span className="text-black font-medium">Condition:</span> {item.condition}
                              </p>
                              <p className="text-gray-600 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="text-black font-medium">Price:</span> ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                              </p>
                              <div className="text-gray-600 flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-black font-medium">Location:</span> {item.depot_name}, {item.city}, {item.state}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                              <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                <LuContainer className="h-4 w-4 text-blue-600" />
                                Purchase Contract Ready
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Price and Controls - Bottom section on mobile */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <p className="text-lg font-bold text-blue-600">
                            {typeof item.price === 'number' ? `$${item.price.toLocaleString()}` : `$${item.price}`}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout: Horizontal flex layout */}
                    <div className="hidden sm:flex items-start space-x-4">
                      {/* Container Image */}
                      <div className="flex-shrink-0 w-32 h-24">
                        <img 
                          src={item.type && item.condition ? getContainerImage(item.type, item.condition, item.sku) : `/attached_assets/40HC-New/40HC New.png`}
                          alt={`${item.type || item.containerSize} Container`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/attached_assets/40HC-New/40HC New.png';
                          }}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        {item.leasingRecordId ? (
                          // Leasing item display
                          <>
                            <h3 className="font-semibold text-lg">{item.origin} → {item.destination}</h3>
                            <p className="text-gray-600"><span className="text-black">Container:</span> {item.containerSize}</p>
                            <p className="text-gray-600"><span className="text-black">Price:</span> {item.price}</p>
                            <p className="text-gray-600"><span className="text-black">Free Days:</span> {item.freeDays}</p>
                            <p className="text-gray-600"><span className="text-black">Per Diem:</span> {item.perDiem}</p>
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                                <LuContainer className="h-4 w-4 text-green-600" />
                                Leasing Contract Ready
                              </p>
                            </div>
                          </>
                        ) : (
                          // Container purchase item display
                          <>
                            <h3 className="font-semibold text-lg">{item.type} Container</h3>
                            <p className="text-gray-600 flex items-center gap-2">
                              <LuContainer className="h-4 w-4 text-blue-500" />
                              <span className="text-black">SKU:</span> {item.sku}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                              <Tag className="h-4 w-4 text-green-500" />
                              <span className="text-black">Condition:</span> {item.condition}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-black">Price:</span> ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                            </p>
                            <div className="text-gray-600 flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-black">Location:</span> {item.depot_name}, {item.city}, {item.state}
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                              <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                <LuContainer className="h-4 w-4 text-blue-600" />
                                Purchase Contract Ready
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-lg font-bold text-blue-600">
                          {typeof item.price === 'number' ? `$${item.price.toLocaleString()}` : `$${item.price}`}
                        </p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Dynamic Information Based on Cart Type */}
            {cartItems.some(item => item.leasingRecordId) ? (
              // Leasing Information
              <Card className="bg-[#ebf8ff]">
                <CardHeader className="bg-[#ebf8ff]">
                  <CardTitle className="flex items-center gap-2" style={{ color: '#3bc1b2' }}>
                    <LuContainer className="h-5 w-5" />
                    Leasing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-[#ebf8ff] p-6">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Pickup Information:</strong> All containers must be picked up at the designated depot location. 
                      Our team will coordinate the pickup schedule with you after lease confirmation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : hasWholesaleItems ? (
              // Wholesale Information - Customer arranges pickup
              <Card className="bg-[#ebf8ff]">
                <CardHeader className="bg-[#ebf8ff]">
                  <CardTitle className="flex items-center gap-2" style={{ color: '#3bc1b2' }}>
                    <LuContainer className="h-5 w-5" />
                    Pickup Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-[#ebf8ff] p-6">
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm text-orange-800">
                      <strong>Depot Pickup Required:</strong> All wholesale containers must be picked up at the depot location. 
                      You are responsible for arranging transportation from the depot to your final destination.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Shipping Information for Container Purchases
              <Card className="bg-[#ebf8ff]">
                <CardHeader className="bg-[#ebf8ff]">
                  <CardTitle className="flex items-center gap-2" style={{ color: '#3bc1b2' }}>
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-[#ebf8ff] p-6 space-y-4">
                  {/* Container Position */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-800">Container Position</Label>
                    <Select defaultValue="doors-inward">
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select container position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doors-inward">
                          <div className="flex items-center gap-2">
                            <LuContainer className="h-4 w-4 text-blue-500" />
                            Doors face Inward
                          </div>
                        </SelectItem>
                        <SelectItem value="doors-rearward">
                          <div className="flex items-center gap-2">
                            <LuContainer className="h-4 w-4 text-green-500" />
                            Doors faced Rearward
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Delivery Method Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-800">Delivery Method</Label>
                    <Select value={selectedDeliveryMethod} onValueChange={handleDeliveryMethodChange}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select delivery method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tilt-bed">
                          <div className="flex justify-between items-center w-full min-w-[280px]">
                            <span>Tilt-bed Delivery</span>
                            <span className="text-green-600 font-medium ml-8">$600</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="roll-off">
                          <div className="flex justify-between items-center w-full min-w-[280px]">
                            <span>Roll-off Delivery</span>
                            <span className="text-blue-600 font-medium ml-8">$600</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom-assist">
                          <div className="flex justify-between items-center w-full min-w-[280px]">
                            <span>Custom Assist Delivery</span>
                            <span className="text-orange-600 font-medium ml-8">$700</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="customer-pickup">
                          <div className="flex justify-between items-center w-full min-w-[280px]">
                            <span>Customer Pickup (7 days)</span>
                            <span className="text-cyan-600 font-medium ml-8">FREE</span>  
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-800">Delivery Address</Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Address will be collected at checkout</strong>
                      </p>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div className="flex items-center gap-2">
                          <Compass className="h-3 w-3" />
                          Transit time: 7-14 business days
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3" />
                          Shipping cost calculated at checkout
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <Card className="bg-[#ebf8ff]">
              <CardHeader className="bg-[#ebf8ff]">
                <CardTitle style={{ color: '#3bc1b2' }}>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="bg-[#ebf8ff] p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${cartSubtotal.toLocaleString()}</span>
                </div>
                
                {/* Delivery Cost - Hidden for wholesale orders */}
                {!hasWholesaleItems && (
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">Delivery ({selectedDeliveryMethod.replace('-', ' ')})</span>
                      </div>
                      <span className="text-xs text-orange-500 ml-6 font-medium">
                        {totalContainerQuantity} container{totalContainerQuantity > 1 ? 's' : ''} × ${deliveryCost.toLocaleString()} each
                      </span>
                    </div>
                    <span className={deliveryCost === 0 ? "text-green-600 font-medium" : "text-gray-800"}>
                      {deliveryCost === 0 ? "FREE" : `$${totalShippingCost.toLocaleString()}`}
                    </span>
                  </div>
                )}

                {/* Distance Surcharge - Hidden for wholesale orders */}
                {!hasWholesaleItems && customerZipCode && distanceSurcharge > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">Distance Surcharge</span>
                      </div>
                      <span className="text-xs text-orange-500 ml-6 font-medium">
                        {isCalculatingDistance ? 'Calculating distance...' : `Extended delivery distance (${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''})`}
                      </span>
                    </div>
                    <span className="text-orange-600 font-medium">
                      {isCalculatingDistance ? '...' : `$${distanceSurcharge.toLocaleString()}`}
                    </span>
                  </div>
                )}



                {/* Show customer zip code if available - Hidden for wholesale orders */}
                {customerZipCode && !hasWholesaleItems && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Delivery to ZIP: {customerZipCode}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={calculateDistanceSurcharge}
                      className="text-xs p-1 h-6"
                      disabled={isCalculatingDistance}
                    >
                      <RefreshCw className={`h-3 w-3 ${isCalculatingDistance ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                )}
                

                
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{cartItems.some(item => item.leasingRecordId) ? "Total Lease Amount" : "Total Purchase Amount"}</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <Link href="/checkout">
                  <Button
                    className="w-full bg-[#001937] hover:bg-[#33d2b9] text-white"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}