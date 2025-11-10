import React from "react";
import { Badge } from "./ui/badge";
import { CalendarDays, Clock, MapPin, Building2 } from "lucide-react";
import type { Event, EventMetadata } from "../types";
import { getCategoryVariant, getVariantColorClass, type CategoryVariant } from "../utils/categoryColors";

interface OrganizationEventsListProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  categoryMappings?: { [slug: string]: CategoryVariant };
  organizationId?: string;
  organizationName?: string;
  limit?: number;
  showPastEvents?: boolean;
  onEventClick?: (event: Event) => void;
}

export function OrganizationEventsList({ 
  events, 
  eventMetadata, 
  categoryMappings = {},
  organizationId,
  organizationName,
  limit,
  showPastEvents = false,
  onEventClick 
}: OrganizationEventsListProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Filter and group events by organization and date
  const { filteredEvents, eventsByDate } = React.useMemo(() => {
    let filtered = events;
    const now = new Date();

    // Filter by organization if specified
    if (organizationId || organizationName) {
      filtered = filtered.filter(event => {
        const metadata = eventMetadata[event.id];
        if (organizationName) {
          // Match by organization name
          return metadata?.organization === organizationName;
        }
        if (organizationId) {
          // Match by organization ID
          return metadata?.organization_id?.toString() === organizationId;
        }
        return true;
      });
    }

    // Filter by date unless showPastEvents is true
    if (!showPastEvents) {
      filtered = filtered.filter(event => event.startDate >= now);
    }

    // Sort by date
    filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    // Group events by date
    const grouped = filtered.reduce((acc, event) => {
      const dateKey = event.startDate.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    return { filteredEvents: filtered, eventsByDate: grouped };
  }, [events, eventMetadata, organizationId, organizationName, limit, showPastEvents]);

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <CalendarDays className="mx-auto h-8 w-8 mb-3 opacity-50" />
        <h3 className="text-base font-medium mb-1">No upcoming events</h3>
        <p className="text-sm">
          {organizationName ? `${organizationName} has no upcoming events.` : 'No events found for this organization.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {organizationName && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {organizationName} Events
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredEvents.length} upcoming event{filteredEvents.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
      
      {Object.entries(eventsByDate).map(([dateKey, dateEvents]) => {
        const date = new Date(dateKey);
        const isToday = date.toDateString() === new Date().toDateString();
        const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
        
        let dateLabel: string;
        if (isToday) {
          dateLabel = "Today";
        } else if (isTomorrow) {
          dateLabel = "Tomorrow";
        } else {
          dateLabel = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          });
        }

        return (
          <div key={dateKey} className="space-y-3">
            {/* Date Header */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">{dateLabel}</h3>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs font-semibold text-gray-900 dark:text-muted-foreground bg-gray-50 dark:bg-muted px-2 py-0.5 rounded-full border border-gray-200 dark:border-border">
                {dateEvents.length} event{dateEvents.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Events for this date */}
            <div className="space-y-2">
              {dateEvents.map((event) => {
                const metadata = eventMetadata[event.id];
                const variant = getCategoryVariant(metadata?.category, categoryMappings);
                const colorClass = getVariantColorClass(variant);
                const categoryColor = colorClass.replace('bg-', 'after:bg-');

                return (
                  <div
                    key={event.id}
                    className={`bg-card dark:bg-card relative rounded-md p-3 pl-6 text-sm border border-gray-200 dark:border-border shadow-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-muted dark:hover:bg-muted transition-colors ${categoryColor}`}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-gray-900 dark:text-foreground mb-2">
                          {event.title}
                        </div>
                        <div className="space-y-1 text-xs text-gray-900 dark:text-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                          </div>
                          {metadata?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{metadata.location}</span>
                            </div>
                          )}
                          {!organizationName && metadata?.organization && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>{metadata.organization}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                        {metadata?.cost && (
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {metadata.cost}
                          </div>
                        )}
                        {metadata?.category && (
                          <Badge variant="secondary" size="sm" className="text-xs capitalize">
                            {metadata.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {metadata?.registrationRequired && (
                      <div className="mt-2">
                        <Badge variant="outline" size="sm">Registration Required</Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
