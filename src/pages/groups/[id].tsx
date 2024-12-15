import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Pound, Calendar, ChevronRight, Plus, Mail, Share2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useGroups } from '@/hooks/useGroups';
import { useContributions } from '@/hooks/useContributions';
import { formatCurrency } from '@/utils/currency';
import ContributionList from '@/components/contributions/ContributionList';
import PaymentForm from '@/components/payments/PaymentForm';
import MemberList from '@/components/groups/MemberList';
import InviteMemberForm from '@/components/groups/InviteMemberForm';

const GroupDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { groups } = useGroups();
  const { contributions, stats, loading, makePayment } = useContributions(id as string);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'contributions' | 'members'>('contributions');

  const group = groups.find(g => g.id === id);

  const handlePayment = async (paymentData: any) => {
    try {
      await makePayment(selectedContribution!, paymentData);
      setShowPaymentModal(false);
      setSelectedContribution(null);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleInviteMember = async (data: { email: string }) => {
    try {
      // TODO: Implement invite member API call
      console.log('Inviting member:', data.email);
      setShowInviteModal(false);
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  if (!group) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Group not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Group Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {group.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {group.description}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Invite Member
            </motion.button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {group.memberCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <Pound className="h-6 w-6 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contribution</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(group.contributionAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Payout</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(group.nextPayoutDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Collection Progress</span>
              <span>{stats ? `${((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)}%` : '0%'}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: stats ? `${(stats.paidAmount / stats.totalAmount) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('contributions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contributions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contributions
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Members
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode='wait'>
          {activeTab === 'contributions' ? (
            <motion.div
              key="contributions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Contributions
                </h2>
                {stats && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Collected: {formatCurrency(stats.paidAmount)} / {formatCurrency(stats.totalAmount)}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <ContributionList
                  contributions={contributions}
                  onPaymentClick={(contributionId) => {
                    setSelectedContribution(contributionId);
                    setShowPaymentModal(true);
                  }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MemberList members={group.members} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showPaymentModal && selectedContribution && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-md"
              >
                <PaymentForm
                  groupId={group.id}
                  contributionAmount={group.contributionAmount}
                  onSubmit={handlePayment}
                  onCancel={() => {
                    setShowPaymentModal(false);
                    setSelectedContribution(null);
                  }}
                />
              </motion.div>
            </div>
          )}

          {showInviteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-md"
              >
                <InviteMemberForm
                  onSubmit={handleInviteMember}
                  onCancel={() => setShowInviteModal(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default GroupDetailsPage;
