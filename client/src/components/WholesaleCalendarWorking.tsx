import { useState, useEffect } from 'react';
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
import { Calendar, ChevronLeft, ChevronRight, Truck, Ship, CheckCircle, AlertCircle, Clock, FileText, DollarSign, User, Mail, Phone, MapPin, Navigation, CalendarIcon, ChevronUp } from 'lucide-react';
import { LuContainer } from 'react-icons/lu';

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
  purchased: { label: 'Container Purchased', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: LuContainer },
  in_transit: { label: 'In Transit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: Ship },
  released: { label: 'Released', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: CheckCircle }
};

export default function WholesaleCalendarWorking() {
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

  const releaseContainerMutation = useMutation({
    mutationFn: async (data: { containerId: string; releaseNumber: string }) => {
      return await apiRequest('/api/containers/release', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] });
      setReleaseDialogOpen(false);
      setSelectedContainer(null);
      setReleaseNumber('');
      toast({
        title: "Success",
        description: "Container release number recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record release number",
        variant: "destructive",
      });
    },
  });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    setExpandedDate(null);
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const handleDayClick = (date: Date) => {
    const events = getEventsForDate(date);
    console.log('Day clicked:', format(date, 'yyyy-MM-dd'), 'Events:', events.length, 'Current expanded:', expandedDate ? format(expandedDate, 'yyyy-MM-dd') : 'none');
    
    if (events.length === 0) {
      console.log('No events for this day, not expanding');
      return;
    }

    if (expandedDate && isSameDay(expandedDate, date)) {
      console.log('Setting expanded date to:', 'null');
      setExpandedDate(null);
    } else {
      console.log('Setting expanded date to:', format(date, 'yyyy-MM-dd'));
      setExpandedDate(date);
    }
  };

  const handleReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContainer && releaseNumber.trim()) {
      releaseContainerMutation.mutate({
        containerId: selectedContainer.id,
        releaseNumber: releaseNumber.trim()
      });
    }
  };

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
              <CardTitle className="flex items-center gap-2 text-[#001937]">
                <Calendar className="h-6 w-6" />
                Container Activities Calendar
              </CardTitle>
              <CardDescription>
                View and manage container transactions, deliveries, and tracking
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="border-[#001937] text-[#001937] hover:bg-[#001937] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold text-[#001937] min-w-[140px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="border-[#001937] text-[#001937] hover:bg-[#001937] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Urgency Legend */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Urgency Indicators:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm">Critical (≤1 day)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Urgent (≤3 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm">Monitor (≤7 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm">On Schedule</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600 border-b">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map(date => {
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
                    p-3 min-h-[80px] border border-gray-200 cursor-pointer transition-all duration-200 relative
                    ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400'}
                    ${isExpanded ? 'ring-2 ring-[#001937] bg-[#001937]/5' : ''}
                    ${events.length > 0 ? 'hover:shadow-md' : ''}
                  `}
                >
                  <div className="font-semibold mb-1">{format(date, 'd')}</div>
                  {events.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {events.length}
                        </Badge>
                        {criticalEvents.length > 0 && (
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        )}
                        {urgentEvents.length > 0 && (
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        )}
                      </div>
                      {events.slice(0, 2).map(event => {
                        const config = eventTypeConfig[event.type];
                        return (
                          <div key={event.id} className={`text-xs p-1 rounded ${config.color}`}>
                            {event.containerNumber}
                          </div>
                        );
                      })}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-500">+{events.length - 2} more</div>
                      )}
                    </div>
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
                <CalendarIcon className="h-6 w-6 text-[#001937]" />
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
                              {event.freeDaysRemaining !== undefined && (
                                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Free Days: {event.freeDaysRemaining}
                                </div>
                              )}
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

                      {/* Customer Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Customer</div>
                          <div className="font-medium">{event.customerName}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Location</div>
                          <div className="font-medium">{event.location}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Container Type</div>
                          <div className="font-medium">{event.containerType}</div>
                        </div>
                      </div>

                      {/* Urgency Level Indicator */}
                      {(event.type === 'delivered' || event.type === 'purchased') && event.freeDaysRemaining !== undefined && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between p-3 rounded-lg border-l-4" 
                               style={{
                                 borderLeftColor: event.freeDaysRemaining <= 1 ? '#dc2626' : 
                                                event.freeDaysRemaining <= 3 ? '#f59e0b' : 
                                                event.freeDaysRemaining <= 7 ? '#3b82f6' : '#10b981',
                                 backgroundColor: event.freeDaysRemaining <= 1 ? '#fef2f2' : 
                                                event.freeDaysRemaining <= 3 ? '#fefbf2' : 
                                                event.freeDaysRemaining <= 7 ? '#eff6ff' : '#f0fdf4'
                               }}>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded-full ${
                                event.freeDaysRemaining <= 1 ? 'bg-red-100' : 
                                event.freeDaysRemaining <= 3 ? 'bg-orange-100' : 
                                event.freeDaysRemaining <= 7 ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                <AlertCircle className={`h-4 w-4 ${
                                  event.freeDaysRemaining <= 1 ? 'text-red-600' : 
                                  event.freeDaysRemaining <= 3 ? 'text-orange-600' : 
                                  event.freeDaysRemaining <= 7 ? 'text-blue-600' : 'text-green-600'
                                }`} />
                              </div>
                              <div>
                                <div className={`font-semibold ${
                                  event.freeDaysRemaining <= 1 ? 'text-red-800' : 
                                  event.freeDaysRemaining <= 3 ? 'text-orange-800' : 
                                  event.freeDaysRemaining <= 7 ? 'text-blue-800' : 'text-green-800'
                                }`}>
                                  {event.freeDaysRemaining <= 1 ? 'CRITICAL - IMMEDIATE ACTION REQUIRED' : 
                                   event.freeDaysRemaining <= 3 ? 'URGENT - ACTION NEEDED SOON' : 
                                   event.freeDaysRemaining <= 7 ? 'ATTENTION - MONITOR CLOSELY' : 'ON SCHEDULE'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {event.freeDaysRemaining} free days remaining
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {event.invoiceId ? (
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#001937] text-[#001937] hover:bg-[#001937] hover:text-white"
                                onClick={() => window.open(`/invoices/${event.invoiceId}`, '_blank')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Invoice #{event.invoiceId}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                onClick={() => window.open(`/invoices/${event.invoiceId}/download`, '_blank')}
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                Download PDF
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Generate Invoice
                            </Button>
                          )}
                          
                          {(event.type === 'delivered' || event.type === 'purchased') && (
                            <div className="flex items-center gap-2">
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
                                  <LuContainer className="h-4 w-4 mr-1" />
                                  {(event.freeDaysRemaining !== undefined && event.freeDaysRemaining <= 1) ? 'URGENT: Add Release' : 'Add Release Number'}
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedContainer(event);
                                    setReleaseNumber(event.releaseNumber || '');
                                    setReleaseDialogOpen(true);
                                  }}
                                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Edit Release: {event.releaseNumber}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {event.releaseNumber && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
            <DialogTitle>Record Container Release</DialogTitle>
            <DialogDescription>
              Enter the release number for container pickup
            </DialogDescription>
          </DialogHeader>
          
          {selectedContainer && (
            <form onSubmit={handleReleaseSubmit} className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-[#001937]">Container: {selectedContainer.containerNumber}</div>
                <div className="text-sm text-gray-600">Customer: {selectedContainer.customerName}</div>
                <div className="text-sm text-gray-600">Location: {selectedContainer.location}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="releaseNumber">Release Number</Label>
                <Input
                  id="releaseNumber"
                  value={releaseNumber}
                  onChange={(e) => setReleaseNumber(e.target.value)}
                  placeholder="Enter release number..."
                  required
                />
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReleaseDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!releaseNumber.trim() || releaseContainerMutation.isPending}
                  className="flex-1 bg-[#001937] hover:bg-[#33d2b9] text-white"
                >
                  {releaseContainerMutation.isPending ? "Recording..." : "Record Release"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}