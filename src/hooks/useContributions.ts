import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Contribution {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'late';
  paidDate?: string;
}

interface ContributionStats {
  totalContributions: number;
  paidContributions: number;
  totalAmount: number;
  paidAmount: number;
}

export function useContributions(groupId: string) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/groups/${groupId}/contributions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contributions');
      }

      const data = await response.json();
      setContributions(data.contributions);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (contributionId: string, paymentData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contributionId,
          ...paymentData
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      // Refresh contributions after successful payment
      await fetchContributions();
      return await response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  useEffect(() => {
    if (user && groupId) {
      fetchContributions();
    }
  }, [user, groupId]);

  return {
    contributions,
    stats,
    loading,
    error,
    makePayment,
    refreshContributions: fetchContributions
  };
}
