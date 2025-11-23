import { AmountDistEntry, SalesAnalyticsData } from '@/services/api/products'
import { CrownIcon } from 'lucide-react'
import React, { useEffect } from 'react'

export function isWithinLast7Days(dateToCheck: any) {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return dateToCheck >= sevenDaysAgo && dateToCheck <= now;
}
export const TopProducts = ({ data }: { data: SalesAnalyticsData | null }) => {
    useEffect(() => {
        console.log('sales data', data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // 1️⃣ Highest amountMade
    const highestAmount = data?.amountDist.reduce(
        (max: number, curr: AmountDistEntry) => Math.max(max, curr.amountMade),
        0
    );

    // 2️⃣ Total amountMade
    const totalAmount = data?.amountDist.reduce(
        (sum: number, curr: AmountDistEntry) => sum + curr.amountMade,
        0
    );



    const sortedData = data?.amountDist.sort((a, b) => b.amountMade - a.amountMade)

    return (
        <div className="grow p-4 rounded-md border border-[#C9C9C9] dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
            {/* Top Products Section */}
            <div className="flex flex-col gap-4 w-full">
                <h3 className="text-lg font-semibold text-[#1A0670] dark:text-white mb-1">Top Products</h3>
                {sortedData?.slice(0, 4).map((entry: AmountDistEntry, index: number) => {
                    const isTop = highestAmount === entry.amountMade;
                    const percentage = ((entry.amountMade / (totalAmount ?? 1)) * 100).toFixed(1);

                    return (
                        <div
                            key={index}
                            className={`
            flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-sm transition
            ${isTop ? "bg-yellow-100 dark:bg-yellow-800/20" : "bg-gray-100 dark:bg-gray-700"}
            text-[#1A0670] dark:text-white
          `}
                        >
                            <div className="flex items-center gap-2">
                                {isTop && (
                                    <span className="text-yellow-600 dark:text-yellow-400">
                                        <CrownIcon className="w-5 h-5" />
                                    </span>
                                )}
                                <span className="font-medium">{entry.product.name}</span>
                            </div>
                            <span className="text-sm font-semibold">{percentage}%</span>
                        </div>
                    );
                })}
            </div>

            {/* Top Customers Section */}
            <div className="mt-6 text-[#1A0670] dark:text-white">
                <div className="font-medium mb-1">Top Customers</div>
                <div className="flex justify-between items-end mt-2">
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                           K {data?.sales
                                .filter((e) => !isWithinLast7Days(e.created_at))
                                .reduce((sum, curr) => sum + curr.total_amount, 0)
                                .toFixed(2)}
                        </span>
                        <span className="text-sm font-light">last 7 days</span>
                    </div>
                </div>
            </div>
        </div>


    )
}
