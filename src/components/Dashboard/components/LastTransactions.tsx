import React from 'react'
import './customstyles/Table.css'
import { Eye, FileText, RefreshCw, AlertCircle, Download, Filter } from 'lucide-react'

interface Transaction {
  ID: string;
  IssuedDate: string;
  Total: string;
  status?: 'completed' | 'pending' | 'failed';
  customer?: string;
}

export const LastTransactions = () => {
  // Sample data - replace with actual data from props/API
  const data: Transaction[] = [
    {
      ID: '#50989',
      IssuedDate: '31 March 2023',
      Total: '$200',
      status: 'completed',
      customer: 'John Doe'
    },
    {
      ID: '#50988',
      IssuedDate: '30 March 2023',
      Total: '$150',
      status: 'pending',
      customer: 'Jane Smith'
    },
    {
      ID: '#50987',
      IssuedDate: '29 March 2023',
      Total: '$300',
      status: 'completed',
      customer: 'Mike Johnson'
    },
    {
      ID: '#50986',
      IssuedDate: '28 March 2023',
      Total: '$75',
      status: 'failed',
      customer: 'Sarah Wilson'
    },
    {
      ID: '#50985',
      IssuedDate: '27 March 2023',
      Total: '$420',
      status: 'completed',
      customer: 'Alex Brown'
    }
  ]

  const hasData = data && data.length > 0;

  const getStatusConfig = (status: string) => {
    const config = {
      completed: {
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        label: 'Completed'
      },
      pending: {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Pending'
      },
      failed: {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        label: 'Failed'
      }
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const handleViewDetails = (transaction: Transaction) => {
    console.log('View details for:', transaction);
    // Implement view details logic
  };

  const handleExport = () => {
    console.log('Export transactions');
    // Implement export logic
  };

  if (!hasData) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-dashed border-gray-300/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Last Transactions
              </h3>
            </div>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
              No transactions
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transaction history will appear here once you start processing payments
          </p>
        </div>

        {/* Empty State Content */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              No Transactions Yet
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
              Your transaction history will appear here once you start processing payments and sales.
            </p>

            {/* Sample Transaction Preview */}
            <div className="w-full max-w-md mb-6">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium text-center">
                What you&apos;ll see here:
              </div>
              <div className="space-y-2">
                {[
                  { id: '#50989', date: '31 Mar 2023', amount: '$200', status: 'completed' },
                  { id: '#50988', date: '30 Mar 2023', amount: '$150', status: 'pending' }
                ].map((sample, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{sample.id}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-500">{sample.date}</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{sample.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>View Details</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>

          {/* Action Suggestions */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
              Get started with transactions:
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                <span>Process your first payment</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3 h-3" />
                <span>Set up payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span>Monitor transaction status</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest payment activities and transaction status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors border border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((transaction, index) => {
              const statusConfig = getStatusConfig(transaction.status || 'pending');
              
              return (
                <tr 
                  key={`${transaction.ID}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.ID}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.customer || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.IssuedDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {transaction.Total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(transaction)}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {data.length} recent transactions</span>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
            View all transactions
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};