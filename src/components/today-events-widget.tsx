"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import type { Event } from "@/types";
import { useEventsDev } from "@/hooks/useEventsDev";
import { useEvents } from "@/hooks/useEvents";
import { useEventCategories } from "@/hooks/useEventCategories";
import { createCategoryMappings, getCategoryVariant, getVariantColorClass } from "@/utils/categoryColors";
import { EventDialog } from "@/components/event-dialog";
import { isStubEnvironment } from "@/lib/env";

interface TodayEventsWidgetProps {
  title?: string;
  maxEvents?: number;
}

export function TodayEventsWidget({
  title = "Today's Events",
  maxEvents = 10
}: TodayEventsWidgetProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = React.useState(false);

  // Detect dark mode
  React.useEffect(() => {
    let observer: MutationObserver;

    const detectTheme = () => {
      const isDark =
        (document.documentElement.hasAttribute('data-theme') && document.documentElement.getAttribute('data-theme') === 'dark') ||
        (document.documentElement.hasAttribute('data-color-scheme') && document.documentElement.getAttribute('data-color-scheme') === 'dark') ||
        document.body.classList.contains('dark') ||
        document.documentElement.classList.contains('is-dark-theme') ||
        document.body.classList.contains('is-dark-theme') ||
        (getComputedStyle(document.documentElement).getPropertyValue('--wp--preset--color--background')?.includes('0, 0, 0')) ||
        (getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)') ||
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

      setIsDarkMode(isDark);

      if (observer) {
        observer.disconnect();
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (observer) {
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-color-scheme'] });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
    };

    detectTheme();
    observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-color-scheme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  // Check if we're in development mode
  const isDev = isStubEnvironment;

  // Get today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateFilters = React.useMemo(() => ({
    per_page: 100,
    start_date: today.toISOString().split('T')[0],
    end_date: tomorrow.toISOString().split('T')[0],
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    category: "",
  }), []);

  // Use appropriate hooks based on environment
  const devData = useEventsDev(dateFilters);
  const prodEventsData = useEvents(dateFilters);
  const categoriesData = useEventCategories();

  const dataSource = isDev ? devData : prodEventsData;

  const {
    events: allEvents,
    eventMetadata,
    loading,
    error,
    categoryMappings: categoryMappingsFromEvents
  } = dataSource;

  const { categories: eventCategories, loading: categoriesLoading } = categoriesData;

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

  // Filter events for today only
  const todayEvents = React.useMemo(() => {
    const filtered = allEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });

    // Sort by start time
    const sorted = filtered.sort((a, b) => {
      return a.startDate.getTime() - b.startDate.getTime();
    });

    // Limit to maxEvents
    return sorted.slice(0, maxEvents);
  }, [allEvents, maxEvents]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const todayDateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleEventClick = React.useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  }, []);

  const renderEventCard = (event: Event) => {
    const metadata = eventMetadata[event.id];
    const variant = getCategoryVariant(metadata?.category, categoryMappings);
    const colorClass = getVariantColorClass(variant);
    const categoryColor = colorClass.replace('bg-', 'after:bg-');
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const timesValid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());
    const sameTime = timesValid && start.getTime() === end.getTime();
    const timeLabel = timesValid ? `${formatTime(start)}${sameTime ? "" : ` - ${formatTime(end)}`}` : null;

    return (
      <div
        key={event.id}
        className={`bg-card dark:bg-card relative rounded-md p-2 pl-6 text-xs text-left w-full after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-muted dark:hover:bg-muted transition-colors border border-gray-200 dark:border-border shadow-sm ${categoryColor}`}
        onClick={(e) => {
          e.stopPropagation();
          handleEventClick(event);
        }}
      >
        <div className="font-medium text-[13px] text-gray-900 dark:text-foreground leading-tight">
          {event.title}
        </div>
        {timeLabel && (
          <div className="mt-0.5 text-[11px] text-gray-900 dark:text-foreground">
            {timeLabel}
          </div>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading || categoriesLoading) {
    return (
      <div className={`w-full ${isDarkMode ? 'dark' : ''}`}>
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-md p-4">
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400 dark:text-muted-foreground" />
            <p className="text-xs text-gray-500 dark:text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`w-full ${isDarkMode ? 'dark' : ''}`}>
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-card shadow-md p-4">
          <p className="text-xs text-red-600 dark:text-red-400">Error loading events</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-md p-4">
        <div className="space-y-1 mb-3">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-muted-foreground">
            {title}
          </div>
          <div className="text-base font-semibold text-gray-900 dark:text-foreground">
            {todayDateLabel}
          </div>
        </div>
        <div className="space-y-1.5">
          {todayEvents.length > 0 ? (
            todayEvents.map(renderEventCard)
          ) : (
            <div className="rounded-md border border-dashed border-gray-200 dark:border-border bg-gray-50 dark:bg-card px-3 py-4 text-xs text-gray-600 dark:text-muted-foreground">
              No events scheduled for today.
            </div>
          )}
        </div>
      </div>

      {/* Event Details Dialog - uses the same component as the main calendar */}
      <EventDialog
        event={selectedEvent}
        eventMetadata={eventMetadata}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
      />
    </div>
  );
}
