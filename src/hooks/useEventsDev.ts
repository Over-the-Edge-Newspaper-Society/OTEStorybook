import * as React from 'react';
import type { Event, EventMetadata } from '@/types';
import type { EventFilters } from '@/services/eventsApi';
import type { CategoryVariant } from '@/utils/categoryColors';

// Generate sample events for development based on date range
const generateSampleEvents = (startDate?: string, endDate?: string): Event[] => {
  const events: Event[] = [];
  
  // Parse date range or use current month
  if (!startDate || !endDate) {
    // Fallback to current month if no range provided
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return generateEventsForMonth(year, month);
  }
  
  // Generate events for the entire date range
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Generate events for each month in the range
  let currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
  
  while (currentDate <= end) {
    const monthEvents = generateEventsForMonth(currentDate.getFullYear(), currentDate.getMonth());
    events.push(...monthEvents);
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return events;
};

// Generate events for a specific month
const generateEventsForMonth = (year: number, month: number): Event[] => {
  const events: Event[] = [];
  
  // Create unique IDs based on year and month
  const monthId = `${year}-${month}`;
  
  // Academic events
  const event1StartDate = new Date(year, month, 5, 14, 0);
  const event2StartDate = new Date(year, month, 5, 10, 0);
  
  events.push({
    id: `${monthId}-1`,
    title: 'Computer Science Seminar',
    description: 'Advanced Machine Learning Topics',
    startDate: event1StartDate,
    endDate: new Date(year, month, 5, 16, 0),
  });
  
  events.push({
    id: `${monthId}-2`,
    title: 'Mathematics Workshop',
    description: 'Calculus Study Group',
    startDate: event2StartDate,
    endDate: new Date(year, month, 5, 12, 0),
  });
  
  // Social events
  events.push({
    id: `${monthId}-3`,
    title: 'Campus Movie Night',
    description: 'Outdoor movie screening',
    startDate: new Date(year, month, 8, 19, 0),
    endDate: new Date(year, month, 8, 22, 0),
  });
  
  events.push({
    id: `${monthId}-4`,
    title: 'Student Mixer',
    description: 'Meet new friends',
    startDate: new Date(year, month, 12, 18, 0),
    endDate: new Date(year, month, 12, 20, 0),
  });
  
  // Add more events on different days
  events.push({
    id: `${monthId}-14`,
    title: 'Study Session',
    description: 'Group study for finals',
    startDate: new Date(year, month, 15, 14, 0),
    endDate: new Date(year, month, 15, 16, 0),
  });
  
  events.push({
    id: `${monthId}-15`,
    title: 'Book Club Meeting',
    description: 'Monthly book discussion',
    startDate: new Date(year, month, 20, 17, 0),
    endDate: new Date(year, month, 20, 19, 0),
  });
  
  events.push({
    id: `${monthId}-16`,
    title: 'Trivia Night',
    description: 'Fun trivia competition',
    startDate: new Date(year, month, 25, 20, 0),
    endDate: new Date(year, month, 25, 22, 0),
  });
  
  // Sports events
  events.push({
    id: `${monthId}-5`,
    title: 'Basketball Tournament',
    description: 'Intramural championship',
    startDate: new Date(year, month, 15, 17, 0),
    endDate: new Date(year, month, 15, 21, 0),
  });
  
  events.push({
    id: `${monthId}-6`,
    title: 'Soccer Practice',
    description: 'Team practice session',
    startDate: new Date(year, month, 15, 15, 0),
    endDate: new Date(year, month, 15, 17, 0),
  });
  
  // Cultural events
  events.push({
    id: `${monthId}-7`,
    title: 'International Food Festival',
    description: 'Celebrate diverse cuisines',
    startDate: new Date(year, month, 20, 11, 0),
    endDate: new Date(year, month, 20, 15, 0),
  });
  
  // Professional events
  events.push({
    id: `${monthId}-8`,
    title: 'Career Fair',
    description: 'Connect with employers',
    startDate: new Date(year, month, 22, 10, 0),
    endDate: new Date(year, month, 22, 16, 0),
  });
  
  events.push({
    id: `${monthId}-9`,
    title: 'Resume Workshop',
    description: 'Professional development',
    startDate: new Date(year, month, 22, 13, 0),
    endDate: new Date(year, month, 22, 14, 30),
  });
  
  // Wellness events
  events.push({
    id: `${monthId}-10`,
    title: 'Yoga Session',
    description: 'Morning wellness class',
    startDate: new Date(year, month, 25, 7, 0),
    endDate: new Date(year, month, 25, 8, 0),
  });
  
  // Arts events
  events.push({
    id: `${monthId}-11`,
    title: 'Art Exhibition Opening',
    description: 'Student artwork showcase',
    startDate: new Date(year, month, 28, 18, 0),
    endDate: new Date(year, month, 28, 20, 0),
  });
  
  // Special monthly events - only for current month if it matches today
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  
  if (isCurrentMonth) {
    events.push({
      id: `${monthId}-12`,
      title: 'Emergency Meeting',
      description: 'Important announcement',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
    });
    
    events.push({
      id: `${monthId}-13`,
      title: 'Study Group',
      description: 'Physics review session',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
    });
  }
  
  // Add some variety based on month
  if (month === 0) { // January
    events.push({
      id: `${monthId}-special`,
      title: 'New Year Planning Session',
      description: 'Plan for the new academic year',
      startDate: new Date(year, month, 15, 10, 0),
      endDate: new Date(year, month, 15, 12, 0),
    });
  } else if (month === 11) { // December
    events.push({
      id: `${monthId}-special`,
      title: 'Holiday Celebration',
      description: 'End of year celebration',
      startDate: new Date(year, month, 15, 18, 0),
      endDate: new Date(year, month, 15, 21, 0),
    });
  } else {
    events.push({
      id: `${monthId}-special`,
      title: `${new Date(year, month).toLocaleString('en-US', { month: 'long' })} Workshop`,
      description: 'Monthly workshop session',
      startDate: new Date(year, month, 10, 14, 0),
      endDate: new Date(year, month, 10, 16, 0),
    });
  }
  
  return events;
};

// Generate sample event metadata
const generateEventMetadata = (events: Event[]): Record<string, EventMetadata> => {
  const metadata: Record<string, EventMetadata> = {};
  const locations = ['Main Auditorium', 'Student Center', 'Library Room 201', 'Sports Complex', 'Outdoor Field', 'Conference Hall', 'Room 301'];
  const organizations = ['Student Union', 'Computer Science Club', 'Athletics Department', 'Cultural Society', 'Career Services'];
  
  events.forEach((event, index) => {
    let category: any = 'academic';
    
    // Assign categories based on event title
    if (event.title.toLowerCase().includes('sport') || event.title.toLowerCase().includes('basketball') || event.title.toLowerCase().includes('soccer')) {
      category = 'sports';
    } else if (event.title.toLowerCase().includes('movie') || event.title.toLowerCase().includes('mixer')) {
      category = 'social';
    } else if (event.title.toLowerCase().includes('food') || event.title.toLowerCase().includes('international')) {
      category = 'cultural';
    } else if (event.title.toLowerCase().includes('career') || event.title.toLowerCase().includes('resume')) {
      category = 'professional';
    } else if (event.title.toLowerCase().includes('yoga') || event.title.toLowerCase().includes('wellness')) {
      category = 'wellness';
    } else if (event.title.toLowerCase().includes('art') || event.title.toLowerCase().includes('exhibition')) {
      category = 'arts';
    } else if (event.title.toLowerCase().includes('concert') || event.title.toLowerCase().includes('band')) {
      category = 'arts';
    }
    
    metadata[event.id] = {
      category,
      organization: organizations[index % organizations.length],
      location: locations[index % locations.length],
      cost: index % 3 === 0 ? 'Free' : `$${(index + 1) * 5}`,
      registrationRequired: index % 2 === 0,
      capacity: `${(index + 1) * 20} people`,
      featured: index % 4 === 0,
      categories: [{ slug: category, name: category }],
      description: event.description,
    } as EventMetadata;
  });
  
  return metadata;
};

export function useEventsDev(filters: EventFilters = {}) {
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters.start_date, filters.end_date]); // Re-run when date range changes
  
  // Generate events based on the date range filters - memoized for React change detection
  const events = React.useMemo(() => {
    const generated = generateSampleEvents(filters.start_date, filters.end_date);
    return generated;
  }, [filters.start_date, filters.end_date]);
  
  const eventMetadata = React.useMemo(() => {
    return generateEventMetadata(events);
  }, [events]);
  
  const categoryMappings = React.useMemo(() => {
    const baseMappings: Record<string, CategoryVariant> = {
      academic: 'primary',
      social: 'success',
      sports: 'warning',
      cultural: 'orange',
      professional: 'indigo',
      wellness: 'cyan',
      arts: 'pink',
    };

    const mappings: Record<string, CategoryVariant> = {};

    Object.values(eventMetadata).forEach((metadata) => {
      if (metadata?.category && baseMappings[metadata.category]) {
        mappings[metadata.category] = baseMappings[metadata.category];
      }
    });

    return mappings;
  }, [eventMetadata]);

  return {
    events,
    eventMetadata,
    categoryMappings,
    loading,
    error: null,
    total: events.length,
    setFilters: () => {},
    // New pagination properties (mock values for dev mode)
    hasMore: false,
    loadMore: () => {},
    loadingMore: false,
    pagination: undefined,
    pages: 1,
    refetch: () => {},
  };
}
