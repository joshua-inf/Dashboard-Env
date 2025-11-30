import React from 'react'
import BarChart from '../components/BarChart'
import { SalesAnalyticsData } from '@/services/api/products'
import { OrderData } from '@/types/Orders'

export const PeakSalePeriod = ({ data }: { data: OrderData[] | null | undefined }) => {
    // Map days of week to total sales
    const daySalesMap: Record<string, number> = {};

    data?.forEach(order => {
        const date = new Date(order.created_at);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        if (!daySalesMap[dayName]) daySalesMap[dayName] = 0;
        daySalesMap[dayName] += order.total_amount ?? 0;
    });

    // Find the max sales
    const maxSales = Math.max(...Object.values(daySalesMap));

    // Collect all days with max sales
    const peakDays = Object.entries(daySalesMap)
        .filter(([_, total]) => total === maxSales)
        .map(([day]) => day);

    return (
        <div className="border grow dark:border-gray-700 grow border-[#C9C9C9] p-3 rounded-md dark:bg-gray-800">
            <div className="">
                <BarChart data={data ?? undefined} />
            </div>
            <div>
                <div className="text-[#1A0670] dark:text-blue-400">Peak Sales Periods</div>
                <div className="flex text-[#1A0670] dark:text-blue-400 justify-between items-end gap-2">
                    <div className="flex items-end gap-2">
                        <div className="font-bold text-2xl">{peakDays.join(", ")}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
