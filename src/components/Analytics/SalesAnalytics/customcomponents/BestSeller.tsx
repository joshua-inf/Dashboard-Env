import React from 'react'
import AreaChart from '../components/AreaChart'

export const BestSeller = () => {
    return (
        <div className="grow p-3 rounded-md border border-[#C9C9C9] dark:border-gray-700 dark:bg-gray-800">
            {/* Chart Section */}
            <div className="grow">
                <AreaChart />
            </div>

            {/* Title and Info Section */}
            <div className="flex items-end gap-5 text-[#1A0670] dark:text-white mt-4">
                <div className="flex flex-col items-start gap-2">
                    <span>Best Sellers</span>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">Top 5</span>
                        <span className="text-sm font-light">last 7 days</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
