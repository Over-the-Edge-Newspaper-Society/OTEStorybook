import { useState, useEffect } from 'react';
import { isStubEnvironment } from '@/lib/env';

interface EventCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'orange' | 'cyan' | 'pink' | 'indigo' | 'yellow';
}

interface EventCategoriesHook {
  categories: EventCategory[];
  loading: boolean;
  error: string | null;
}

export function useEventCategories(): EventCategoriesHook {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      // Skip API calls in dev or stub environments and use fallback categories with dynamic counts
      if (isStubEnvironment) {
        // Import test data to calculate counts
        import('../data/events').then(({ eventMetadata }) => {
          // Calculate counts based on test event metadata
          const categoryCounts = {
            academic: 0,
            social: 0,
            sports: 0,
            workshop: 0,
            cultural: 0
          };
          
          // Count events per category
          Object.values(eventMetadata).forEach((metadata) => {
            if (metadata.category && categoryCounts[metadata.category as keyof typeof categoryCounts] !== undefined) {
              categoryCounts[metadata.category as keyof typeof categoryCounts]++;
            }
          });
          
          setCategories([
            { id: 1, name: 'Academic', slug: 'academic', count: categoryCounts.academic, variant: 'primary' },
            { id: 2, name: 'Social', slug: 'social', count: categoryCounts.social, variant: 'success' },
            { id: 3, name: 'Sports', slug: 'sports', count: categoryCounts.sports, variant: 'warning' },
            { id: 4, name: 'Workshop', slug: 'workshop', count: categoryCounts.workshop, variant: 'danger' },
            { id: 5, name: 'Cultural', slug: 'cultural', count: categoryCounts.cultural, variant: 'orange' }
          ]);
          setLoading(false);
        });
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await fetch('/wp-json/wp/v2/event_category?per_page=100&orderby=name&order=asc');
        
        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
        }

        const wpCategories = await categoriesResponse.json();
        let customVariants: Record<string, string> = {};

        try {
          const configResponse = await fetch('/wp-json/unbc-events/v1/category-config');
          if (configResponse.ok) {
            const configData = await configResponse.json();
            Object.entries(configData).forEach(([slug, value]) => {
              if (typeof value === 'string') {
                customVariants[slug] = value;
              } else if (value && typeof value === 'object' && 'variant' in value && value.variant) {
                customVariants[slug] = value.variant as string;
              }
            });
          }
        } catch (configError) {
          console.warn('Error fetching category color config:', configError);
        }
        
        // Transform WordPress categories to our format and use custom or default variants
        const transformedCategories: EventCategory[] = wpCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat.count,
          variant: (customVariants[cat.slug] as EventCategory['variant']) || 'default'
        }));

        setCategories(transformedCategories);
      } catch (err) {
        console.error('Error fetching event categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        
        // Fallback to hardcoded categories if API fails
        setCategories([
          { id: 1, name: 'Clubs', slug: 'clubs', count: 0, variant: 'default' },
          { id: 2, name: 'UNBC', slug: 'unbc', count: 0, variant: 'default' },
          { id: 3, name: 'Organizations', slug: 'organizations', count: 0, variant: 'default' },
          { id: 4, name: 'Sports', slug: 'sports', count: 0, variant: 'default' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
