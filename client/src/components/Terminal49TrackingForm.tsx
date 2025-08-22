import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Clock, Ship, Truck, AlertCircle, Package, Navigation, Activity, CheckCircle, Loader2, Container } from 'lucide-react';
import { useTrackContainer, type Terminal49TrackingResult, type Terminal49Shipment, type Terminal49Container } from '@/hooks/useTerminal49';
import { useToast } from '@/hooks/use-toast';

interface Terminal49TrackingFormProps {
  heroStyle?: boolean;
}

// Comprehensive list of supported shipping carriers with SCAC codes
const supportedShippers = [
  { value: 'MSCU', label: 'MSC (Mediterranean Shipping Company)' },
  { value: 'MAEU', label: 'Maersk Line' },
  { value: 'CMAU', label: 'CMA CGM' },
  { value: 'COSU', label: 'COSCO Shipping' },
  { value: 'HLCU', label: 'Hapag-Lloyd' },
  { value: 'EGLV', label: 'Evergreen Line' },
  { value: 'OOLU', label: 'OOCL (Orient Overseas Container Line)' },
  { value: 'YMLU', label: 'Yang Ming Marine Transport' },
  { value: 'PILU', label: 'Pacific International Lines' },
  { value: 'MOLU', label: 'Mitsui O.S.K. Lines' },
  { value: 'NYKU', label: 'NYK Line (Nippon Yusen)' },
  { value: 'KKLU', label: 'Kawasaki Kisen Kaisha (K Line)' },
  { value: 'ZIMU', label: 'ZIM Integrated Shipping Services' },
  { value: 'WHLC', label: 'Wan Hai Lines' },
  { value: 'HDMU', label: 'Hyundai Merchant Marine' }
];

export default function Terminal49TrackingForm({ heroStyle = false }: Terminal49TrackingFormProps) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedShipper, setSelectedShipper] = useState('');
  const [trackingResult, setTrackingResult] = useState<Terminal49TrackingResult | null>(null);
  const { toast } = useToast();
  
  const trackMutation = useTrackContainer();

  const handleTrack = async () => {
    if (!referenceNumber.trim()) {
      toast({
        title: "Reference Required",
        description: "Please enter a container number, booking number, or bill of lading.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await trackMutation.mutateAsync(referenceNumber.trim());
      setTrackingResult(result);
      
      if (result.success) {
        toast({
          title: "Tracking Successful",
          description: result.shipments?.length 
            ? `Found ${result.shipments.length} shipment(s) with ${result.containers?.length || 0} container(s)`
            : result.message || "Tracking request submitted successfully"
        });
      } else {
        toast({
          title: "Tracking Status",
          description: result.message || "This reference number may not be in Terminal49's current database. If the shipment is actively in transit, tracking data may become available within 24-48 hours.",
          variant: "default"
        });
      }
    } catch (error: any) {
      toast({
        title: "Tracking Failed",
        description: error.message || "An error occurred while tracking",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'loading':
        return 'bg-yellow-100 text-yellow-800';
      case 'departed':
        return 'bg-green-100 text-green-800';
      case 'arriving':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tracking Form */}
      <Card className={heroStyle ? "border-none shadow-none bg-transparent relative" : "relative"}>
        <CardHeader className={heroStyle ? "pb-4" : ""}>
          <CardTitle className={`flex items-center gap-2 ${heroStyle ? 'text-white text-xl' : ''}`}>
            <Container className="h-6 w-6 text-teal-600" />
            Professional Container Tracking
          </CardTitle>
          <CardDescription className={heroStyle ? 'text-white/90 text-base' : ''}>
            Real-time tracking via Terminal49 API for Bill of Lading, Booking Numbers, and Container Numbers across 160+ shipping lines
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-16 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference" className={heroStyle ? 'text-white font-medium' : ''}>Reference Number *</Label>
              <Input
                id="reference"
                placeholder="Enter container number, booking number, or bill of lading"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className={heroStyle ? 'bg-white/20 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipper" className={heroStyle ? 'text-white font-medium' : ''}>Shipping Line (Optional)</Label>
              <Select value={selectedShipper} onValueChange={setSelectedShipper}>
                <SelectTrigger className={heroStyle ? 'bg-white/20 border-white/30 text-white backdrop-blur-sm' : ''}>
                  <SelectValue placeholder="Select shipping line" className={heroStyle ? 'text-white/70' : ''} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Shipping Line</SelectItem>
                  {supportedShippers.map((shipper) => (
                    <SelectItem key={shipper.value} value={shipper.value}>
                      {shipper.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Button 
              onClick={handleTrack} 
              disabled={trackMutation.isPending}
              className={`w-full md:w-auto ${heroStyle ? 'bg-blue-600 hover:bg-teal-600 text-white border-0 font-medium transition-colors duration-300' : 'bg-blue-600 hover:bg-teal-600 text-white transition-colors duration-300'}`}
            >
              {trackMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Track Container
                </>
              )}
            </Button>
            
            {/* Terminal49 Attribution - Mobile Responsive */}
            <div className="flex items-center justify-center md:justify-end gap-2 mt-4 md:mt-0">
              <span className={`text-xs font-medium ${heroStyle ? 'text-white/80' : 'text-gray-600'}`}>
                Powered by:
              </span>
              <img 
                src="/attached_assets/Terminal49-logo_1754436956408.png" 
                alt="Terminal49"
                className={`h-6 w-auto object-contain ${heroStyle ? 'opacity-90' : 'opacity-80'}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingResult && (
        <div className="space-y-4">
          {trackingResult.success && trackingResult.shipments?.length ? (
            trackingResult.shipments.map((shipment: Terminal49Shipment) => (
              <Card key={shipment.id} className="border-l-4 border-l-teal-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {shipment.attributes.shipping_line_name}
                      </CardTitle>
                      <CardDescription>
                        Reference Numbers: {shipment.attributes.ref_numbers.join(', ')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-teal-100 text-teal-800">
                      Active Shipment
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Ship className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Origin Port</p>
                        <p className="text-sm text-gray-600">{shipment.attributes.port_of_lading_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Destination Port</p>
                        <p className="text-sm text-gray-600">{shipment.attributes.port_of_discharge_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">ETA</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(shipment.attributes.destination_eta_at || shipment.attributes.pod_eta_at || '')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {shipment.attributes.pod_vessel_name && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Ship className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Vessel Information</p>
                        <p className="text-sm text-gray-600">
                          {shipment.attributes.pod_vessel_name} 
                          {shipment.attributes.pod_voyage_number && ` - Voyage ${shipment.attributes.pod_voyage_number}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Last Updated: {formatDate(shipment.attributes.updated_at)}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : trackingResult.success && trackingResult.message ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {trackingResult.message}
              </AlertDescription>
            </Alert>
          ) : !trackingResult.success ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {trackingResult.message || 'Unable to track the provided reference number'}
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Container Details */}
          {trackingResult.containers?.length && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Container Details</h3>
              {trackingResult.containers.map((container: Terminal49Container) => (
                <Card key={container.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Container Number</p>
                        <p className="text-sm text-gray-600">{container.attributes.number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Size & Type</p>
                        <p className="text-sm text-gray-600">{container.attributes.size} {container.attributes.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Availability</p>
                        <Badge className={container.attributes.available_for_pickup ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {container.attributes.available_for_pickup ? 'Available for Pickup' : 'Not Available'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Terminal</p>
                        <p className="text-sm text-gray-600">{container.attributes.terminal_name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {container.attributes.pickup_lfd && (
                      <div className="mt-3 p-2 bg-orange-50 rounded">
                        <p className="text-sm font-medium text-orange-800">Last Free Day</p>
                        <p className="text-sm text-orange-600">{formatDate(container.attributes.pickup_lfd)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}