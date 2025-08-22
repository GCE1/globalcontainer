import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Ship, Truck, AlertCircle, Bell, Thermometer, Shield, Navigation, Activity, CheckCircle } from 'lucide-react';

interface TrackingResult {
  containerNumber: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
    port?: string;
    terminal?: string;
  };
  destination: {
    address: string;
    port?: string;
    estimatedArrival: string;
  };
  route: {
    waypoints: Array<{
      location: string;
      timestamp: string;
      status: string;
      coordinates?: { lat: number; lng: number };
    }>;
    progress: number;
  };
  vessel?: {
    name: string;
    imo: string;
    flag: string;
  };
  alerts: Array<{
    type: 'delay' | 'deviation' | 'milestone' | 'security' | 'temperature';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  sensorData?: {
    temperature?: number;
    humidity?: number;
    shock?: boolean;
    door?: 'closed' | 'open';
  };
  lastUpdate: string;
}

interface EnhancedTrackingFormProps {
  onTrackingResult: (result: TrackingResult | null) => void;
  heroStyle?: boolean;
}

// Comprehensive list of supported shipping carriers
const supportedShippers = [
  { value: 'msc', label: 'MSC (Mediterranean Shipping Company)', code: 'MSCU' },
  { value: 'maersk', label: 'Maersk Line', code: 'MAEU' },
  { value: 'cma-cgm', label: 'CMA CGM', code: 'CMAU' },
  { value: 'cosco', label: 'COSCO Shipping', code: 'COSU' },
  { value: 'hapag-lloyd', label: 'Hapag-Lloyd', code: 'HLCU' },
  { value: 'evergreen', label: 'Evergreen Line', code: 'EGLV' },
  { value: 'oocl', label: 'OOCL (Orient Overseas Container Line)', code: 'OOLU' },
  { value: 'yang-ming', label: 'Yang Ming Marine Transport', code: 'YMLU' },
  { value: 'pil', label: 'Pacific International Lines', code: 'PILU' },
  { value: 'mol', label: 'Mitsui O.S.K. Lines', code: 'MOLU' },
  { value: 'nyk', label: 'NYK Line (Nippon Yusen)', code: 'NYKU' },
  { value: 'k-line', label: 'Kawasaki Kisen Kaisha (K Line)', code: 'KKLU' },
  { value: 'zim', label: 'ZIM Integrated Shipping Services', code: 'ZIMU' },
  { value: 'hyundai', label: 'Hyundai Merchant Marine', code: 'HMMU' },
  { value: 'sm-line', label: 'SM Line Corporation', code: 'SMLU' },
  { value: 'wan-hai', label: 'Wan Hai Lines', code: 'WHLU' },
  { value: 'tnl', label: 'Transworld Navigation Limited', code: 'TNLU' },
  { value: 'ts-lines', label: 'TS Lines', code: 'TSLU' },
  { value: 'sinokor', label: 'Sinokor Merchant Marine', code: 'SKLU' },
  { value: 'rcl', label: 'Regional Container Lines', code: 'RCLU' },
  { value: 'matson', label: 'Matson Navigation', code: 'MATU' },
  { value: 'apl', label: 'American President Lines', code: 'APLU' },
  { value: 'acl', label: 'Atlantic Container Line', code: 'ACLU' },
  { value: 'arkas', label: 'Arkas Line', code: 'ARKU' },
  { value: 'sealand', label: 'Sealand - A Maersk Company', code: 'SEAU' },
  { value: 'safmarine', label: 'Safmarine', code: 'SAFU' },
  { value: 'hamburg-sud', label: 'Hamburg Süd', code: 'SUDU' },
  { value: 'alianca', label: 'Aliança Navegação', code: 'ALIU' },
  { value: 'one', label: 'Ocean Network Express (ONE)', code: 'ONEU' },
  { value: 'csav', label: 'Compañía Sud Americana de Vapores', code: 'CSAV' },
  { value: 'crowley', label: 'Crowley Maritime', code: 'CRWU' },
  { value: 'tote', label: 'TOTE Maritime', code: 'TOTU' },
  { value: 'grimaldi', label: 'Grimaldi Lines', code: 'GRIU' },
  { value: 'turkon', label: 'Turkon Line', code: 'TRKU' },
  { value: 'uasc', label: 'United Arab Shipping Company', code: 'UASU' },
  { value: 'sinotrans', label: 'Sinotrans Container Lines', code: 'SITU' },
  { value: 'irisl', label: 'Islamic Republic of Iran Shipping Lines', code: 'IRLU' },
  { value: 'emirates', label: 'Emirates Shipping Line', code: 'ESLU' },
  { value: 'heung-a', label: 'Heung-A Shipping', code: 'HASU' },
  { value: 'kmtc', label: 'Korea Marine Transport Co.', code: 'KMTU' },
  { value: 'dongjin', label: 'Dongjin Shipping', code: 'DJSU' }
];

export function EnhancedTrackingForm({ onTrackingResult, heroStyle = false }: EnhancedTrackingFormProps) {
  const [basicSearch, setBasicSearch] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchType, setSearchType] = useState('container');
  const [shippingLine, setShippingLine] = useState('');
  const [containerType, setContainerType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    
    setLoading(true);
    try {
      const endpoint = basicSearch ? '/api/tracking/search' : '/api/tracking/advanced-search';
      const payload = basicSearch 
        ? { trackingNumber, searchType }
        : { trackingNumber, searchType, shippingLine, containerType };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        onTrackingResult(data.data);
      } else {
        onTrackingResult(null);
        console.error('Tracking search failed:', data.message);
      }
    } catch (error) {
      console.error('Tracking search error:', error);
      onTrackingResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (heroStyle) {
    return (
      <div className="w-full">
        <h3 className="text-xl font-semibold mb-4 text-white">Professional Container Tracking</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter container number, booking reference, or BOL"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 bg-white text-gray-900"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {loading ? 'Tracking...' : 'Track Container'}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            <Label className="flex items-center gap-2">
              <Switch 
                checked={!basicSearch} 
                onCheckedChange={(checked) => setBasicSearch(!checked)}
              />
              Advanced Search
            </Label>
            {!basicSearch && (
              <>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-48 bg-white text-gray-900">
                    <SelectValue placeholder="Search Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="container">Container Number</SelectItem>
                    <SelectItem value="booking">Booking Reference</SelectItem>
                    <SelectItem value="bol">Bill of Lading</SelectItem>
                    <SelectItem value="seal">Seal Number</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={shippingLine} onValueChange={setShippingLine}>
                  <SelectTrigger className="w-64 bg-white text-gray-900">
                    <SelectValue placeholder="Choose Shipping Line" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {supportedShippers.map((shipper) => (
                      <SelectItem key={shipper.value} value={shipper.value}>
                        {shipper.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-teal-600" />
          Professional Container Tracking
        </CardTitle>
        <CardDescription>
          Enter your container details to get real-time tracking information with GPS monitoring and automated alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Type Toggle */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="search-type" 
            checked={!basicSearch} 
            onCheckedChange={(checked) => setBasicSearch(!checked)}
          />
          <Label htmlFor="search-type">Advanced Search</Label>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tracking-number">Tracking Number *</Label>
            <Input
              id="tracking-number"
              placeholder="Container number, booking reference, or BOL"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="search-type-select">Search Type</Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="container">Container Number</SelectItem>
                <SelectItem value="booking">Booking Reference</SelectItem>
                <SelectItem value="bol">Bill of Lading</SelectItem>
                <SelectItem value="vessel">Vessel/Voyage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!basicSearch && (
            <>
              <div>
                <Label htmlFor="shipping-line">Shipping Line</Label>
                <Select value={shippingLine} onValueChange={setShippingLine}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select shipping line" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {supportedShippers.map((shipper) => (
                      <SelectItem key={shipper.value} value={shipper.value}>
                        {shipper.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="container-type">Container Type</Label>
                <Select value={containerType} onValueChange={setContainerType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select container type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20dc">20' Dry Container</SelectItem>
                    <SelectItem value="40dc">40' Dry Container</SelectItem>
                    <SelectItem value="40hc">40' High Cube</SelectItem>
                    <SelectItem value="20rf">20' Refrigerated</SelectItem>
                    <SelectItem value="40rf">40' Refrigerated</SelectItem>
                    <SelectItem value="20ot">20' Open Top</SelectItem>
                    <SelectItem value="40ot">40' Open Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <Button 
          onClick={handleSearch} 
          disabled={loading || !trackingNumber.trim()}
          className="w-full bg-teal-600 hover:bg-teal-700"
        >
          {loading ? 'Searching...' : 'Track Container'}
        </Button>
      </CardContent>
    </Card>
  );
}

interface LiveTrackingResultsProps {
  trackingResult: TrackingResult;
}

export function LiveTrackingResults({ trackingResult }: LiveTrackingResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'at port': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Status Card - Styled like old system */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            Container Found: {trackingResult.containerNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700">Status</h4>
              <Badge className="bg-purple-100 text-purple-800">{trackingResult.status}</Badge>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Current Location</h4>
              <p className="text-gray-600">{trackingResult.currentLocation.address}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Destination</h4>
              <p className="text-gray-600">{trackingResult.destination.address}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">ETA</h4>
              <p className="text-gray-600">{new Date(trackingResult.destination.estimatedArrival).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{trackingResult.route.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trackingResult.route.progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="route">Route History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackingResult.vessel && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-4 w-4" />
                    Vessel Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {trackingResult.vessel.name}</div>
                  <div><strong>IMO:</strong> {trackingResult.vessel.imo}</div>
                  <div><strong>Flag:</strong> {trackingResult.vessel.flag}</div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Status:</strong> {trackingResult.status}</div>
                <div><strong>Location:</strong> {trackingResult.currentLocation.address}</div>
                {trackingResult.currentLocation.terminal && (
                  <div><strong>Terminal:</strong> {trackingResult.currentLocation.terminal}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="route" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Timeline</CardTitle>
              <CardDescription>Complete journey history with timestamps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingResult.route.waypoints.map((waypoint, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{waypoint.location}</h4>
                        <Badge variant="outline">{waypoint.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(waypoint.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trackingResult.alerts.length > 0 ? (
                <div className="space-y-3">
                  {trackingResult.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{alert.type}</span>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No active alerts</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4">
          {trackingResult.sensorData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Environmental Sensors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trackingResult.sensorData.temperature && (
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-medium">{trackingResult.sensorData.temperature}°C</span>
                    </div>
                  )}
                  {trackingResult.sensorData.humidity && (
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span className="font-medium">{trackingResult.sensorData.humidity}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Door Status:</span>
                    <Badge variant={trackingResult.sensorData.door === 'closed' ? 'default' : 'destructive'}>
                      {trackingResult.sensorData.door}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Shock Detection:</span>
                    <Badge variant={trackingResult.sensorData.shock ? 'destructive' : 'default'}>
                      {trackingResult.sensorData.shock ? 'Detected' : 'None'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-gray-500 text-center">No sensor data available for this container</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AlertSetupProps {
  containerNumber: string;
  onSetupComplete: (success: boolean) => void;
}

export function AlertSetupModal({ containerNumber, onSetupComplete }: AlertSetupProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState(['milestone', 'delay']);
  const [updateFrequency, setUpdateFrequency] = useState('realtime');
  const [loading, setLoading] = useState(false);

  const alertTypes = [
    { id: 'milestone', label: 'Milestone Updates', description: 'Major status changes and arrivals' },
    { id: 'delay', label: 'Delay Notifications', description: 'Schedule delays and disruptions' },
    { id: 'deviation', label: 'Route Deviations', description: 'Unexpected route changes' },
    { id: 'security', label: 'Security Alerts', description: 'Container security incidents' },
    { id: 'temperature', label: 'Temperature Alerts', description: 'Temperature threshold breaches' }
  ];

  const handleSetupAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tracking/alerts/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerNumber,
          preferences: {
            emailNotifications,
            smsNotifications,
            alertTypes: selectedAlerts,
            updateFrequency
          }
        })
      });

      const data = await response.json();
      onSetupComplete(data.success);
    } catch (error) {
      console.error('Alert setup error:', error);
      onSetupComplete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Setup Tracking Alerts
        </CardTitle>
        <CardDescription>
          Configure notifications for container {containerNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Methods */}
        <div className="space-y-4">
          <h3 className="font-medium">Notification Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch 
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch 
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>
        </div>

        {/* Alert Types */}
        <div className="space-y-4">
          <h3 className="font-medium">Alert Types</h3>
          <div className="space-y-3">
            {alertTypes.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={alert.id}
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAlerts([...selectedAlerts, alert.id]);
                    } else {
                      setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
                    }
                  }}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor={alert.id} className="font-medium">{alert.label}</Label>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Frequency */}
        <div className="space-y-2">
          <Label htmlFor="update-frequency">Update Frequency</Label>
          <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time (as they happen)</SelectItem>
              <SelectItem value="hourly">Hourly Summary</SelectItem>
              <SelectItem value="daily">Daily Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSetupAlerts}
          disabled={loading || (!emailNotifications && !smsNotifications)}
          className="w-full"
        >
          {loading ? 'Setting up alerts...' : 'Setup Alerts'}
        </Button>
      </CardContent>
    </Card>
  );
}