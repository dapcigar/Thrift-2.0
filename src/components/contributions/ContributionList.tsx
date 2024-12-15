import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, Pound } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface Contribution {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'late';
  memberName: string;
}

interface ContributionListProps {
  contributions: Contribution[];
  onPaymentClick: (contributionId: string) => void;
}

const ContributionList: React.FC<ContributionListProps> = ({ 
  contributions,
  onPaymentClick 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-50';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50';
      case 'late':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <motion.div
          key={contribution.id}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{contribution.memberName}</h3>
              <p className="text-sm text-gray-500">
                Due: {new Date(contribution.dueDate).toLocaleDateString('en-GB')}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(contribution.amount)}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(contribution.status)}`}>
                  {getStatusIcon(contribution.status)}
                  <span className="ml-1">{contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}</span>
                </span>
              </div>

              {contribution.status === 'pending' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPaymentClick(contribution.id)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Pay Now
                </motion.button>
              )}
            </div>
          </div>

          {contribution.paidDate && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Paid: {new Date(contribution.paidDate).toLocaleDateString('en-GB')}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ContributionList;
