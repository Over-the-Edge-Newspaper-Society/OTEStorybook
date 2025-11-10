"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Calendar, Clock } from "lucide-react";
import type { Event } from "@/types";
import { useEventsDev } from "@/hooks/useEventsDev";
import { useEvents } from "@/hooks/useEvents";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useEventCategories } from "@/hooks/useEventCategories";
import { useCategoryConfig } from "@/hooks/useCategoryConfig";
import { EventDialog } from "@/components/event-dialog";
import { MonthView, WeekView, DayView } from "@/components/calendar-views";
import type { MonthDisplayMode } from "@/components/calendar-views";
import { MobileMonthView } from "./mobile-month-view";
import { EventListView, MobileListView } from "./list-views";
import { Loader2 } from "lucide-react";
import { createCategoryMappings, getVariantColorClass } from "@/utils/categoryColors";
import { isStubEnvironment } from "@/lib/env";

// Mock organizations for development
const mockOrganizations = [
  { id: 1, title: { rendered: 'Student Union' } },
  { id: 2, title: { rendered: 'Computer Science Club' } },
  { id: 3, title: { rendered: 'Athletics Department' } },
  { id: 4, title: { rendered: 'Cultural Society' } },
  { id: 5, title: { rendered: 'Career Services' } },
];



interface UNBCCalendarProps {
  initialView?: string;
  initialCategoryFilter?: string;
  initialOrganizationFilter?: string;
  showWeekView?: boolean;
  showDayView?: boolean;
  showCost?: boolean;
  eventSortOrder?: 'asc' | 'desc';
  initialMonthDisplayMode?: MonthDisplayMode;
  initialMonthSidebarPosition?: "left" | "right";
}

export default function UNBCCalendar({
  initialView = "month",
  initialCategoryFilter = "all",
  initialOrganizationFilter = "all",
  showWeekView = true,
  showDayView = true,
  showCost = true,
  eventSortOrder = 'asc',
  initialMonthDisplayMode = "popover",
  initialMonthSidebarPosition = "right"
}: UNBCCalendarProps = {}) {
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarViewDate, setCalendarViewDate] = useState(new Date()); // Separate state for calendar navigation
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [monthDisplayMode, setMonthDisplayMode] = useState<MonthDisplayMode>(initialMonthDisplayMode);
  const [monthSidebarPosition, setMonthSidebarPosition] = useState<"left" | "right">(initialMonthSidebarPosition);
  const isSidebarMode = monthDisplayMode === "sidebar";

  // List view pagination state
  const [listDisplayCount, setListDisplayCount] = useState(30);
  const [listInitialItems, setListInitialItems] = useState(30);
  const [listLoadMoreCount, setListLoadMoreCount] = useState(15);
  
  // Initialize list view settings from block attributes
  React.useEffect(() => {
    const container = document.querySelector('.unbc-calendar-container');
    if (container) {
      const initialItems = parseInt(container.getAttribute('data-list-initial-items') || '30');
      const loadMoreCount = parseInt(container.getAttribute('data-list-load-more-count') || '15');
      
      setListInitialItems(initialItems);
      setListLoadMoreCount(loadMoreCount);
      setListDisplayCount(initialItems);

      const modeAttr = container.getAttribute('data-month-display-mode');
      if (modeAttr === 'popover' || modeAttr === 'dropdown' || modeAttr === 'sidebar') {
        setMonthDisplayMode(modeAttr as MonthDisplayMode);
      }

      const sidebarAttr = container.getAttribute('data-month-sidebar-position');
      if (sidebarAttr === 'left' || sidebarAttr === 'right') {
        setMonthSidebarPosition(sidebarAttr as 'left' | 'right');
      }
    }
  }, []);

  React.useEffect(() => {
    setMonthDisplayMode(initialMonthDisplayMode);
  }, [initialMonthDisplayMode]);

  React.useEffect(() => {
    setMonthSidebarPosition(initialMonthSidebarPosition);
  }, [initialMonthSidebarPosition]);

  // Minimal CSS for view-only calendar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide any add event hover text */
      .unbc-calendar-view .absolute.bg-accent.flex.items-center.justify-center {
        display: none !important;
      }
      
      /* Disable click events on some elements but not on interactive ones */
      .unbc-calendar-view .cursor-pointer.disable-clicks {
        cursor: default !important;
        pointer-events: none !important;
      }
      
      /* Explicitly ensure navigation buttons work */
      .unbc-calendar-view button,
      .mobile-calendar button {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure day cards are clickable */
      .unbc-calendar-view .day-card {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure event cards in day/week view are clickable */
      .unbc-calendar-view .event-card {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure the grid doesn't block events */
      .unbc-calendar-view [role="tabpanel"] > div > div {
        pointer-events: none;
      }
      
      .unbc-calendar-view [role="tabpanel"] > div > div > * {
        pointer-events: auto;
      }
      
      /* Fix select dropdowns - ensure they work properly */
      .unbc-calendar-view [data-slot="select-trigger"] {
        pointer-events: auto !important;
        cursor: pointer !important;
        z-index: 10 !important;
      }
      
      /* Ensure select content is visible and accessible */
      [data-slot="select-content"] {
        z-index: 999999 !important;
        position: fixed !important;
        pointer-events: auto !important;
      }
      
      /* Ensure select items are clickable */
      [data-slot="select-item"] {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Override any WordPress admin styles that might interfere */
      .unbc-calendar-view [role="combobox"] {
        pointer-events: auto !important;
      }

    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Detect and apply dark mode directly to calendar component
  React.useEffect(() => {
    let observer: MutationObserver;

    const detectTheme = () => {
      // Check various theme detection methods (but don't check html.dark to avoid circular detection)
      const isDark =
        // Priority 1: Explicit theme attributes
        (document.documentElement.hasAttribute('data-theme') && document.documentElement.getAttribute('data-theme') === 'dark') ||
        (document.documentElement.hasAttribute('data-color-scheme') && document.documentElement.getAttribute('data-color-scheme') === 'dark') ||
        // Priority 2: Theme classes on body or html
        document.body.classList.contains('dark') ||
        document.documentElement.classList.contains('is-dark-theme') ||
        document.body.classList.contains('is-dark-theme') ||
        // Priority 3: Computed styles
        (getComputedStyle(document.documentElement).getPropertyValue('--wp--preset--color--background')?.includes('0, 0, 0')) ||
        (getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)') ||
        // Priority 4: System preference (lowest priority)
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

      setIsDarkMode(isDark);

      // Temporarily disconnect observer to prevent infinite loop
      if (observer) {
        observer.disconnect();
      }

      // Apply dark class to html element for global Tailwind dark mode support
      // This ensures portaled components (dialogs, selects) also get dark mode
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Reconnect observer after making changes
      if (observer) {
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-color-scheme'] });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
    };

    // Run detection initially and on changes
    detectTheme();
    observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-color-scheme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Also listen for media query changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);
  
  // Check if we're in development or stubbed environment
  const isDev = isStubEnvironment;
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [organizationFilter, setOrganizationFilter] = useState(initialOrganizationFilter);
  React.useEffect(() => {
    setCategoryFilter(initialCategoryFilter);
  }, [initialCategoryFilter]);
  React.useEffect(() => {
    setOrganizationFilter(initialOrganizationFilter);
  }, [initialOrganizationFilter]);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Calculate month-based date range like Calendar Plus approach
  const dateFilters = React.useMemo(() => {
    // Use calendarViewDate for month-based loading
    const baseDate = new Date(calendarViewDate.getTime());
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    // Start: First day of current month
    const startDate = new Date(year, month, 1);

    // End: Last day of current month
    const endDate = new Date(year, month + 1, 0);

    return {
      per_page: 500,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      year: year,
      month: month + 1, // Calendar Plus uses 1-based months
      category: categoryFilter === "all" ? "" : categoryFilter,
      // Don't send search to API - handle client-side only for better UX
    };
  }, [calendarViewDate, categoryFilter]); // Removed searchFilter dependency

  // Use appropriate hooks based on environment
  const devData = useEventsDev(dateFilters);
  const prodEventsData = useEvents(dateFilters);
  const prodOrgsData = useOrganizations();
  const categoriesData = useEventCategories();
  const categoryConfigData = useCategoryConfig();

  // Debounce search input to improve performance
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchFilter(searchInput);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Categories that should show organization dropdown
  const categoriesWithOrganizations = React.useMemo(() => {
    return categoryConfigData.config?.categoriesWithOrganizations || [];
  }, [categoryConfigData.config]);

  // Reset organization filter when category changes to something that doesn't support organizations
  React.useEffect(() => {
    if (!categoriesWithOrganizations.includes(categoryFilter) && categoryFilter !== "all") {
      setOrganizationFilter("all");
    }
  }, [categoryFilter, categoriesWithOrganizations]);
  
  // Select data source based on environment
  const dataSource = isDev ? devData : prodEventsData;

  const { 
    events: allEvents, 
    eventMetadata, 
    loading, 
    error, 
    categoryMappings: categoryMappingsFromEvents
  } = dataSource;

  const organizations = isDev ? mockOrganizations : prodOrgsData.organizations;
  const orgLoading = isDev ? false : prodOrgsData.loading;
  
  // Event categories are always loaded from WordPress (even in dev mode)
  const { categories: eventCategories, loading: categoriesLoading } = categoriesData;
  
  const taxonomyCategoryMappings = React.useMemo(
    () => createCategoryMappings(eventCategories),
    [eventCategories]
  );

  // Prefer the server-provided mappings (respecting admin color choices) with taxonomy data as fallback
  const categoryMappings = React.useMemo(() => {
    if (categoryMappingsFromEvents && Object.keys(categoryMappingsFromEvents).length > 0) {
      return categoryMappingsFromEvents;
    }
    return taxonomyCategoryMappings;
  }, [categoryMappingsFromEvents, taxonomyCategoryMappings]);

  // Memoize organization lookup for better performance
  const organizationLookup = React.useMemo(() => {
    const lookup = new Map();
    organizations.forEach(org => {
      lookup.set(org.id.toString(), org.title.rendered);
    });
    return lookup;
  }, [organizations]);

  // Note: Date range filtering is now handled automatically by the dateFilters useMemo above

  // Helper function to check if event should show for category (handles category relationships)
  const eventMatchesCategory = React.useCallback((event: any, categorySlug: string) => {
    const metadata = eventMetadata[event.id];
    if (!metadata) return false;
    
    // Check if this category has relationships defined
    const relatedCategories = categoryConfigData.config?.categoryRelationships?.[categorySlug];
    
    if (relatedCategories) {
      // This category shows events from multiple categories
      return metadata.category ? relatedCategories.includes(metadata.category) : false;
    } else {
      // Direct category match
      return metadata.category === categorySlug;
    }
  }, [eventMetadata, categoryConfigData.config]);

  // Filter events client-side for better UX and to handle server-side limitations
  const events = React.useMemo(() => {
    let filtered = allEvents;


    // First, filter out past events and sort for list view
    if (activeTab === "list") {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0); // Start of event day
        return eventDate >= today; // Only today and future events
      });

      // Sort based on eventSortOrder prop
      filtered = filtered.sort((a, b) => {
        const timeA = a.startDate.getTime();
        const timeB = b.startDate.getTime();
        return eventSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    } else {
      // Apply sorting to all other views as well
      filtered = filtered.sort((a, b) => {
        const timeA = a.startDate.getTime();
        const timeB = b.startDate.getTime();
        return eventSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }

    // Category filter - always client-side since server-side filtering is too strict
    if (categoryFilter !== "all") {
      filtered = filtered.filter(event => eventMatchesCategory(event, categoryFilter));
    }

    // Organization filter - always client-side for better UX
    if (organizationFilter !== "all") {
      const orgName = organizationLookup.get(organizationFilter);
      filtered = filtered.filter(event => {
        const metadata = eventMetadata[event.id];
        return orgName && metadata?.organization === orgName;
      });
    }

    // Search filter - always client-side for better UX
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      filtered = filtered.filter(event => {
        const metadata = eventMetadata[event.id];
        return (
          event.title.toLowerCase().includes(searchLower) ||
          metadata?.description?.toLowerCase().includes(searchLower) ||
          metadata?.location?.toLowerCase().includes(searchLower) ||
          metadata?.organization?.toLowerCase().includes(searchLower)
        );
      });
    }


    return filtered;
  }, [allEvents, eventMetadata, categoryFilter, organizationFilter, searchFilter, organizationLookup, activeTab, eventMatchesCategory, eventSortOrder]);

  const handleDateClick = React.useCallback((date: Date) => {
    setSelectedDate(date);
    if (!isSidebarMode) {
      if (showDayView) {
        setActiveTab("day");
      } else if (showWeekView) {
        setActiveTab("week");
      }
    }
  }, [isSidebarMode, showDayView, showWeekView]);

  const handleMonthChange = React.useCallback((date: Date) => {
    setCalendarViewDate(date); // Only update calendar navigation, not API calls
  }, []);

  const handleEventClick = React.useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  }, []);

  const handleLoadMore = React.useCallback(() => {
    // Use client-side pagination to maintain consistent data across views
    setListDisplayCount(prev => prev + listLoadMoreCount);
  }, [listLoadMoreCount]);

  React.useEffect(() => {
    if (!showWeekView && activeTab === "week") {
      setActiveTab(showDayView ? "day" : "month");
    } else if (!showDayView && activeTab === "day") {
      setActiveTab(showWeekView ? "week" : "month");
    }
  }, [showWeekView, showDayView, activeTab, setActiveTab]);

  const calendarContainerClasses = `rounded-lg unbc-calendar-view ${activeTab === "month" && isSidebarMode
    ? "bg-transparent dark:bg-transparent border border-transparent shadow-none"
    : "bg-card border border-border shadow-sm"}`;

  // Reset display count when switching to list view or when filters change
  React.useEffect(() => {
    if (activeTab === "list") {
      setListDisplayCount(listInitialItems);
    }
  }, [activeTab, categoryFilter, organizationFilter, searchFilter, listInitialItems]);


  // Show loading state only on initial load (when we have no events yet)
  if ((loading || orgLoading || categoriesLoading) && (!allEvents || allEvents.length === 0)) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{isDev ? 'Loading sample events...' : 'Loading calendar...'}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">Error loading events: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div id="unbc-calendar-react-component" data-calendar-isolated="true" className={`w-full space-y-6 ${isDarkMode ? 'dark' : ''}`}>

      {/* Calendar Views */}
      <div className={calendarContainerClasses}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop: Responsive layout with stacked filters */}
          <div className="hidden md:block p-6 pb-0">
            {/* Combined tabs and filters in single row */}
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Category filter and organization filter */}
              <div className="flex items-center gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 border border-border bg-card text-foreground">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${categoryFilter === 'all' ? 'bg-muted-foreground' : getVariantColorClass(eventCategories.find(cat => cat.slug === categoryFilter)?.variant || 'default')}`}></span>
                      <span>{categoryFilter === 'all' ? 'All Categories' : eventCategories.find(cat => cat.slug === categoryFilter)?.name || 'All Categories'}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-[9999] shadow-lg">
                    <SelectItem value="all" className="text-foreground hover:bg-muted focus:bg-muted focus:outline-none">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="w-3 h-3 rounded-full flex-shrink-0 bg-muted-foreground"></span>
                        <span>All</span>
                      </div>
                    </SelectItem>
                    {eventCategories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.slug} 
                        className="text-foreground hover:bg-muted focus:bg-muted focus:outline-none"
                      >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${getVariantColorClass(category.variant || 'default')}`}></span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(categoriesWithOrganizations.includes(categoryFilter)) && (
                  <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
                    <SelectTrigger className="w-44 border border-border bg-card text-foreground [&>span]:truncate [&>span]:block">
                      <SelectValue placeholder="All Organizations" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border max-h-[200px] overflow-y-auto">
                      <SelectItem value="all" className="text-foreground focus:bg-muted">All Organizations</SelectItem>
                      {organizations.map((org) => (
                        <SelectItem 
                          key={org.id} 
                          value={org.id.toString()} 
                          className="text-foreground focus:bg-muted"
                        >
                          {org.title.rendered}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Center - Tabs */}
              <div className="flex-1 flex justify-center">
                <TabsList className="h-9 bg-muted dark:bg-background/50 border border-transparent dark:border-border/40 p-1">
                  {showDayView && (
                    <TabsTrigger value="day" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm">
                      <Clock className="h-3 w-3" />
                      Day
                    </TabsTrigger>
                  )}
                  {showWeekView && (
                    <TabsTrigger value="week" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm">
                      <Calendar className="h-3 w-3" />
                      Week
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="month" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm">
                    <CalendarDays className="h-3 w-3" />
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="list" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm">
                    <List className="h-3 w-3" />
                    List
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Right side - Search input and loading indicator */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {loading && allEvents && allEvents.length > 0 && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Input
                  placeholder="Search events..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-40 border border-border bg-card text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Mobile: Single row with buttons on sides of tabs */}
          <div className="md:hidden">
            <div className="px-4 py-4 flex items-center justify-between gap-3">
              {/* Left side - Category Filter Button */}
              <div className="flex-shrink-0">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-auto min-w-[60px] h-9 px-2 border border-border bg-card text-foreground">
                    <div className="flex items-center gap-1">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${categoryFilter === 'all' ? 'bg-muted-foreground' : getVariantColorClass(eventCategories.find(cat => cat.slug === categoryFilter)?.variant || 'default')}`}></span>
                      <span className="text-xs truncate max-w-[60px]">
                        {categoryFilter === 'all' ? 'All' : eventCategories.find(cat => cat.slug === categoryFilter)?.name || 'All'}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-[9999]">
                    <SelectItem value="all" className="text-foreground focus:bg-muted">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="w-3 h-3 rounded-full flex-shrink-0 bg-muted-foreground"></span>
                        <span>All</span>
                      </div>
                    </SelectItem>
                    {eventCategories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.slug}
                        className="text-foreground focus:bg-muted"
                      >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${getVariantColorClass(category.variant || 'default')}`}></span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Center - Tabs (growing to fill available space) */}
              <div className="flex-1 flex justify-center">
                <TabsList className="h-9 bg-muted dark:bg-background/50 border border-transparent dark:border-border/40 p-1">
                  {showDayView && (
                    <TabsTrigger value="day" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm flex-1">
                      <Clock className="h-3 w-3" />
                      <span className="hidden xs:inline">Day</span>
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="month" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm flex-1">
                    <CalendarDays className="h-3 w-3" />
                    <span className="hidden xs:inline">Month</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-card dark:data-[state=active]:bg-accent data-[state=active]:shadow-sm flex-1">
                    <List className="h-3 w-3" />
                    <span className="hidden xs:inline">List</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Right side - Loading indicator and Search Button */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {loading && allEvents && allEvents.length > 0 && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-2 border border-border bg-card hover:bg-muted"
                onClick={() => {
                  const searchInput = document.querySelector('.mobile-search-input') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
                    if (searchInput.style.display !== 'none') {
                      searchInput.focus();
                    }
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </Button>
              </div>
            </div>

            {/* Hidden search input that appears when search button is clicked */}
            <div className="px-4 pb-4">
              <Input
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="mobile-search-input w-full h-9 border border-border bg-card text-foreground placeholder:text-muted-foreground"
                style={{ display: 'none' }}
              />
            </div>

            {/* Organization filter (if needed) - appears below */}
            {(categoriesWithOrganizations.includes(categoryFilter)) && (
              <div className="px-4 pb-4">
                <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
                  <SelectTrigger className="w-full h-9 border border-border bg-card text-foreground">
                    <SelectValue placeholder="All Organizations" className="truncate" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border max-h-[200px] overflow-y-auto">
                    <SelectItem value="all" className="text-foreground focus:bg-muted">All Organizations</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem 
                        key={org.id} 
                        value={org.id.toString()} 
                        className="text-foreground focus:bg-muted"
                      >
                        {org.title.rendered}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <TabsContent value="month" className="px-6 pb-6 md:p-6">
            <div className="hidden md:block">
              <MonthView 
                events={events} 
                eventMetadata={eventMetadata}
                categoryMappings={categoryMappings}
                onDateClick={handleDateClick} 
                onEventClick={handleEventClick}
                onMonthChange={handleMonthChange}
                currentDate={calendarViewDate}
                displayMode={monthDisplayMode}
                sidebarPosition={monthSidebarPosition}
              />
            </div>
            <div className="block md:hidden mobile-calendar">
              <MobileMonthView 
                events={events} 
                eventMetadata={eventMetadata}
                categoryMappings={categoryMappings}
                onEventClick={handleEventClick}
                onMonthChange={handleMonthChange}
                currentDate={calendarViewDate}
              />
            </div>
          </TabsContent>

          {showWeekView && (
            <TabsContent value="week" className="px-6 pb-6 md:p-6">
              <WeekView 
                events={events} 
                eventMetadata={eventMetadata}
                categoryMappings={categoryMappings}
                onEventClick={handleEventClick} 
              />
            </TabsContent>
          )}

          {showDayView && (
            <TabsContent value="day" className="px-6 pb-6 md:p-6">
              <DayView 
                events={events} 
                eventMetadata={eventMetadata}
                categoryMappings={categoryMappings}
                initialDate={selectedDate} 
                onEventClick={handleEventClick} 
              />
            </TabsContent>
          )}

          <TabsContent value="list" className="px-6 pb-6 md:p-6">
            <div className="hidden md:block">
              <EventListView
                events={events.slice(0, listDisplayCount)}
                eventMetadata={eventMetadata}
                categoryMappings={categoryMappings}
                onEventClick={handleEventClick}
                onLoadMore={handleLoadMore}
                hasMore={events.length > listDisplayCount}
                loading={loading}
                showCost={showCost}
              />
            </div>
            <div className="block md:hidden">
              <MobileListView
                events={events.slice(0, listDisplayCount)}
                eventMetadata={eventMetadata}
                categoryMappings={categoryMappings}
                onEventClick={handleEventClick}
                onLoadMore={handleLoadMore}
                hasMore={events.length > listDisplayCount}
                loading={loading}
                showCost={showCost}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>


      {/* Event Details Dialog */}
      <EventDialog
        event={selectedEvent}
        eventMetadata={eventMetadata}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        showCost={showCost}
      />
    </div>
  );
}
