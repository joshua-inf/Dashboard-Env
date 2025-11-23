import React from 'react'
import PieChart from "../components/PieChart";
import { LocationType } from '@/types/Customers';

const TopArea = ({location}:{location:LocationType[] | null}) => {
    return (
        <>
            <div>
                <PieChart location={location}/>
            </div>
            <div>
                <div className="text-[#1A0670] dark:text-white">High-Value vs. Low-Value Customers</div>
                <div className="flex text-[#1A0670] dark:text-white justify-between items-end">
                    <div className="flex items-end gap-2">
                        <div className="font-bold text-2xl">25.7K</div>
                        <div className="text-sm font-light">last 7 days</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopArea