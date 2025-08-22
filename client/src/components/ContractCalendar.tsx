import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarIcon, Clock, Container } from "lucide-react";
import type { LeasingContract } from "@shared/schema";

interface ContractCalendarProps {
  contracts?: LeasingContract[];
}

export function ContractCalendar({ contracts = [] }: ContractCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get contracts for the selected date
  const contractsForDate = contracts.filter(contract => {
    const startDate = parseISO(contract.startDate.toString());
    const endDate = parseISO(contract.endDate.toString());
    return selectedDate >= startDate && selectedDate <= endDate;
  });

  // Get contract events (start and end dates)
  const contractEvents = contracts.reduce((events, contract) => {
    const startDate = parseISO(contract.startDate.toString());
    const endDate = parseISO(contract.endDate.toString());
    
    events.push({
      date: startDate,
      type: 'start',
      contract,
      title: `Contract Start: ${contract.contractNumber}`
    });
    
    events.push({
      date: endDate,
      type: 'end',
      contract,
      title: `Free Period Ends: ${contract.contractNumber}`
    });
    
    return events;
  }, [] as Array<{
    date: Date;
    type: 'start' | 'end';
    contract: LeasingContract;
    title: string;
  }>);

  // Check if a date has contract events
  const hasContractEvents = (date: Date) => {
    return contractEvents.some(event => isSameDay(event.date, date));
  };

  // Check if a date is within any contract period
  const isWithinContractPeriod = (date: Date) => {
    return contracts.some(contract => {
      const startDate = parseISO(contract.startDate.toString());
      const endDate = parseISO(contract.endDate.toString());
      return date >= startDate && date <= endDate;
    });
  };

  // Show empty state when no contracts are available
  if (!contracts || contracts.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Contract Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Container className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Contracts</h3>
              <p className="text-gray-500 text-center max-w-md">
                Leasing contracts will appear here when customers activate new contracts through the platform. 
                All contract data is generated from authentic customer leasing transactions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Contract Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  contractEvent: (date) => hasContractEvents(date),
                  contractPeriod: (date) => isWithinContractPeriod(date)
                }}
                modifiersStyles={{
                  contractEvent: {
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold'
                  },
                  contractPeriod: {
                    backgroundColor: '#22c55e',
                    color: 'white'
                  }
                }}
              />
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Active Contract Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Contract Start/End Date</span>
                </div>
              </div>
            </div>

            {/* Selected Date Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                </h3>
                
                {contractsForDate.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Active contracts for this date:
                    </p>
                    {contractsForDate.map((contract) => {
                      const startDate = parseISO(contract.startDate.toString());
                      const endDate = parseISO(contract.endDate.toString());
                      const isStartDate = isSameDay(selectedDate, startDate);
                      const isEndDate = isSameDay(selectedDate, endDate);
                      
                      return (
                        <Card key={contract.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="font-mono">
                                  {contract.contractNumber}
                                </Badge>
                                <Badge 
                                  variant={contract.status === 'active' ? 'default' : 'secondary'}
                                >
                                  {contract.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Container className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{contract.containerSize}</span>
                                <span className="text-slate-600">x{contract.quantity}</span>
                              </div>
                              
                              <div className="text-sm text-slate-600">
                                <div>{contract.origin} → {contract.destination}</div>
                                <div className="flex items-center gap-4 mt-1">
                                  <span>Free Days: {contract.freeDays}</span>
                                  <span>Per Diem: ${contract.perDiemRate}/day</span>
                                </div>
                              </div>
                              
                              {(isStartDate || isEndDate) && (
                                <div className="mt-2">
                                  <Badge 
                                    variant={isStartDate ? "default" : "destructive"}
                                    className="text-xs"
                                  >
                                    {isStartDate && <Clock className="h-3 w-3 mr-1" />}
                                    {isStartDate ? "Contract Starts Today" : "Free Period Ends Today"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">
                    No active contracts for this date.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Contract Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Contract Events</CardTitle>
        </CardHeader>
        <CardContent>
          {contractEvents.length > 0 ? (
            <div className="space-y-3">
              {contractEvents
                .filter(event => event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-slate-600">
                        {event.contract.containerSize} • {event.contract.origin} → {event.contract.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{format(event.date, 'MMM dd, yyyy')}</div>
                      <Badge 
                        variant={event.type === 'start' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {event.type === 'start' ? 'Start' : 'End'}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-slate-500">No upcoming contract events.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}