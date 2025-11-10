import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";
import { getCategoryVariant, getVariantColorClass, type CategoryVariant } from "@/utils/categoryColors";

export type MonthDisplayMode = "popover" | "dropdown" | "sidebar";

interface MonthViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  categoryMappings: { [slug: string]: CategoryVariant };
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  onMonthChange?: (date: Date) => void;
  currentDate?: Date; // Add controlled prop
  displayMode?: MonthDisplayMode;
  sidebarPosition?: "left" | "right";
}

export function MonthView({
  events,
  eventMetadata,
  categoryMappings,
  onDateClick,
  onEventClick,
  onMonthChange,
  currentDate: controlledDate,
  displayMode = "popover",
  sidebarPosition = "right",
}: MonthViewProps) {
  const [internalDate, setInternalDate] = useState(new Date());
  const currentDate = controlledDate || internalDate; // Use controlled or internal
  const [direction, setDirection] = useState<number>(0);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [activeDropdownDay, setActiveDropdownDay] = useState<number | null>(null);
  const [sidebarSelectedDate, setSidebarSelectedDate] = useState<Date | null>(null);
  const isPopoverMode = displayMode === "popover";
  const isDropdownMode = displayMode === "dropdown";
  const isSidebarMode = displayMode === "sidebar";
  

  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 }));
  };

  const getEventsForDay = (day: number, currentDate: Date) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startDate);
      const matches = eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
      return matches;
    });
    
    
    return dayEvents;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  React.useEffect(() => {
    if (!isSidebarMode) {
      return;
    }

    const selectionMatchesCurrentMonth = sidebarSelectedDate &&
      sidebarSelectedDate.getFullYear() === currentDate.getFullYear() &&
      sidebarSelectedDate.getMonth() === currentDate.getMonth();

    if (selectionMatchesCurrentMonth) {
      return;
    }

    const today = new Date();
    let dayToUse: number;

    if (today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth()) {
      dayToUse = today.getDate();
    } else {
      const monthEvents = events
        .map(event => new Date(event.startDate))
        .filter(eventDate => {
          return (
            eventDate.getFullYear() === currentDate.getFullYear() &&
            eventDate.getMonth() === currentDate.getMonth()
          );
        })
        .sort((a, b) => a.getTime() - b.getTime());

      dayToUse = monthEvents.length > 0 ? monthEvents[0].getDate() : 1;
    }

    setSidebarSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayToUse));
  }, [isSidebarMode, currentDate, events, sidebarSelectedDate]);

  React.useEffect(() => {
    if (!isDropdownMode) {
      setActiveDropdownDay(null);
    }
  }, [isDropdownMode, currentDate]);

  const handlePrevMonth = () => {
    setDirection(-1);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (!controlledDate) {
      setInternalDate(newDate); // Only update internal state if not controlled
    }
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    setDirection(1);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (!controlledDate) {
      setInternalDate(newDate); // Only update internal state if not controlled
    }
    onMonthChange?.(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOffset = firstDayOfMonth.getDay();

  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDateOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
  
  // Event Component
  const MonthEventComponent = ({ events }: { events: Event[] }) => {

    const eventsByCategory = events.reduce((acc, event) => {
      const metadata = eventMetadata[event.id];
      // Use 'uncategorized' for null/undefined categories  
      const category = metadata?.category || 'uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(eventsByCategory).map(([category, categoryEvents]) => {
          // Get variant from category mappings and convert to color class
          const variant = getCategoryVariant(category === 'uncategorized' ? null : category, categoryMappings);
          const colorClass = getVariantColorClass(variant);
          return (
            <div
              key={category}
              className={`${colorClass} text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-sm`}
              title={`${categoryEvents.length} ${category} event${categoryEvents.length > 1 ? 's' : ''}: ${categoryEvents.map(e => e.title).join(', ')}`}
            >
              {categoryEvents.length}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEventCards = (eventList: Event[]) => {
    return eventList.map((event) => {
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
            onEventClick?.(event);
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
    });
  };

  const defaultSidebarDate = React.useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const sidebarSelectionMatches = Boolean(
    isSidebarMode &&
    sidebarSelectedDate &&
    sidebarSelectedDate.getFullYear() === currentDate.getFullYear() &&
    sidebarSelectedDate.getMonth() === currentDate.getMonth()
  );
  const resolvedSidebarDate = isSidebarMode
    ? sidebarSelectionMatches && sidebarSelectedDate
      ? sidebarSelectedDate
      : defaultSidebarDate
    : defaultSidebarDate;
  const sidebarDay = resolvedSidebarDate.getDate();

  const sidebarDate = resolvedSidebarDate;
  const sidebarEvents = isSidebarMode ? getEventsForDay(sidebarDay, currentDate) : [];
  const sidebarDateLabel = sidebarDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const calendarContent = (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <motion.h2
          key={currentDate.getMonth()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl my-5 tracking-tighter font-bold text-gray-900 dark:text-neutral-100"
        >
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </motion.h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrevMonth} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button variant="outline" onClick={handleNextMonth} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day headers - separate grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
        {daysOfWeek.map((day, idx) => (
          <div
            key={idx}
            className="text-left py-2 text-lg tracking-tighter font-medium text-gray-900 dark:text-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1 sm:gap-2"
        >
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-[150px] opacity-50 p-4">
              <div className="font-semibold relative text-3xl mb-1 text-gray-400 dark:text-neutral-500">
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonth.map((dayObj) => {
            const dayEvents = getEventsForDay(dayObj.day, currentDate);
            const isToday = new Date().getDate() === dayObj.day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear();
            
            const dayOfWeek = (startOffset + dayObj.day - 1) % 7;
            const isRightEdge = dayOfWeek >= 5;
            const isSidebarSelected = isSidebarMode && sidebarSelectionMatches && sidebarDay === dayObj.day;

            return (
              <motion.div
                className="hover:z-50 border-none h-[150px] rounded group flex flex-col relative"
                key={dayObj.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => {
                  if (isPopoverMode) {
                    setHoveredDay(dayObj.day);
                  }
                }}
                onMouseLeave={() => {
                  if (isPopoverMode) {
                    setHoveredDay(null);
                  }
                }}
              >
                <Card
                  className={`bg-white dark:bg-card border border-gray-200 dark:border-border shadow-md overflow-hidden relative flex p-4 h-full transition-shadow day-card ${
                    dayEvents.length > 0
                      ? "cursor-pointer hover:shadow-lg hover:bg-muted dark:hover:bg-muted"
                      : "cursor-default"
                  } ${isToday ? "!border-red-500 !border-2" : ""} ${isSidebarSelected && !isToday ? "ring-2 ring-blue-500 dark:ring-primary" : ""}`}
                  onClick={dayEvents.length > 0 ? () => {
                    if (isSidebarMode) {
                      setSidebarSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day));
                    }
                    onDateClick?.(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day));
                  } : undefined}
                >
                  <div className={`font-semibold relative text-3xl mb-1 ${
                    dayEvents.length > 0 ? "text-gray-900 dark:text-foreground" : "text-gray-500 dark:text-muted-foreground"
                  }`}>
                    {dayObj.day}
                  </div>
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <AnimatePresence mode="wait">
                      {dayEvents?.length > 0 && (
                        <motion.div
                          key={dayEvents[0].id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MonthEventComponent events={dayEvents} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isDropdownMode && dayEvents.length > 0 && (
                      <div className="mt-auto">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between gap-2 rounded-md bg-muted/70 dark:bg-muted px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownDay(prev => (prev === dayObj.day ? null : dayObj.day));
                          }}
                        >
                          <span>{activeDropdownDay === dayObj.day ? "Hide events" : "Show events"}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-3 w-3 transition-transform ${activeDropdownDay === dayObj.day ? "rotate-180" : ""}`}
                            fill="none"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        {activeDropdownDay === dayObj.day && (
                          <div className="mt-2 space-y-1.5">
                            {renderEventCards(dayEvents)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
                
                {/* Hover Tooltip */}
                {isPopoverMode && hoveredDay === dayObj.day && dayEvents.length > 0 && (
          <div 
                    className={`absolute top-full z-50 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg shadow-lg p-3 w-80 ${
                      isRightEdge ? 'right-0' : 'left-0'
                    }`}
                    onMouseEnter={() => {
                      if (isPopoverMode) {
                        setHoveredDay(dayObj.day);
                      }
                    }}
                    onMouseLeave={() => {
                      if (isPopoverMode) {
                        setHoveredDay(null);
                      }
                    }}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-foreground mb-2">
                      {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                    </div>
                    <div className="space-y-1.5">
                      {renderEventCards(dayEvents)}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Next month overflow days - only if needed to complete the current week */}
          {(() => {
            const totalDaysRendered = startOffset + daysInMonth.length;
            const remainingDaysInWeek = totalDaysRendered % 7;
            const nextMonthDaysNeeded = remainingDaysInWeek === 0 ? 0 : 7 - remainingDaysInWeek;
            
            return Array.from({ length: nextMonthDaysNeeded }).map((_, idx) => (
              <div key={`next-${idx}`} className="h-[150px] opacity-50 p-4">
                <div className="font-semibold relative text-3xl mb-1 text-gray-400 dark:text-neutral-500">
                  {idx + 1}
                </div>
              </div>
            ));
          })()}
        </motion.div>
      </AnimatePresence>
    </>
  );

  const calendarSection = (
    <div className={isSidebarMode ? "flex-1" : undefined}>
      {isSidebarMode ? (
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-sm p-4 lg:p-6">
          {calendarContent}
        </div>
      ) : (
        calendarContent
      )}
    </div>
  );

  const sidebarPanel = isSidebarMode ? (
    <aside className="md:w-72 w-full md:flex-shrink-0">
      <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-md p-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-muted-foreground">Selected Day</div>
          <div className="text-base font-semibold text-gray-900 dark:text-foreground">{sidebarDateLabel}</div>
        </div>
        <div className="mt-3 space-y-1.5">
          {sidebarEvents.length > 0 ? (
            renderEventCards(sidebarEvents)
          ) : (
            <div className="rounded-md border border-dashed border-gray-200 dark:border-border bg-gray-50 dark:bg-card px-3 py-4 text-xs text-gray-600 dark:text-muted-foreground">
              No events scheduled for this day.
            </div>
          )}
        </div>
      </div>
    </aside>
  ) : null;

  return (
    <div className={isSidebarMode ? "flex flex-col gap-6 md:flex-row md:items-start" : ""}>
      {isSidebarMode && sidebarPosition === "left" && sidebarPanel}
      {calendarSection}
      {isSidebarMode && sidebarPosition === "right" && sidebarPanel}
    </div>
  );
}
