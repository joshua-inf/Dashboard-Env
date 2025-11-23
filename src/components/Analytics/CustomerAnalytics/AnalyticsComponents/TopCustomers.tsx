import { CustomerPrice } from '@/types/Customers'
import { CrownIcon, Users, TrendingUp } from 'lucide-react'
import React from 'react'

const TopCustomers = ({ 
    cutomerDatas, 
    amountInLastSevenDays 
}: { 
    cutomerDatas: CustomerPrice[] | null | any, 
    amountInLastSevenDays: number | null 
}) => {
    // Safe data processing with fallbacks
    const safeCustomerData = Array.isArray(cutomerDatas) ? cutomerDatas : [];
    const hasCustomers = safeCustomerData.length > 0;
    
    const totalAmount = hasCustomers 
        ? safeCustomerData.reduce((sum: number, item: CustomerPrice) => sum + (item.amount || 0), 0)
        : 0;

    const sortedCustomers: CustomerPrice[] = hasCustomers
        ? [...safeCustomerData].sort((a, b) => (b.amount || 0) - (a.amount || 0))
        : [];

    const highestAmount: number = hasCustomers ? (sortedCustomers[0]?.amount || 0) : 0;

    // Empty state component
    if (!hasCustomers) {
        return (
            <div className="flex flex-col gap-4 items-stretch w-full mt-6">
                <h3 className="text-lg font-semibold text-[#1A0670] dark:text-white mb-1">
                    Top Customers
                </h3>
                
                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl \">
                    <Users className="w-12 h-12 text-gray-400 mb-3" />
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        No Customer Data
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        Customer ranking will appear here once you have sales data.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Top spenders will be shown here</span>
                    </div>
                </div>

                {/* Summary - Even when no customers */}
                <div className="flex justify-between items-end text-[#1A0670] dark:text-white mt-2">
                    <div className="flex items-end gap-2">
                        <div className="font-bold text-2xl">
                            K{(amountInLastSevenDays || 0).toFixed(2)}
                        </div>
                        <div className="text-sm font-light">last 7 days</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 items-stretch w-full mt-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#1A0670] dark:text-white">
                    Top Customers
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sortedCustomers.length} customer{sortedCustomers.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Customers List */}
            <div className="space-y-2">
                {sortedCustomers.slice(0, 4).map((customer: CustomerPrice, index: number) => {
                    const isTop = highestAmount === customer.amount;
                    const percentage = totalAmount > 0 
                        ? ((customer.amount / totalAmount) * 100).toFixed(1)
                        : '0.0';

                    return (
                        <div
                            key={customer.id || index}
                            className={`
                                flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-sm transition-all duration-200
                                ${isTop 
                                    ? "bg-yellow-100 dark:bg-yellow-800/20 border border-yellow-200 dark:border-yellow-700" 
                                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }
                                text-[#1A0670] dark:text-white
                            `}
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* Rank Indicator */}
                                <div className={`
                                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                    ${isTop 
                                        ? 'bg-yellow-500 text-white' 
                                        : 'bg-gray-400 dark:bg-gray-600 text-white'
                                    }
                                `}>
                                    {index + 1}
                                </div>
                                
                                {/* Customer Name */}
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {isTop && (
                                        <div className="text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                                            <CrownIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                    <span className="font-medium truncate" title={customer.name}>
                                        {customer.name || `Customer ${index + 1}`}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Percentage */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="text-sm font-semibold">
                                    {percentage}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    K{(customer.amount || 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary - Total Sales */}
            <div className="flex justify-between items-end text-[#1A0670] dark:text-white mt-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-end gap-2">
                    <div className="font-bold text-2xl">
                        K{(amountInLastSevenDays || 0).toFixed(2)}
                    </div>
                    <div className="text-sm font-light">last 7 days</div>
                </div>
                
                {/* Additional summary info */}
                {hasCustomers && (
                    <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Top customer: {sortedCustomers[0]?.name?.split(' ')[0] || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {((highestAmount / totalAmount) * 100).toFixed(1)}% of total
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopCustomers;