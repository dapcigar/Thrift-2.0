import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pound, CreditCard, Bank, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface PaymentFormProps {
  groupId: string;
  contributionAmount: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  groupId,
  contributionAmount,
  onSubmit,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        groupId,
        amount: contributionAmount,
        paymentMethod,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Make Payment</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">Payment Amount</p>
        <div className="flex items-center mt-1">
          <Pound className="h-6 w-6 text-blue-500" />
          <span className="text-2xl font-bold text-blue-700">
            {formatCurrency(contributionAmount)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border ${paymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'}`}
            >
              <CreditCard className={`h-6 w-6 mx-auto ${paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className={`mt-2 text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-500'}`}>
                Card Payment
              </p>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod('bank')}
              className={`p-4 rounded-lg border ${paymentMethod === 'bank' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'}`}
            >
              <Bank className={`h-6 w-6 mx-auto ${paymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className={`mt-2 text-sm font-medium ${paymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-500'}`}>
                Bank Transfer
              </p>
            </motion.button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </div>
              ) : (
                'Confirm Payment'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
