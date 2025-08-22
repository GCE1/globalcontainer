import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, User, MapPin, FileText, Truck, Tag } from 'lucide-react';
import { LuContainer } from 'react-icons/lu';
import { PurchaseCartItem } from '@/hooks/usePurchaseCart';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  company: z.string().optional(),
  phone: z.string().optional(),
  billingAddress: z.string().min(5, 'Please enter a complete billing address'),
  billingCity: z.string().min(2, 'City is required'),
  billingState: z.string().min(2, 'State/Province is required'),
  billingZip: z.string().min(3, 'Zip/Postal code is required'),
  sameAsShipping: z.boolean().default(true),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZip: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer'], {
    required_error: 'Please select a payment method'
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions'
  })
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isProcessing: boolean;
  cartItems: PurchaseCartItem[];
  cartTotal: number;
  shippingCost: number;
  deliveryMethod?: string;
  distanceSurcharge?: number;
  isCalculatingDistance?: boolean;
}

export default function CheckoutForm({ onSubmit, isProcessing, cartItems, cartTotal, shippingCost, deliveryMethod = 'tilt-bed', distanceSurcharge = 0, isCalculatingDistance = false }: CheckoutFormProps) {
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const { toast } = useToast();

  // Detect if this is a wholesale order (items without leasingRecordId)
  const isWholesaleOrder = cartItems.some(item => !item.leasingRecordId && item.condition === 'Wholesale');

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsShipping: true,
      paymentMethod: 'credit_card',
      termsAccepted: false,
    }
  });

  const handleFormSubmit = async (data: CheckoutFormData) => {
    try {
      if (!cartItems || cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart before checkout.",
          variant: "destructive",
        });
        return;
      }

      await onSubmit(data);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cartTotal;
  const totalContainerQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const expeditedFee = 0; // No expedited fee for now
  // For wholesale orders, no shipping costs
  const effectiveShippingCost = isWholesaleOrder ? 0 : shippingCost;
  const effectiveDistanceSurcharge = isWholesaleOrder ? 0 : distanceSurcharge;
  const total = subtotal + effectiveShippingCost + expeditedFee + effectiveDistanceSurcharge;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#42d1bd] mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your container purchase</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#42d1bd]">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#42d1bd]">
                  <MapPin className="h-5 w-5" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="billingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="NY / ON" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingZip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip/Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="10001 / K1A0A6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) => {
                      setSameAsShipping(checked as boolean);
                      form.setValue('sameAsShipping', checked as boolean);
                    }}
                  />
                  <Label htmlFor="sameAsShipping">
                    Shipping address is the same as billing address
                  </Label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-semibold text-[#42d1bd]">Shipping Address</h4>
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Address</FormLabel>
                          <FormControl>
                            <Input placeholder="456 Shipping Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Los Angeles" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="CA / ON" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="90210 / M5V3A8" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wholesale Pickup Notice */}
            {isWholesaleOrder && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <MapPin className="h-5 w-5" />
                    Depot Pickup Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-green-800">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Customer arranges their own pickup at the depot location</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Our team will contact you within 24 hours to coordinate pickup times</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Containers must be picked up within 5 business days of payment</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Customer is responsible for transportation equipment and loading</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#42d1bd]">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Payment Method</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="credit_card"
                            value="credit_card"
                            checked={field.value === 'credit_card'}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="credit_card">Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="debit_card"
                            value="debit_card"
                            checked={field.value === 'debit_card'}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="debit_card">Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="paypal"
                            value="paypal"
                            checked={field.value === 'paypal'}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="bank_transfer"
                            value="bank_transfer"
                            checked={field.value === 'bank_transfer'}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="bank_transfer">Bank Transfer</Label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch('paymentMethod') === 'credit_card' || form.watch('paymentMethod') === 'debit_card') && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You will be redirected to our secure payment processor to complete your {form.watch('paymentMethod') === 'credit_card' ? 'credit card' : 'debit card'} payment.
                    </p>
                  </div>
                )}
                
                {form.watch('paymentMethod') === 'paypal' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}
                
                {form.watch('paymentMethod') === 'bank_transfer' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Bank transfer instructions will be provided after order confirmation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Terms and Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#42d1bd]">
                  <FileText className="h-5 w-5" />
                  Terms and Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={`${!field.value ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className={`${!field.value ? 'text-red-600' : 'text-gray-700'}`}>
                          I agree to the{' '}
                          <a href="/terms-conditions" target="_blank" className="text-blue-600 hover:underline">
                            Terms and Conditions
                          </a>{' '}
                          and understand that this purchase creates a legally binding agreement. *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#42d1bd]">
                  <FileText className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-medium flex items-start gap-2">
                          <LuContainer className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{item.type} Container - {item.condition}</span>
                        </p>
                        <p className="text-gray-500 flex items-center gap-2 ml-6">
                          <Tag className="h-3 w-3 text-green-500" />
                          <span className="font-bold">SKU:</span> {item.sku}
                        </p>
                        <p className="text-gray-500 flex items-start gap-2 ml-6">
                          <MapPin className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{item.depot_name} - {item.city}, {item.state}</span>
                        </p>
                        <p className="text-gray-500 ml-6"><span className="font-bold">Qty:</span> {item.quantity}</p>
                      </div>
                      <p className="font-medium">${((item.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center">No items in cart</p>
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {isWholesaleOrder ? (
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span>Pickup Arrangement:</span>
                        </div>
                        <span className="text-xs text-green-600 ml-6 font-medium">
                          Customer arranges own pickup at depot
                        </span>
                      </div>
                      <span className="text-green-600 font-medium">
                        FREE
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-orange-500" />
                          <span>Shipping:</span>
                        </div>
                        <span className="text-xs text-orange-500 ml-6 font-medium">
                          {deliveryMethod === 'customer-pickup' ? 'Customer Pickup (FREE)' : 
                           deliveryMethod === 'tilt-bed' ? `${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''} × $600 each` :
                           deliveryMethod === 'roll-off' ? `${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''} × $600 each` :
                           deliveryMethod === 'custom-assist' ? `${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''} × $700 each` :
                           `${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''} × $600 each`}
                        </span>
                      </div>
                      <span className={effectiveShippingCost === 0 ? "text-green-600 font-medium" : ""}>
                        {effectiveShippingCost === 0 ? "FREE" : `$${effectiveShippingCost.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                  {!isWholesaleOrder && effectiveDistanceSurcharge > 0 && (
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span>Distance Surcharge:</span>
                        <span className="text-xs text-orange-500 font-medium">
                          {isCalculatingDistance ? 'Calculating...' : `Extended delivery distance (${totalContainerQuantity} container${totalContainerQuantity > 1 ? 's' : ''})`}
                        </span>
                      </div>
                      <span className="text-orange-600 font-medium">
                        {isCalculatingDistance ? '...' : `$${effectiveDistanceSurcharge.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                  {expeditedFee > 0 && (
                    <div className="flex justify-between">
                      <span>Expedited Delivery:</span>
                      <span>${expeditedFee.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                {total >= 99 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <img 
                        src="/attached_assets/PayPal-Buynow-pay-later.png"
                        alt="PayPal Buy Now Pay Later"
                        className="h-12 object-contain"
                      />
                    </div>
                    <p className="text-sm text-blue-800 text-center">
                      Pay in 4 interest-free payments for orders over $99 with PayPal
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#001836] hover:bg-[#42d1bd] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isProcessing || !cartItems || cartItems.length === 0 || !form.watch('termsAccepted')}
                >
                  {isProcessing ? 'Processing...' : 
                   !form.watch('termsAccepted') ? 'Accept Terms to Continue' : 
                   `Complete Purchase - $${total.toLocaleString()}`}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Your payment information is processed securely. We do not store credit card details.
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}