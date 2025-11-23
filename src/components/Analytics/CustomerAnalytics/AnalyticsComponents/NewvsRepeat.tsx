import React from 'react'
import LatestChart from '../components/DemoLatest'
import { Users, Repeat, UserPlus, AlertCircle } from 'lucide-react'

export const NewvsRepeat = ({ data }: { data: any }) => {
  // Validate and process data
  const isValidData = data &&
    typeof data === 'object' &&
    'new' in data &&
    'repeat' in data &&
    (data.new > 0 || data.repeat > 0);

  const totalCustomers = isValidData ? (data.new + data.repeat) : 0;
  const newCustomerPercentage = isValidData && totalCustomers > 0
    ? ((data.new / totalCustomers) * 100).toFixed(1)
    : '0.0';
  const repeatCustomerPercentage = isValidData && totalCustomers > 0
    ? ((data.repeat / totalCustomers) * 100).toFixed(1)
    : '0.0';

  // Empty state component
  if (!isValidData) {
    return (
      <div className="border grow border-[#C9C9C9] dark:border-strokedark p-4 rounded-md flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center min-h-[200px]">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            No Customer Data
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            New vs. repeat customer analysis will appear here once you have customer data.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              <span>New</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat className="w-3 h-3" />
              <span>Repeat</span>
            </div>
          </div>
        </div>

        {/* Summary section even when no data */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-[#1A0670] dark:text-white font-medium mb-2">
            New vs. Repeat Customers
          </div>
          <div className="flex text-[#1A0670] dark:text-white justify-between items-end gap-2">
            <div className="flex items-end gap-2">
              <div className="font-bold text-2xl">0% New</div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No data
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border grow border-[#C9C9C9] dark:border-strokedark p-4 rounded-md flex flex-col">
      {/* Chart Section */}
      <div className="flex-1 mb-4">
        <div className="max-w-[300px] mx-auto">
          <LatestChart data={data} />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">New</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {data.new}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {newCustomerPercentage}%
          </div>
        </div>

        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Repeat className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Repeat</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {data.repeat}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            {repeatCustomerPercentage}%
          </div>
        </div>
      </div>

      {/* Main Title and Overall Percentage */}
      <div className="mt-auto">
        <div className="text-[#1A0670] dark:text-white font-medium mb-2">
          New vs. Repeat Customers
        </div>
        <div className="flex text-[#1A0670] dark:text-white justify-between items-end gap-2">
          <div className="flex items-end gap-2">
            <div className="font-bold text-2xl">{newCustomerPercentage}% New</div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {totalCustomers}
          </div>
        </div>

        {/* Additional insight */}
        {totalCustomers > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            <span>
              {repeatCustomerPercentage}% of customers are returning
            </span>
          </div>
        )}
      </div>
    </div>
  );
}