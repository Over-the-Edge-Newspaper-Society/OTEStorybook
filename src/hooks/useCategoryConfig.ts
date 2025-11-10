import { useState, useEffect } from 'react';
import { isStubEnvironment } from '@/lib/env';

interface CategoryConfig {
  categoriesWithOrganizations: string[];
  categoryRelationships: Record<string, string[]>;
  autoAssignCategory: string | null;
}

export function useCategoryConfig() {
  const [config, setConfig] = useState<CategoryConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      // Skip API calls in dev mode and use dev configuration
      if (isStubEnvironment) {
        setConfig({
          categoriesWithOrganizations: ["academic", "social", "cultural"],
          categoryRelationships: {
            // No relationships in dev mode - direct matching only
          },
          autoAssignCategory: null
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/wp-json/unbc-events/v1/category-config');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error('Error fetching category config:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch category config');
        
        // Fallback to default configuration
        setConfig({
          categoriesWithOrganizations: ["unbc", "organizations", "community"],
          categoryRelationships: {
            "unbc": ["unbc", "organizations"],
            "organizations": ["organizations"]
          },
          autoAssignCategory: "organizations"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
