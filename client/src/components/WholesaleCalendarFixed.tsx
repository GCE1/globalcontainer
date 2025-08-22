import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function WholesaleCalendarFixed() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);

  const { data: calendarEvents = [] } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar-events'],
    staleTime: 5 * 60 * 1000,
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
              
              return (
                <div
                  key={date.toISOString()}
                  onClick={() => handleDayClick(date)}
                  className={`
                    p-3 min-h-[80px] border border-gray-200 cursor-pointer transition-all duration-200
                    ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400'}
                    ${isExpanded ? 'ring-2 ring-[#001937] bg-[#001937]/5' : ''}
                    ${events.length > 0 ? 'hover:shadow-md' : ''}
                  `}
                >
                  <div className="font-semibold mb-1">{format(date, 'd')}</div>
                  {events.length > 0 && (
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-xs">
                        {events.length} events
                      </Badge>
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
        <div className="w-full bg-red-500 p-10 m-10" style={{minHeight: '200px'}}>
          <h1 className="text-white text-4xl font-bold">
            ✅ EXPANDED CONTENT IS WORKING! Date: {format(expandedDate, 'yyyy-MM-dd')}
          </h1>
          <div className="mt-4 bg-yellow-400 p-4 rounded text-black font-bold">
            🎉 Calendar day expansion is now functional! Events: {getEventsForDate(expandedDate).length}
          </div>
          <div className="mt-4 space-y-2">
            {getEventsForDate(expandedDate).map(event => (
              <div key={event.id} className="bg-white p-4 rounded text-black">
                <div className="font-bold">{event.containerNumber}</div>
                <div>Customer: {event.customerName}</div>
                <div>Type: {event.type}</div>
                <div>Amount: ${event.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}