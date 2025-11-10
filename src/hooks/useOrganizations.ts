import { useState, useEffect } from 'react';
import { organizationsService, type Organization } from '@/services/organizations';
import { isStubEnvironment } from '@/lib/env';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (isStubEnvironment) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await organizationsService.getAll();
        setOrganizations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return { organizations, loading, error };
}
