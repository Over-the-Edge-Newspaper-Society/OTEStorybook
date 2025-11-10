import React, { useState } from "react";
import { OrganizationEventsList } from "./organization-events-list";
import { EventDialog } from "./event-dialog";
import { useEvents } from "@/hooks/useEvents";
import { useEventCategories } from "@/hooks/useEventCategories";
import { createCategoryMappings } from "@/utils/categoryColors";
import { Loader2 } from "lucide-react";
import type { Event } from "@/types";

interface OrganizationEventsWrapperProps {
  organizationId?: string;
  organizationName?: string;
  limit?: number;
  showPastEvents?: boolean;
}

export function OrganizationEventsWrapper({ 
  organizationId,
  organizationName,
  limit = 5,
  showPastEvents = false
}: OrganizationEventsWrapperProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Load events using the same hook as the calendar with list view for organization pages
  const { 
    events: allEvents, 
    eventMetadata, 
    loading, 
    error,
    categoryMappings: categoryMappingsFromEvents
  } = useEvents({
    view: 'list', // Use list view for organization pages
    organization: organizationId, // Filter by organization
  });

  // Load event categories for color mapping
  const { categories: eventCategories } = useEventCategories();
  const taxonomyCategoryMappings = React.useMemo(
    () => createCategoryMappings(eventCategories),
    [eventCategories]
  );

  const categoryMappings = React.useMemo(() => {
    if (categoryMappingsFromEvents && Object.keys(categoryMappingsFromEvents).length > 0) {
      return categoryMappingsFromEvents;
    }
    return taxonomyCategoryMappings;
  }, [categoryMappingsFromEvents, taxonomyCategoryMappings]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unbc-organization-events">
      <OrganizationEventsList
        events={allEvents}
        eventMetadata={eventMetadata}
        categoryMappings={categoryMappings}
        organizationId={organizationId}
        organizationName={organizationName}
        limit={limit}
        showPastEvents={showPastEvents}
        onEventClick={handleEventClick}
      />

      {/* Reuse the same event dialog as the calendar */}
      <EventDialog 
        event={selectedEvent}
        eventMetadata={eventMetadata}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
      />
    </div>
  );
}
