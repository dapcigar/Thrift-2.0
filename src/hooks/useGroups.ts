import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SavingsGroup } from '@/types/dashboard';

export function useGroups() {
  const [groups, setGroups] = useState<SavingsGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: Partial<SavingsGroup>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const newGroup = await response.json();
      setGroups(prevGroups => [...prevGroups, newGroup]);
      return newGroup;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create group');
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  return {
    groups,
    loading,
    error,
    createGroup,
    refreshGroups: fetchGroups
  };
}
