import React, { useEffect } from 'react'
import BarChart from '../components/BarChart'
import { SalesAnalyticsData } from '@/services/api/products'
import PieChart from '../components/PieChart'
import { isWithinLast7Days } from './TopProducts'

export const SalesRevenueByRegion = ({ data }: { data: SalesAnalyticsData | null }) => {
    return (
        <div className="grow p-4 rounded-md border border-[#C9C9C9] dark:border-gray-700 dark:bg-gray-800">
            {/* Pie Chart Section */}
            <div className='text-white'>
                <PieChart data={data} />
            </div>

            {/* Revenue Info Section */}
            <div className="mt-4 text-[#1A0670] dark:text-white">
                <div className="font-medium">Sales Revenue by Region</div>
                <div className="flex justify-between items-end mt-2">
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                            K {data?.sales
                                .reduce((prev, curr) => prev + curr.total_amount, 0)
                                .toFixed(2)}
                        </span>
                        <span className="text-sm font-light">last 7 days</span>
                    </div>
                </div>
            </div>
        </div>

    )
}
