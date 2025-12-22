import React from 'react';
import { OrderData } from '@/types/Orders';
import { TableRow } from './TableRow';

interface TableProps {
    open: any;
    filter: string;
    data: OrderData[] | undefined | null;
    setData: (data: OrderData[]) => void;
}

export const Table: React.FC<TableProps> = ({ open, filter, data, setData }) => {
    const filteredData = data?.filter((order) => {
        switch (filter) {
            case "":
                return order.order_payment_status !== "pending";
            case "pending":
                return order.order_status === "pending" && order.order_payment_status !== "pending";
            case "completed":
                return order.order_status === "completed" && order.order_payment_status !== "pending";
            case "failed":
                return order.order_payment_status === "pending";
            default:
                return false;
        }
    });

    const getEmptyStateMessage = () => {
        switch (filter) {
            case "pending":
                return "No pending orders found";
            case "completed":
                return "No completed orders found";
            case "failed":
                return "No failed payments found";
            default:
                return "No orders found";
        }
    };

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    {/* Table Header */}
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Order Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Customer Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Payment Status
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((order) => (
                                <TableRow
                                    key={order.id}
                                    order={order}
                                    setOrderData={setData}
                                />
                            ))
                        ) : (
                            // Empty State
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
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
                                            {getEmptyStateMessage()}
                                        </h3>
                                        <p className="text-sm max-w-sm mx-auto">
                                            {filter === ""
                                                ? "Start accepting orders to see them appear here."
                                                : "Try changing your filters to see more results."
                                            }
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Summary */}
            {filteredData && filteredData.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>
                            Showing {filteredData.length} order{filteredData.length !== 1 ? 's' : ''}
                            {filter && ` • Filtered by: ${filter}`}
                        </span>
                        <span className="font-medium">
                            Total: {filteredData.length}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};