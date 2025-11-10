import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";
import { getCategoryVariant, getVariantEventBackgroundClass, type CategoryVariant } from "@/utils/categoryColors";

interface WeekViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  categoryMappings: { [slug: string]: CategoryVariant };
  onEventClick?: (event: Event) => void;
}

export function WeekView({ events, eventMetadata, categoryMappings, onEventClick }: WeekViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      return event.startDate.toDateString() === date.toDateString();
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getEventPosition = (event: Event, dayEvents: Event[]) => {
    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const endHour = event.endDate ? event.endDate.getHours() : startHour + 1;
    const endMinute = event.endDate ? event.endDate.getMinutes() : 0;
    
    const startPosition = startHour + startMinute / 60;
    const endPosition = endHour + endMinute / 60;
    const duration = endPosition - startPosition;
    
    // Find overlapping events (only events on the same day that overlap in time)
    const overlappingEvents = dayEvents.filter(otherEvent => {
      if (otherEvent.id === event.id) return true;
      
      // Only consider events that are actually on the same day
      if (otherEvent.startDate.toDateString() !== event.startDate.toDateString()) {
        return false;
      }
      
      const otherStartHour = otherEvent.startDate.getHours() + otherEvent.startDate.getMinutes() / 60;
      const otherEndHour = (otherEvent.endDate ? otherEvent.endDate.getHours() : otherEvent.startDate.getHours() + 1) + 
        (otherEvent.endDate ? otherEvent.endDate.getMinutes() / 60 : 0);
      
      // Check if events overlap in time
      return (startPosition < otherEndHour) && (endPosition > otherStartHour);
    });
    
    const overlapCount = overlappingEvents.length;
    const eventPosition = overlappingEvents.findIndex(e => e.id === event.id);
    const widthPercentage = overlapCount > 1 ? 100 / overlapCount : 100;
    const leftPercentage = overlapCount > 1 ? (eventPosition * widthPercentage) : 0;
    
    return {
      top: `${startPosition * 80}px`, // 80px per hour for better readability
      height: `${duration * 80}px`, // Accurate height based on actual duration
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
    };
  };


  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week Grid */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">Time</div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-3 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8 relative">
          {/* Time labels column */}
          <div className="border-r border-gray-200 dark:border-gray-600">
            {hours.map((hour) => (
              <div key={hour} className="h-[80px] p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 flex items-start">
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>
          
          {/* Day columns with events */}
          {weekDates.map((date, dayIndex) => {
            const dayEvents = getEventsForDay(date);
            
            return (
              <div key={dayIndex} className="relative border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div key={hour} className="h-[80px] border-b border-gray-200 dark:border-gray-600"></div>
                ))}
                
                {/* Events positioned absolutely */}
                {dayEvents.map((event) => {
                  const metadata = eventMetadata[event.id];
                  const variant = getCategoryVariant(metadata?.category, categoryMappings);
                  const colorClass = getVariantEventBackgroundClass(variant);
                  const position = getEventPosition(event, dayEvents);
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute ${colorClass} border rounded p-2 text-sm z-20 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow event-card`}
                      style={{
                        ...position,
                        margin: '1px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <div className="font-medium leading-tight truncate text-sm">{event.title}</div>
                      <div className="text-xs opacity-75 leading-tight">
                        {event.startDate.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}
                      </div>
                      {metadata && (
                        <div className="text-xs leading-tight">
                          <div className="truncate">{metadata.location}</div>
                          {metadata.organization && (
                            <div className="truncate opacity-75">{metadata.organization}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
