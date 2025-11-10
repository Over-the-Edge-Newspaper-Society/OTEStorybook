import { useState, useEffect, useCallback, useRef } from 'react';
import { eventsAPI, type EventFilters, type WordPressEvent, type EventsApiResponse } from '@/services/eventsApi';
import type { Event, EventMetadata } from '@/types';
import type { CategoryVariant } from '@/utils/categoryColors';

interface UseEventsResult {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  categoryMappings: Record<string, CategoryVariant>;
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  refetch: () => void;
  setFilters: (filters: EventFilters) => void;
  // New: pagination support
  hasMore: boolean;
  loadMore: () => void;
  loadingMore: boolean;
  pagination?: {
    hasMore: boolean;
    nextPage: number | null;
    currentPage: number;
    perPage: number;
    view: string;
    loadedRange: {
      start: string | null;
      end: string | null;
    };
  };
}

const VALID_CATEGORY_VARIANTS: CategoryVariant[] = [
  'default',
  'primary',
  'success',
  'danger',
  'warning',
  'orange',
  'cyan',
  'pink',
  'indigo',
  'yellow',
];

const normalizeCategoryMappings = (raw?: Record<string, string> | null): Record<string, CategoryVariant> => {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  const normalized: Record<string, CategoryVariant> = {};

  Object.entries(raw).forEach(([slug, variant]) => {
    if (VALID_CATEGORY_VARIANTS.includes(variant as CategoryVariant)) {
      normalized[slug] = variant as CategoryVariant;
    }
  });

  return normalized;
};

const isServerFormattedEvents = (rawEvents: EventsApiResponse['events']): rawEvents is Event[] => {
  if (!Array.isArray(rawEvents)) {
    return false;
  }
  if (rawEvents.length === 0) {
    return true;
  }
  return rawEvents.every((event) => 'startDate' in event && 'endDate' in event);
};

const isWordPressEvents = (rawEvents: EventsApiResponse['events']): rawEvents is WordPressEvent[] => {
  if (!Array.isArray(rawEvents)) {
    return false;
  }
  if (rawEvents.length === 0) {
    return true;
  }
  return rawEvents.every((event) => 'start_time' in event && 'date' in event);
};

export function useEvents(initialFilters: EventFilters = {}): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventMetadata, setEventMetadata] = useState<Record<string, EventMetadata>>({});
  const [categoryMappings, setCategoryMappings] = useState<Record<string, CategoryVariant>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [pagination, setPagination] = useState<UseEventsResult['pagination']>();
  
  // Track previous values to avoid unnecessary updates and infinite loops
  const prevFilters = useRef<string>('');
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Create stable filter hash to detect actual changes
    const currentFilterHash = JSON.stringify(initialFilters);
    
    // Skip initial mount if we already have the same filters
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevFilters.current = currentFilterHash;
      setFilters(initialFilters);
      return;
    }
    
    // Only update if filters actually changed
    if (prevFilters.current !== currentFilterHash) {
      prevFilters.current = currentFilterHash;
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.fetchEvents(filters);
      const rawEvents = response.events;
      
      // Server now sends pre-transformed data - no client-side transformation needed!
      if (response.performance?.server_processed && isServerFormattedEvents(rawEvents)) {
        // New optimized format - events are already transformed
        const parsedEvents = rawEvents.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        
        setEvents(parsedEvents);
        setEventMetadata(response.eventMetadata || {});
        setCategoryMappings(normalizeCategoryMappings(response.categoryMappings));
        setTotal(response.total);
        setPages(response.pages);
        setPagination(response.pagination);
      } else if (isWordPressEvents(rawEvents)) {
        // Fallback to old transformation for backwards compatibility
        const transformedEvents: Event[] = [];
        const transformedMetadata: Record<string, EventMetadata> = {};
        
        rawEvents.forEach(wpEvent => {
          const event = eventsAPI.transformWordPressEventToEvent(wpEvent);
          const metadata = eventsAPI.transformWordPressEventToMetadata(wpEvent);
          
          transformedEvents.push(event);
          transformedMetadata[event.id] = metadata;
        });
        
        setEvents(transformedEvents);
        setEventMetadata(transformedMetadata);
        setTotal(response.total);
        setPages(response.pages);
        setPagination(response.pagination);
      } else {
        setEvents([]);
        setEventMetadata({});
        setCategoryMappings({});
        setTotal(0);
        setPages(0);
        setPagination(undefined);
        setError('Unknown event payload format');
        return;
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      // Set error state without fallback data
      setEvents([]);
      setEventMetadata({});
      setCategoryMappings({});
      setTotal(0);
      setPages(0);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // Use JSON.stringify for stable dependency

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const loadMore = useCallback(async () => {
    if (!pagination?.hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const nextPageFilters = {
        ...filters,
        page: pagination.nextPage || (filters.page || 1) + 1
      };
      
      const response = await eventsAPI.fetchEvents(nextPageFilters);
      const rawEvents = response.events;
      
      // Handle server-processed format
      if (response.performance?.server_processed && isServerFormattedEvents(rawEvents)) {
        const newEvents = rawEvents.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        
        // Merge with existing events
        setEvents(prev => [...prev, ...newEvents]);
        setEventMetadata(prev => ({ ...prev, ...response.eventMetadata || {} }));
        setCategoryMappings(prev => ({
          ...prev,
          ...normalizeCategoryMappings(response.categoryMappings),
        }));
        setPagination(response.pagination);
      } else if (isWordPressEvents(rawEvents)) {
        // Fallback transformation
        const newTransformedEvents: Event[] = [];
        const newTransformedMetadata: Record<string, EventMetadata> = {};
        
        rawEvents.forEach(wpEvent => {
          const event = eventsAPI.transformWordPressEventToEvent(wpEvent);
          const metadata = eventsAPI.transformWordPressEventToMetadata(wpEvent);
          
          newTransformedEvents.push(event);
          newTransformedMetadata[event.id] = metadata;
        });
        
        setEvents(prev => [...prev, ...newTransformedEvents]);
        setEventMetadata(prev => ({ ...prev, ...newTransformedMetadata }));
        setPagination(response.pagination);
      } else {
        setError('Unknown event payload format');
      }
    } catch (err) {
      console.error('Error loading more events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more events');
    } finally {
      setLoadingMore(false);
    }
  }, [JSON.stringify(filters), JSON.stringify(pagination), loadingMore]); // Stable dependencies

  const updateFilters = useCallback((newFilters: EventFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    events,
    eventMetadata,
    loading,
    error,
    total,
    pages,
    refetch,
    setFilters: updateFilters,
    hasMore: pagination?.hasMore || false,
    loadMore,
    loadingMore,
    pagination,
    categoryMappings,
  };
}
