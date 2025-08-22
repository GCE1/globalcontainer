import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, FileText, Truck } from 'lucide-react';
import { LuContainer } from 'react-icons/lu';

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');

  useEffect(() => {
    // Get invoice number from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const invoice = urlParams.get('invoice');
    if (invoice) {
      setInvoiceNumber(invoice);
    }
  }, []);

  const handleDownloadInvoice = async () => {
    if (!invoiceNumber) return;
    
    try {
      const response = await fetch(`/api/invoice/${invoiceNumber}/pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#001937] mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your container order has been successfully processed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuContainer className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoiceNumber && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-blue-900">Invoice Number</p>
                      <p className="text-blue-700">{invoiceNumber}</p>
                    </div>
                    <Button
                      onClick={handleDownloadInvoice}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Payment Confirmed</p>
                    <p className="text-sm text-green-700">Your payment has been successfully processed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Invoice Generated</p>
                    <p className="text-sm text-blue-700">Professional invoice attached to your customer account</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Truck className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Shipping Arranged</p>
                    <p className="text-sm text-orange-700">Our logistics team will contact you within 24 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#001937] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Order Processing</h4>
                    <p className="text-sm text-gray-600">We'll verify container availability and prepare your order for shipment.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#42d1bd] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Logistics Coordination</h4>
                    <p className="text-sm text-gray-600">Our team will contact you to schedule delivery based on your shipping preferences.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Container Delivery</h4>
                    <p className="text-sm text-gray-600">Your container will be delivered according to the agreed schedule and specifications.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our customer service team is here to assist you with any questions about your order.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Customer Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Account Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Your Customer Account</h3>
              <p className="text-gray-600 mb-4">
                A customer profile has been created for you with this order. Your invoice and order history are now attached to your account.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setLocation('/')}
                  className="bg-[#001937] hover:bg-[#42d1bd]"
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/contact')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-[#001937] rounded-full flex items-center justify-center">
              <LuContainer className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#001937]">Global Container Exchange</h4>
              <p className="text-sm text-gray-600">Your Trusted Container Procurement Partner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}