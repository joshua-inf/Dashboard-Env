'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { FilterIcon, Link } from 'lucide-react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { Table } from './components/Table'
import { usePathname } from 'next/navigation'
import Container from '../Layouts/Container'
import { OrderData } from '@/types/Orders'
import { getOrdersByBusinessId } from '@/services/api/apiOrder'
import { ListIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon } from "lucide-react"; // adjust based on actual imports
import { getOrgData } from '@/lib/createCookie'

export const Orders = () => {
    const [open, setOpen] = useState(false)
    const router = usePathname()
    const [orderData, setOrderData] = useState<null | OrderData[] | undefined>()
    const [filterValue, setFilterValue] = useState('')
    const [loading, setLoading] = useState(false)
    const businessData = getOrgData() // Assuming this function returns the business data
    const [businessLoading, setBusinessLoading] = useState(false)


    const getBusinessDat = () => {
        setLoading(true)
        getOrdersByBusinessId(businessData?.id)
            .then((res) => {
                // console.log(res)
                setOrderData(res)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            });
    }

    useEffect(() => {
        getBusinessDat()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <div>
            <div className='flex items-center flex-col gap-3'>
                <div className="w-full border-b border-gray-300 dark:border-gray-700">
                    <nav className="flex gap-6 px-4 sm:px-6 md:px-8 lg:px-10 overflow-x-auto whitespace-nowrap">
                        {[
                            { label: "All", value: "", icon: <ListIcon className="size-4 mr-2" /> },
                            { label: "Pending", value: "pending", icon: <ClockIcon className="size-4 mr-2" /> },
                            { label: "Settled", value: "completed", icon: <CheckCircleIcon className="size-4 mr-2" /> },
                            { label: "Pending Transactions", value: "failed", icon: <AlertTriangleIcon className="size-4 mr-2" /> },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setFilterValue(tab.value)}
                                className={`relative grow-0 inline-flex items-center py-4 px-1 transition-all duration-200 ${filterValue === tab.value
                                    ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400"
                                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                            >
                                {tab.icon}
                                <span className='hidden sm:inline'>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className='flex w-full items-center gap-3'>
                    <Input placeholder='Search' className='max-w-md w-full grow outline-none border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200' />
                    <button className='flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                        <FilterIcon className='size-5' />
                        <span className='hidden sm:inline'>
                            Filer
                        </span>
                    </button>
                    <button className='flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                        <ListIcon className='size-5' />
                        <span className='hidden sm:inline'>
                            Sort
                        </span>
                    </button>
                </div>
                <Table setData={getBusinessDat} data={orderData} filter={filterValue} open={setOpen} />
            </div>
        </div>
    )
}
