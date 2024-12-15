import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/currency';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isCurrency?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  isCurrency = false
}) => {
  const displayValue = isCurrency ? formatCurrency(Number(value)) : value;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-blue-50">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{displayValue}</p>
          {trend && (
            <div className={`flex items-center mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
