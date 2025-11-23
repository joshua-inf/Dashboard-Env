import React from 'react'
import { ApexOptions } from 'apexcharts';
import { DashboardSummary } from '@/services/api/Dashboard'

export const TodayOrder = ({ data }: { data: DashboardSummary | null | undefined }) => {
    const getDate = (data1: string) => {
        const data = new Date(data1)

        return data.getDate()
    }

    return (
        <div className="relative rounded-xl h-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-900 shadow-xl p-6 flex flex-wrap gap-4 items-center justify-between border dark:border-gray-600 border-gray-200">
            {/* Optional Icon */}
            <div className="absolute -top-4 left-4 bg-indigo-600 text-white rounded-full p-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M9 3v18M15 3v18" />
                </svg>
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold text-black dark:text-white">Today’s Orders</div>

                <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">
                    K{
                        data?.OrderData.allOrders
                            .filter((e: any) =>  new Date(e.created_at).toLocaleDateString() == new Date().toLocaleDateString())
                            .reduce((prev, curr) => prev + curr.total_amount, 0)
                            .toFixed(2)
                    }
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                    Orders made today
                </div>
            </div>
        </div>
    )
}
