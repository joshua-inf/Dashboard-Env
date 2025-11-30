import React from 'react';
import '@/css/Table.css';
import { Customers } from '@/types/Customers';
import { Sale } from '@/types/Sales';
import { OrderData } from '@/types/Orders';

type TableProps = {
    setDialogOpen: (val: boolean) => void;
    open: any;
    data: OrderData[] | null | undefined;
    onTransactionClick?: any
};

export const Table: React.FC<TableProps> = ({ setDialogOpen, data, onTransactionClick }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                No.
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Sale Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data?.map((sale, key) => (
                            <tr
                                key={key}
                                onClick={() => {
                                    setDialogOpen(true);
                                    onTransactionClick(sale.id, sale);
                                    console.log({ "sales": sale.customers, "sales: ": sale });
                                }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {key + 1}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                {sale.customers?.name?.charAt(0)?.toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {sale.customers?.name ?? "Anonymous"}
                                            </div>
                                            {sale.customers?.email && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {sale.customers.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        K{sale.total_amount.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {sale.created_at
                                            ? new Date(sale.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                            : new Date().toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                        }
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {sale.created_at
                                            ? new Date(sale.created_at).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : new Date().toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {(!data || data.length === 0) && (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No sales data
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Sales transactions will appear here once customers make purchases.
                    </p>
                </div>
            )}

            {/* Footer with Summary */}
            {data && data.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>
                            Showing {data.length} sale{data.length !== 1 ? 's' : ''}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Total: K{data.reduce((sum, sale) => sum + sale.total_amount, 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
        </div>

    );
};
