import React from 'react'
import BarChart from '../components/BarChart'
import { SalesAnalyticsData } from '@/services/api/products'

export const PeakSalePeriod = ({data}:{data: SalesAnalyticsData | null}) => {
    
    return (
        <div className="border grow dark:border-gray-700 grow border-[#C9C9C9] p-3 rounded-md dark:bg-gray-800">
            <div className="">
                <BarChart data={data?.sales} />
            </div>
            <div>
                <div className="text-[#1A0670] dark:text-blue-400">Peak Sales Periods</div>
                <div className="flex text-[#1A0670] dark:text-blue-400 justify-between items-end gap-2">
                    <div className="flex items-end gap-2">
                        <div className="font-bold text-2xl">Fridays</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
