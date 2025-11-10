export interface Event {
  id: string;
  title: string;
  description?: string;
  content?: string; // WordPress post content
  startDate: Date;
  endDate: Date;
  variant?: 'success' | 'primary' | 'default' | 'warning' | 'danger';
  organization_ids?: number[]; // Array of organization IDs
  event_categories?: number[]; // Array of category IDs
}

export interface EventMetadata {
  category: string | null; // Category slug from WordPress
  organization: string; // Organization name
  organization_id?: string;
  location: string;
  cost: string;
  registrationRequired: boolean;
  posterUrl?: string;
  registrationLink?: string;
  contactEmail?: string;
  website?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  capacity?: string;
  featured?: boolean;
  description?: string;
  categories?: Array<{ slug: string; name: string }>; // WordPress categories
}

// EventCategory is now just a string - determined by WordPress categories

export type ViewType = 'month' | 'week' | 'day' | 'list';