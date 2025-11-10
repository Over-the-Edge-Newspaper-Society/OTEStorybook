import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Building2 } from "lucide-react";
import type { Event, EventMetadata } from "@/types";
import { getCategoryVariant, getVariantColorClass, type CategoryVariant } from "@/utils/categoryColors";

interface ListViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  categoryMappings: { [slug: string]: CategoryVariant };
  onEventClick?: (event: Event) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  showCost?: boolean;
}

export function EventListView({ events, eventMetadata, categoryMappings, onEventClick, onLoadMore, hasMore, loading, showCost = true }: ListViewProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Filter to only show today's and future events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  
  const futureEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0); // Start of event day
    return eventDate >= today;
  });

  const sortedEvents = [...futureEvents].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc, event) => {
    const dateKey = event.startDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6">
      {sortedEvents.length === 0 ? (
      <div className="text-center py-12 text-muted-foreground">
          <CalendarDays className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p>Try adjusting your filters to see more events.</p>
        </div>
      ) : (
        Object.entries(eventsByDate).map(([dateKey, dateEvents]) => {
          const date = new Date(dateKey);
          const isToday = date.toDateString() === new Date().toDateString();
          const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
          
          let dateLabel;
          
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
                          <div className="font-medium text-gray-900 dark:text-foreground mb-2">{event.title}</div>
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
                            {metadata?.organization && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <span>{metadata.organization}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {showCost && metadata && metadata.cost && (
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
                            {metadata.cost}
                          </div>
                        )}
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
        })
      )}
      
      {/* Load More Button */}
      {onLoadMore && hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Events'}
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileListView({ events, eventMetadata, categoryMappings, onEventClick, onLoadMore, hasMore, loading, showCost = true }: ListViewProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Filter to only show today's and future events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  
  const futureEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0); // Start of event day
    return eventDate >= today;
  });

  const sortedEvents = [...futureEvents].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc, event) => {
    const dateKey = event.startDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6">
      {sortedEvents.length === 0 ? (
      <div className="text-center py-12 text-muted-foreground">
          <CalendarDays className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p>Try adjusting your filters to see more events.</p>
        </div>
      ) : (
        Object.entries(eventsByDate).map(([dateKey, dateEvents]) => {
          const date = new Date(dateKey);
          const isToday = date.toDateString() === new Date().toDateString();
          const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
          
          let dateLabel;
          
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
                <h3 className="text-base font-semibold text-gray-900 dark:text-foreground">{dateLabel}</h3>
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs font-semibold text-gray-900 dark:text-muted-foreground bg-gray-50 dark:bg-muted px-2 py-0.5 rounded-full border border-gray-200 dark:border-border">
                  {dateEvents.length}
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
                          <div className="font-medium text-gray-900 dark:text-foreground mb-2">{event.title}</div>
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
                            {metadata?.organization && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <span>{metadata.organization}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {showCost && metadata && metadata.cost && (
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
                            {metadata.cost}
                          </div>
                        )}
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
        })
      )}
      
      {/* Load More Button */}
      {onLoadMore && hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Events'}
          </button>
        </div>
      )}
    </div>
  );
}
