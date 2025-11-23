import { DollarSign } from 'lucide-react'
import React, { useState } from 'react'
import { TotalRevenue } from './TotalRevenue'
import { DashboardSummary } from '@/services/api/Dashboard';

interface TotalRevenueContProps {
    data: DashboardSummary | null | undefined;
    loading?: boolean;
}
export const TotalRevenueCont = ({ data }: TotalRevenueContProps) => {
     const [range, setRange] = useState("7_days");

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 hidden md:block">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-500" />
                            Revenue analytics
                        </h3>

                        {/* Dropdown */}
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="7_days">Last 7 Days</option>
                            <option value="30_days">Last 30 Days</option>
                            <option value="12_months">Last 12 Months</option>
                        </select>
                    </div>

                    <TotalRevenue data={data} range={range} />
                </div>
            </div>
        </div>
    )
}
