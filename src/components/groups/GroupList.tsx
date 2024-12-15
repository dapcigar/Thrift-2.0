import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { SavingsGroup } from '@/types/dashboard';

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
          className="bg-white rounded-lg shadow p-6 cursor-pointer"
          onClick={() => onGroupClick(group.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="font-semibold">{group.memberCount}</p>
              </div>
            </div>

            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Contribution</p>
                <p className="font-semibold">${group.contributionAmount}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Next Payout</p>
                <p className="font-semibold">{new Date(group.nextPayoutDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Total Saved</p>
              <p className="text-lg font-semibold text-green-600">${group.totalSaved}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GroupList;
