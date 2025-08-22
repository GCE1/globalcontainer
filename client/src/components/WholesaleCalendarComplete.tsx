import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Calendar, ChevronLeft, ChevronRight, Container, Truck, Ship, CheckCircle, AlertCircle, Clock, FileText, DollarSign, User, Mail, Phone, MapPin, Navigation, Calendar as CalendarIcon, ChevronUp, Timer, Building2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  type: 'purchased' | 'in_transit' | 'delivered' | 'released';
  containerNumber: string;
  customerName: string;
  location: string;
  amount: number;
  date: string;
  containerType: string;
  condition: string;
  status: string;
  freeDaysRemaining?: number;
  invoiceId?: string;
  releaseNumber?: string;
}

const eventTypeConfig = {
  purchased: { label: 'Container Purchased', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Container },
  in_transit: { label: 'In Transit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: Ship },
  released: { label: 'Released', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: CheckCircle }
};

export default function WholesaleCalendarComplete() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<CalendarEvent | null>(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [releaseNumber, setReleaseNumber] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calendarEvents = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar-events'],
    staleTime: 5 * 60 * 1000,
  });

  const recordReleaseMutation = useMutation({
    mutationFn: async (releaseData: any) => {
      return await apiRequest('POST', '/api/container-releases', releaseData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Container release recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
      setReleaseDialogOpen(false);
      setReleaseNumber('');
      setSelectedContainer(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to record container release",
        variant: "destructive",
      });
      console.error('Error recording release:', error);
    },
  });



  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    console.log('Day clicked:', format(date, 'yyyy-MM-dd'), 'Events:', dayEvents.length);
    if (dayEvents.length > 0) {
      const isCurrentlyExpanded = expandedDate && isSameDay(expandedDate, date);
      setExpandedDate(isCurrentlyExpanded ? null : date);
    }
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const handleContainerRelease = () => {
    if (!selectedContainer || !releaseNumber.trim()) return;
    
    const releaseData = {
      userId: 'current-user', // This will be handled by backend authentication
      containerNumber: selectedContainer.containerNumber,
      releaseNumber: releaseNumber.trim(),
      customerName: selectedContainer.customerName,
      customerLocation: selectedContainer.location,
      containerType: selectedContainer.containerType,
      containerCondition: selectedContainer.condition,
      contractAmount: selectedContainer.amount?.toString() || null,
      freeDaysRemaining: selectedContainer.freeDaysRemaining || null,
      releaseLocation: selectedContainer.location,
      releaseNotes: `Release recorded via calendar for ${selectedContainer.containerNumber}`,
      invoiceId: selectedContainer.invoiceId || null,
      eventType: 'released'
    };
    
    recordReleaseMutation.mutate(releaseData);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001937]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Calendar className="h-6 w-6 text-orange-300" />
                Container Activities Calendar
              </CardTitle>
              <CardDescription>
                Track container lifecycles, release management, and per diem billing
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Legend and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Status Legend */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status Legend</div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  CRITICAL
                </Badge>
                <span className="text-sm">≤ 1 day free time</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  URGENT
                </Badge>
                <span className="text-sm">≤ 3 days free time</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Clock className="h-3 w-3 mr-1" />
                  MONITOR
                </Badge>
                <span className="text-sm">≤ 7 days free time</span>
              </div>
            </div>
            
            {/* Visual Indicators */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Visual Indicators</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300 border-2 border-red-500 relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-sm">Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300 border-2 border-orange-400 relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
                <span className="text-sm">Action Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#001937] text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-sm">Event Count</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Quick Actions</div>
              <div className="text-sm text-gray-600">
                • Click days to expand details<br/>
                • Direct invoice access<br/>
                • Release number management<br/>
                • Per diem tracking
              </div>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map(date => {
              const events = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isExpanded = expandedDate && isSameDay(expandedDate, date);
              
              const criticalEvents = events.filter(e => e.freeDaysRemaining !== undefined && e.freeDaysRemaining <= 1 && (e.type === 'delivered' || e.type === 'purchased'));
              const urgentEvents = events.filter(e => e.freeDaysRemaining !== undefined && e.freeDaysRemaining <= 3 && e.freeDaysRemaining > 1 && (e.type === 'delivered' || e.type === 'purchased'));
              
              return (
                <div
                  key={date.toISOString()}
                  onClick={() => handleDayClick(date)}
                  className={`
                    relative p-2 min-h-[80px] border border-gray-200 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${isExpanded ? 'bg-[#001937]/5 border-[#001937]' : ''}
                    ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(date, 'd')}
                  </div>
                  
                  {events.length > 0 && (
                    <>
                      <div className="space-y-1">
                        {events.slice(0, 2).map(event => {
                          const config = eventTypeConfig[event.type];
                          const isUrgent = event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 3 && (event.type === 'delivered' || event.type === 'purchased');
                          const isCritical = event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 1 && (event.type === 'delivered' || event.type === 'purchased');
                          
                          return (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${config.color} ${
                                isCritical ? 'border-2 border-red-500 animate-pulse' : 
                                isUrgent ? 'border-2 border-orange-400' : ''
                              } relative`}
                            >
                              {event.containerNumber}
                              {isCritical && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                              {isUrgent && !isCritical && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                              )}
                            </div>
                          );
                        })}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500 px-1">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute top-1 right-1">
                        <div className={`w-5 h-5 text-white rounded-full flex items-center justify-center text-xs font-bold ${
                          criticalEvents.length > 0 ? 'bg-red-600 animate-pulse' :
                          urgentEvents.length > 0 ? 'bg-orange-500' : 'bg-[#001937]'
                        }`}>
                          {events.length}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expanded Day Details */}
      {expandedDate && (
        <Card className="mt-6 border-2 border-[#001937]/20">
          <CardHeader className="bg-[#001937]/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-6 w-6 text-orange-300" />
                <div>
                  <CardTitle className="text-xl text-[#001937]">
                    {format(expandedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {getEventsForDate(expandedDate).length} container activities scheduled
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedDate(null)}
                className="text-gray-500 hover:text-[#001937]"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
        
          <CardContent className="pt-6">
            {getEventsForDate(expandedDate).length > 0 ? (
              <div className="space-y-6">
                {getEventsForDate(expandedDate).map(event => {
                  const config = eventTypeConfig[event.type];
                  const IconComponent = config.icon;
                  
                  return (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${config.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-[#001937]">{event.containerNumber}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`${config.color}`}>
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {event.amount > 0 && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ${event.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Transaction Value</div>
                          </div>
                        )}
                      </div>

                      {/* Rich Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Customer Information */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="h-4 w-4 text-blue-500" />
                            Customer Details
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className="font-medium">{event.customerName}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3 text-blue-500" />
                              {event.customerName.toLowerCase().replace(' ', '.')}@company.com
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3 text-green-500" />
                              +1 (555) {Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}
                            </div>
                          </div>
                        </div>

                        {/* Location & Logistics */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="h-4 w-4 text-red-500" />
                            Location & Logistics
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className="font-medium">{event.location}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Navigation className="h-3 w-3 text-yellow-500" />
                              Event Date: {format(new Date(event.date), 'MMM d, h:mm a')}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {event.containerType} - {event.condition}
                            </div>
                          </div>
                        </div>

                        {/* Timeline & Status */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Timer className="h-4 w-4 text-green-500" />
                            Timeline & Status
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className={`font-medium ${
                              event.status === 'active' ? 'text-green-600' :
                              event.status === 'overdue' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </div>
                            {event.type === 'delivered' && event.freeDaysRemaining !== undefined && (
                              <>
                                <div className="text-sm text-gray-600">
                                  Free days: {event.freeDaysRemaining} remaining
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                                  event.freeDaysRemaining > 7 ? 'bg-green-100 text-green-700' :
                                  event.freeDaysRemaining > 3 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {event.freeDaysRemaining > 7 ? 'On Schedule' :
                                   event.freeDaysRemaining > 3 ? 'Attention Needed' : 'Urgent Action Required'}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.releaseNumber && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Released
                          </Badge>
                        )}
                        
                        {event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 1 && (event.type === 'delivered' || event.type === 'purchased') && (
                          <Badge variant="destructive" className="animate-pulse">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            CRITICAL
                          </Badge>
                        )}
                        
                        {event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 3 && event.freeDaysRemaining > 1 && (event.type === 'delivered' || event.type === 'purchased') && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        {!event.releaseNumber ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedContainer(event);
                              setReleaseDialogOpen(true);
                            }}
                            className={`text-white ${
                              (event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 1) ? 'bg-red-600 hover:bg-red-700 animate-pulse' :
                              (event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 3) ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-[#001937] hover:bg-[#33d2b9]'
                            }`}
                          >
                            <Container className="h-4 w-4 mr-1" />
                            {(event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 1) ? 'URGENT: Add Release' : 'Add Release Number'}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedContainer(event);
                              setReleaseDialogOpen(true);
                            }}
                            className="text-[#001937] border-[#001937] hover:bg-[#001937] hover:text-white"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Edit Release: {event.releaseNumber}
                          </Button>
                        )}

                        {event.invoiceId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/api/invoices/${event.invoiceId}/pdf`, '_blank')}
                            className="text-green-700 border-green-200 hover:bg-green-50"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No Activities Scheduled</h3>
                <p className="text-gray-400">This date has no container activities or transactions planned.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Container Release Dialog */}
      <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-600">Record Container Release</DialogTitle>
            <DialogDescription>
              Enter the release number for container pickup
            </DialogDescription>
          </DialogHeader>
          
          {selectedContainer && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-blue-600">Container: {selectedContainer.containerNumber}</div>
                <div className="text-sm text-gray-600"><span className="font-bold">Customer:</span> {selectedContainer.customerName}</div>
                <div className="text-sm text-gray-600"><span className="font-bold">Location:</span> {selectedContainer.location}</div>
                {selectedContainer.freeDaysRemaining !== undefined && (
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">Free Days Remaining:</span> {selectedContainer.freeDaysRemaining}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="releaseNumber" className="text-blue-600">Release Number</Label>
                <Input
                  id="releaseNumber"
                  placeholder="Enter release number (e.g., REL-2024-001)"
                  value={releaseNumber}
                  onChange={(e) => setReleaseNumber(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReleaseDialogOpen(false);
                    setReleaseNumber("");
                    setSelectedContainer(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContainerRelease}
                  disabled={!releaseNumber.trim() || recordReleaseMutation.isPending}
                  className="bg-[#001937] hover:bg-[#33d2b9] text-white"
                >
                  {recordReleaseMutation.isPending ? "Recording..." : "Record Release"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}