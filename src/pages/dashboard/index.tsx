import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Pound, Users, Clock, TrendingUp, Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { useGroups } from '@/hooks/useGroups';
import { formatCurrency } from '@/utils/currency';
import GroupList from '@/components/groups/GroupList';
import CreateGroupForm from '@/components/groups/CreateGroupForm';

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { groups, loading: groupsLoading, error, createGroup } = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  if (authLoading || groupsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Calculate dashboard statistics
  const stats = {
    totalGroups: groups.length,
    activeSavings: groups.reduce((total, group) => total + group.totalSaved, 0),
    nextPayment: groups.reduce((nearest, group) => {
      const payoutDate = new Date(group.nextPayoutDate);
      return !nearest || payoutDate < nearest ? payoutDate : nearest;
    }, null as Date | null),
    savingsGrowth: 12.5 // This would come from actual calculations
  };

  const handleCreateGroup = async (data: any) => {
    try {
      await createGroup(data);
      setShowCreateGroup(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Welcome back, {user?.firstName}! Here's your savings overview.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateGroup(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Group
          </motion.button>
        </div>

        {/* Stats grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Groups"
            value={stats.totalGroups}
            icon={<Users className="h-6 w-6 text-blue-500" />}
          />
          <StatsCard
            title="Total Savings"
            value={stats.activeSavings}
            icon={<Pound className="h-6 w-6 text-green-500" />}
            isCurrency
            trend={{
              value: stats.savingsGrowth,
              isPositive: true
            }}
          />
          <StatsCard
            title="Next Payment"
            value={stats.nextPayment ? new Date(stats.nextPayment).toLocaleDateString('en-GB') : 'No upcoming'}
            icon={<Clock className="h-6 w-6 text-purple-500" />}
          />
          <StatsCard
            title="Monthly Growth"
            value={`${stats.savingsGrowth}%`}
            icon={<TrendingUp className="h-6 w-6 text-indigo-500" />}
            trend={{
              value: stats.savingsGrowth,
              isPositive: true
            }}
          />
        </div>

        {/* Active Groups */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Active Groups
          </h2>
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : groups.length > 0 ? (
            <GroupList groups={groups} onGroupClick={handleGroupClick} />
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No active groups
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new savings group.
              </p>
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateGroup(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New Group
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl"
            >
              <CreateGroupForm
                onSubmit={handleCreateGroup}
                onCancel={() => setShowCreateGroup(false)}
              />
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
