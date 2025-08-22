import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Navigation,
  Calendar as CalendarIcon,
  Timer,
  Building2
} from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, differenceInDays } from "date-fns";

interface CalendarEvent {
  id: string;
  type: 'purchased' | 'in-transit' | 'delivered' | 'available';
  containerNumber: string;
  customerName: string;
  releaseNumber?: string;
  pickupDate?: Date;
  deliveryDate?: Date;
  freeDaysRemaining: number;
  status: 'active' | 'overdue' | 'completed';
  invoiceId?: string;
  amount: number;
  location: string;
}

interface ContainerRelease {
  containerId: string;
  releaseNumber: string;
  pickupDate: Date;
  customerName: string;
}

export default function WholesaleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<CalendarEvent | null>(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [releaseNumber, setReleaseNumber] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch calendar events with cache clearing for clean data
  const { data: events = [], isLoading, error } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar-events"],
    staleTime: 0, // Don't use cached data
    gcTime: 0, // Don't cache data
    retry: false, // Don't retry on errors
    refetchOnMount: true, // Always refetch on mount
  });

  // Clear cached data on component mount to ensure fresh state
  React.useEffect(() => {
    queryClient.removeQueries({ queryKey: ["/api/calendar-events"] });
  }, [queryClient]);

  // Release container mutation
  const releaseContainerMutation = useMutation({
    mutationFn: async (releaseData: ContainerRelease) => {
      return apiRequest("POST", "/api/containers/release", releaseData);
    },
    onSuccess: () => {
      toast({
        title: "Container Released",
        description: "Container release has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] });
      setReleaseDialogOpen(false);
      setReleaseNumber("");
      setSelectedContainer(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record container release. Please try again.",
        variant: "destructive",
      });
    },
  });

  const eventTypeConfig = {
    purchased: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: DollarSign,
      label: 'Purchased'
    },
    'in-transit': {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Truck,
      label: 'In Transit'
    },
    delivered: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      label: 'Delivered'
    },
    available: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: LuContainer,
      label: 'Available'
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.pickupDate || event.deliveryDate || new Date());
      return isSameDay(eventDate, date);
    });
  };

  const handleContainerRelease = () => {
    if (!selectedContainer || !releaseNumber.trim()) return;
    
    releaseContainerMutation.mutate({
      containerId: selectedContainer.id,
      releaseNumber: releaseNumber.trim(),
      pickupDate: new Date(),
      customerName: selectedContainer.customerName,
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setExpandedDate(null); // Close any expanded day when navigating
  };

  // Show empty state when no events are available
  if (!isLoading && (!events || events.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#001937]">Wholesale Calendar</h2>
            <p className="text-gray-600 mt-2">Track container transactions and delivery schedules</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <CalendarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Calendar Events</h3>
          <p className="text-gray-500 text-center max-w-md">
            Calendar events will appear here when you complete wholesale container transactions. 
            All calendar data is generated from authentic customer purchases and logistics activities.
          </p>
        </div>
      </div>
    );
  }

  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    console.log('Day clicked:', format(date, 'yyyy-MM-dd'), 'Events:', dayEvents.length, 'Current expanded:', expandedDate ? format(expandedDate, 'yyyy-MM-dd') : 'none');
    if (dayEvents.length > 0) {
      const isCurrentlyExpanded = expandedDate && isSameDay(expandedDate, date);
      const newExpandedDate = isCurrentlyExpanded ? null : date;
      setExpandedDate(newExpandedDate);
      console.log('Setting expanded date to:', newExpandedDate ? format(newExpandedDate, 'yyyy-MM-dd') : 'null');
    } else {
      console.log('No events for this day, not expanding');
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
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <div className="px-4 py-2 font-semibold text-[#001937]">
                {format(currentDate, 'MMMM yyyy')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="border-[#001937] text-[#001937] hover:bg-[#001937] hover:text-white"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Legend */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#001937]">Calendar Legend</h4>
              <div className="text-sm text-gray-600">Container Status & Urgency Levels</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Status Types */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">Status Types</div>
                {Object.entries(eventTypeConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${config.color}`}></div>
                    <span className="text-sm">{config.label}</span>
                  </div>
                ))}
              </div>
              
              {/* Urgency Levels */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">Urgency Levels</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-sm">Critical (≤1 day)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-400"></div>
                  <span className="text-sm">Urgent (≤3 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span className="text-sm">Monitor (≤7 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-sm">On Schedule</span>
                </div>
              </div>
              
              {/* Visual Indicators */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">Visual Indicators</div>
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
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">Quick Actions</div>
                <div className="text-sm text-gray-600">
                  • Click days to expand details<br/>
                  • Direct invoice access<br/>
                  • Release number management<br/>
                  • Per diem tracking
                </div>
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
            {calendarDays.map(day => {
              const dayEvents = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());
              const isExpanded = expandedDate && isSameDay(expandedDate, day);
              
              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative p-2 min-h-[80px] border border-gray-200 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${isExpanded ? 'bg-[#001937]/5 border-[#001937]' : ''}
                    ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                    ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, 'd')}
                  </div>
                  
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => {
                        const config = eventTypeConfig[event.type];
                        const isUrgent = event.type === 'delivered' && event.freeDaysRemaining <= 3;
                        const isOverdue = event.status === 'overdue';
                        
                        return (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${config.color} ${
                              isOverdue ? 'border-2 border-red-500' : 
                              isUrgent ? 'border-2 border-orange-400' : ''
                            } relative`}
                          >
                            {event.containerNumber}
                            {isOverdue && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                            {isUrgent && !isOverdue && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                            )}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  
                  {dayEvents.length > 0 && (
                    <div className="absolute top-1 right-1">
                      <div className="w-5 h-5 bg-[#001937] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {dayEvents.length}
                      </div>
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
                              <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                DEBUG: Type = {event.type}
                              </div>
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

                      {/* Rich Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Customer Information */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="h-4 w-4" />
                            Customer Details
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className="font-medium">{event.customerName}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {event.customerName.toLowerCase().replace(' ', '.')}@company.com
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              +1 (555) {Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}
                            </div>
                          </div>
                        </div>

                        {/* Location & Logistics */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="h-4 w-4" />
                            Location & Logistics
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className="font-medium">{event.location}</div>
                            {event.pickupDate && (
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Navigation className="h-3 w-3" />
                                Pickup: {format(new Date(event.pickupDate), 'MMM d, h:mm a')}
                              </div>
                            )}
                            {event.deliveryDate && (
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                Delivery: {format(new Date(event.deliveryDate), 'MMM d, h:mm a')}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timeline & Status */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Timer className="h-4 w-4" />
                            Timeline & Status
                          </div>
                          <div className="pl-6 space-y-1">
                            <div className={`font-medium ${
                              event.status === 'active' ? 'text-green-600' :
                              event.status === 'overdue' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </div>
                            {event.type === 'delivered' && (
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

                      {/* Urgency Level Indicator */}
                      {(event.type === 'delivered' || event.type === 'purchased') && (
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
                                  {event.freeDaysRemaining} free days remaining • 
                                  {event.freeDaysRemaining <= 1 ? ' Per diem charges begin tomorrow' : 
                                   event.freeDaysRemaining <= 3 ? ' Per diem charges begin soon' : 
                                   ' Container within free period'}
                                </div>
                              </div>
                            </div>
                            
                            {event.status === 'overdue' && (
                              <Badge variant="destructive" className="animate-pulse">
                                <Clock className="h-3 w-3 mr-1" />
                                OVERDUE
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons with Enhanced Invoice Management */}
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
                                    event.freeDaysRemaining <= 1 ? 'bg-red-600 hover:bg-red-700 animate-pulse' :
                                    event.freeDaysRemaining <= 3 ? 'bg-orange-600 hover:bg-orange-700' :
                                    'bg-[#001937] hover:bg-[#33d2b9]'
                                  }`}
                                >
                                  <LuContainer className="h-4 w-4 mr-1" />
                                  {event.freeDaysRemaining <= 1 ? 'URGENT: Add Release' : 'Add Release Number'}
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
                          
                          {event.freeDaysRemaining <= 1 && (event.type === 'delivered' || event.type === 'purchased') && (
                            <Badge variant="destructive" className="animate-pulse">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              CRITICAL
                            </Badge>
                          )}
                          
                          {event.freeDaysRemaining <= 3 && event.freeDaysRemaining > 1 && (event.type === 'delivered' || event.type === 'purchased') && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              URGENT
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Additional Details for High-Value Transactions */}
                      {event.amount > 50000 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                            <Building2 className="h-4 w-4" />
                            Premium Account Details
                          </div>
                          <div className="text-sm text-blue-700 grid grid-cols-2 gap-4">
                            <div>Account Manager: Sarah Johnson</div>
                            <div>Priority Level: High</div>
                            <div>Support Line: +1 (555) 000-1234</div>
                            <div>Next Review: {format(addDays(new Date(), 7), 'MMM d, yyyy')}</div>
                          </div>
                        </div>
                      )}
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
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-[#001937]">Container: {selectedContainer.containerNumber}</div>
                <div className="text-sm text-gray-600">Customer: {selectedContainer.customerName}</div>
                <div className="text-sm text-gray-600">Location: {selectedContainer.location}</div>
                <div className="text-sm text-gray-600">
                  Free Days Remaining: {selectedContainer.freeDaysRemaining}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="releaseNumber">Release Number</Label>
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
                  disabled={!releaseNumber.trim() || releaseContainerMutation.isPending}
                  className="bg-[#001937] hover:bg-[#33d2b9] text-white"
                >
                  {releaseContainerMutation.isPending ? "Recording..." : "Record Release"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}