import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { SavingsGroup } from '@/types/dashboard';
import { formatCurrency } from '@/utils/currency';

interface GroupListProps {
  groups: SavingsGroup[];
  onGroupClick: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onGroupClick }) => {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <motion.div
          key={group.id}
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer"
          onClick={() => onGroupClick(group.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Members</p>
                <p className="font-semibold text-gray-900 dark:text-white">{group.memberCount}</p>
              </div>
            </div>

            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contribution</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(group.contributionAmount)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Next Payout</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(group.nextPayoutDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Saved</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(group.totalSaved)}
              </p>
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${(group.totalSaved / (group.contributionAmount * group.memberCount)) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GroupList;