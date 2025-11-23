import React from 'react'
import PieChart from './charts/PieChart'
import { FaGenderless } from 'react-icons/fa'
import { RefreshCw, TrendingUp, Users, BarChart3, AlertCircle } from 'lucide-react'
import { DashboardSummary } from '@/services/api/Dashboard'

export const SalesByCategory = ({ data }: { data: DashboardSummary | null }) => {
    // Validate and process data
    const isValidData = data &&
        typeof data === 'object' &&
        Object.keys(data).length > 0 &&
        Object.values(data).some((value: any) => Number(value) > 0);

    const growth = 9;
    const isPositiveGrowth = growth >= 0;

    // Calculate total sales for percentages
    const totalSales = isValidData ? Object.values(data).reduce((sum: number, value: any) => sum + Number(value), 0) : 0;

    // Empty state component
    if (!isValidData) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Sales by Gender
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                No data available • <RefreshCw className="w-3 h-3" /> Check back later
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        No Data
                    </div>
                </div>

                {/* Empty State Content */}
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        No Sales Data
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs">
                        Gender-based sales distribution will appear here once you have sales data categorized by gender.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <FaGenderless className="w-3 h-3" />
                            <span>Male/Female</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Sales Trends</span>
                        </div>
                    </div>
                </div>

                {/* Sample data preview for guidance */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                        Expected data format:
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                        <div>• Male: 45% of sales</div>
                        <div>• Female: 52% of sales</div>
                        <div>• Other: 3% of sales</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <FaGenderless className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Sales by Gender
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            Last 7 days • <RefreshCw className="w-3 h-3" /> Updated just now
                        </p>
                    </div>
                </div>

                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isPositiveGrowth
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    <TrendingUp className={`w-4 h-4 ${!isPositiveGrowth ? 'rotate-180' : ''}`} />
                    {Math.abs(growth).toFixed(1)}%
                </div>
            </div>

            {/* Chart */}
            <div className="w-full flex justify-center mb-4">
                <PieChart data={data} />
            </div>

           

            {/* Total Sales */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales:</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {data.allSales.length > 0 ? data.allSales.length : '0'}
                    </span>
                </div>
            </div>
        </div>
    );
}