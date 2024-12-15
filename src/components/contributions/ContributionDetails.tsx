import React from 'react';
import { motion } from 'framer-motion';
import { Pound, Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface ContributionDetailsProps {
  groupName: string;
  contribution: {
    amount: number;
    dueDate: string;
    status: string;
    paymentHistory: Array<{
      id: string;
      date: string;
      amount: number;
      status: string;
    }>;
  };
}

const ContributionDetails: React.FC<ContributionDetailsProps> = ({
  groupName,
  contribution
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{groupName}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          contribution.status === 'paid' ? 'bg-green-100 text-green-800' :
          contribution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Pound className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Amount Due</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {formatCurrency(contribution.amount)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Due Date</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {new Date(contribution.dueDate).toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
        <div className="space-y-4">
          {contribution.paymentHistory.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                payment.status === 'successful' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {contribution.status === 'pending' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Make Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
};

export default ContributionDetails;
