import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";
import { getCategoryVariant, getVariantColorClass, type CategoryVariant } from "@/utils/categoryColors";

interface MobileMonthViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  categoryMappings: { [slug: string]: CategoryVariant };
  onEventClick?: (event: Event) => void;
  onMonthChange?: (date: Date) => void;
  currentDate?: Date; // Add controlled prop
}

export function MobileMonthView({ events, eventMetadata, categoryMappings, onEventClick, onMonthChange, currentDate: controlledDate }: MobileMonthViewProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [internalMonth, setInternalMonth] = React.useState<Date>(new Date());
  const currentMonth = controlledDate || internalMonth; // Use controlled or internal
  
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (!controlledDate) {
      setInternalMonth(newMonth); // Only update internal state if not controlled
    }
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (!controlledDate) {
      setInternalMonth(newMonth); // Only update internal state if not controlled
    }
    onMonthChange?.(newMonth);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === selectedDate.getDate() && 
             eventDate.getMonth() === selectedDate.getMonth() && 
             eventDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  const hasEventsOnDate = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const selectedDateEvents = getEventsForSelectedDate();

  // Simple calendar implementation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  // Calculate minimum days needed (only complete weeks)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysNeeded = firstDayOfMonth.getDay() + daysInMonth;
  const weeksNeeded = Math.ceil(totalDaysNeeded / 7);
  const totalDays = weeksNeeded * 7;
  
  for (let i = 0; i < totalDays; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return (
    <Card className="w-full py-4 mobile-calendar bg-white dark:bg-card border-gray-200 dark:border-border">
      <CardContent className="px-4">
        {/* Simple calendar header with navigation */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Prev</span>
          </Button>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-foreground text-center flex-1 min-w-0 truncate">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="flex-shrink-0"
          >
            <span className="hidden xs:inline">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium py-2 text-gray-900 dark:text-foreground">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === month;
            const isSelected = selectedDate && 
              day.getDate() === selectedDate.getDate() && 
              day.getMonth() === selectedDate.getMonth() && 
              day.getFullYear() === selectedDate.getFullYear();
            const isToday = day.toDateString() === new Date().toDateString();
            const hasEvents = hasEventsOnDate(day);
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  p-2 text-sm rounded transition-colors relative focus:outline-none
                  ${isCurrentMonth ? 'text-gray-900 dark:text-foreground' : 'text-gray-500 dark:text-muted-foreground'}
                  ${isSelected ? 'bg-blue-500 dark:bg-primary text-white dark:text-primary-foreground hover:bg-blue-600 dark:hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-muted'}
                  ${isToday && !isSelected ? 'bg-gray-200 dark:bg-muted font-semibold' : ''}
                `}
              >
                {day.getDate()}
                {hasEvents && (
                  <span 
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"
                    aria-label="Events available"
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t border-gray-200 dark:border-border px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium text-gray-900 dark:text-foreground">
            {selectedDate?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {selectedDateEvents.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-muted-foreground text-center py-4">
              No events on this day
            </div>
          ) : (
            selectedDateEvents.map((event) => {
              const metadata = eventMetadata[event.id];
              const variant = getCategoryVariant(metadata?.category, categoryMappings);
              const colorClass = getVariantColorClass(variant);
              const categoryColor = colorClass.replace('bg-', 'after:bg-');

              return (
                <button
                  key={event.id}
                  className={`bg-card dark:bg-card relative rounded-md p-2 pl-6 text-sm text-left w-full after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-muted dark:hover:bg-muted transition-colors focus:outline-none border border-gray-200 dark:border-border ${categoryColor}`}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="font-medium text-gray-900 dark:text-foreground">{event.title}</div>
                  <div className="text-muted-foreground dark:text-muted-foreground text-xs">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    {metadata && ` • ${metadata.location}`}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </CardFooter>
    </Card>
  );
}