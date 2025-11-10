import type { Event, EventMetadata } from '@/types';

interface WordPressEvent {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  building: string;
  room: string;
  full_location: string;
  cost: string;
  organization: string;
  organization_id: string;  // Add organization_id field
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  featured_image: string;
  registration_required: boolean;
  registration_link: string;
  contact_email: string;
  is_virtual: boolean;
  virtual_link: string;
  website: string;
  capacity: string;
  featured: boolean;
  permalink: string;
}

interface EventsApiResponse {
  events: WordPressEvent[] | Event[]; // Can be either old format or new pre-transformed format
  eventMetadata?: Record<string, EventMetadata>; // New: server-processed metadata
  organizations?: Record<string, string>; // New: organizations with events only
  categoryMappings?: Record<string, string>; // New: category color mappings
  total: number;
  pages: number;
  pagination?: { // New: pagination info for view-based loading
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
  performance?: { // New: performance info
    server_processed?: boolean;
    events_count?: number;
    organizations_count?: number;
    cache_hit?: boolean;
    generated_at?: string;
    view_optimized?: boolean;
  };
}

interface EventFilters {
  per_page?: number;
  page?: number;
  start_date?: string;
  end_date?: string;
  category?: string;
  organization?: string;
  featured?: boolean;
  search?: string;
  view?: 'month' | 'week' | 'day' | 'list'; // New: view-based loading
  date?: string; // New: reference date for view-based loading
  year?: number; // Calendar Plus style: specific year for caching
  month?: number; // Calendar Plus style: specific month for caching
}

const getWPData = (): any => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as any).unbcCalendarData;
};

class EventsAPI {
  private baseUrl: string;
  private cache: Map<string, { data: EventsApiResponse; timestamp: number }>;
  private cacheTimeout: number;

  constructor() {
    // Use WordPress localized data if available, otherwise fallback
    const wpData = getWPData();
    this.baseUrl = wpData?.apiUrl || '/wp-json/unbc-events/v1';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  async fetchEvents(filters: EventFilters = {}): Promise<EventsApiResponse> {
    try {
      // Generate cache key for this request
      const cacheKey = this.generateCacheKey(filters);
      
      // Check if we have cached data
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const queryString = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.append(key, value.toString());
        }
      });

      // Ensure proper URL construction
      const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
      const url = `${baseUrl}/events${queryString.toString() ? '?' + queryString.toString() : ''}`;
      
      // Add WordPress nonce authentication
      const wpData = getWPData();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (wpData?.nonce) {
        headers['X-WP-Nonce'] = wpData.nonce;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Cache the response
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  transformWordPressEventToEvent(wpEvent: WordPressEvent): Event {
    const startDate = this.parseDateTime(wpEvent.date, wpEvent.start_time);
    const endDate = this.parseDateTime(wpEvent.date, wpEvent.end_time);
    
    return {
      id: wpEvent.id.toString(),
      title: wpEvent.title,
      description: wpEvent.excerpt || this.stripHtml(wpEvent.description),
      startDate: startDate,
      endDate: endDate,
      variant: this.getCategoryVariant(wpEvent.categories)
    };
  }

  transformWordPressEventToMetadata(wpEvent: WordPressEvent): EventMetadata {
    return {
      category: this.mapWordPressCategory(wpEvent.categories),
      organization: wpEvent.organization,
      organization_id: wpEvent.organization_id,  // Include organization_id
      location: wpEvent.full_location,
      cost: wpEvent.cost,
      registrationRequired: wpEvent.registration_required,
      posterUrl: wpEvent.featured_image,
      registrationLink: wpEvent.registration_link,
      contactEmail: wpEvent.contact_email,
      isVirtual: wpEvent.is_virtual,
      virtualLink: wpEvent.virtual_link,
      website: wpEvent.website,
      capacity: wpEvent.capacity,
      featured: wpEvent.featured
    };
  }

  private parseDateTime(date: string, time: string): Date {
    const dateTime = new Date(`${date}T${time}`);
    return isNaN(dateTime.getTime()) ? new Date() : dateTime;
  }

  private stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  private getCategoryVariant(categories?: Array<{name: string; slug: string}>): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return 'default';

    return 'default';
  }

  private mapWordPressCategory(categories?: Array<{name: string; slug: string}>): string | null {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return null; // No category = show as uncategorized
    
    // Return the first category slug directly from WordPress
    return categories[0].slug;
  }

  private generateCacheKey(filters: EventFilters): string {
    // Create cache key exactly like Calendar Plus: year + '-' + month + '-' + category + '-' + search
    const year = filters.year || new Date().getFullYear();
    const month = filters.month || (new Date().getMonth() + 1);
    const category = filters.category || '';
    const search = filters.search || '';
    
    return `${year}-${month}-${category}-${search}`;
  }

  private getFromCache(key: string): EventsApiResponse | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Check if cache is still valid
    const now = Date.now();
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCache(key: string, data: EventsApiResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean old cache entries periodically
    if (this.cache.size > 50) {
      this.cleanCache();
    }
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const eventsAPI = new EventsAPI();
export type { WordPressEvent, EventsApiResponse, EventFilters };
