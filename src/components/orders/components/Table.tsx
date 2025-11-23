import React, { useEffect, useState } from 'react'
import '@/css/Table.css'
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "@heroicons/react/16/solid";
import { AlertTriangleIcon, BadgeCheckIcon, Check, DotIcon, ImageIcon } from 'lucide-react';
import { MdArrowBack } from 'react-icons/md';
import { OrderData } from '@/types/Orders';
import { getOrderImages, getOrdersByBusinessId, marckSettled } from '@/services/api/apiOrder';
import { getOrgData } from '@/lib/createCookie';
import Image from 'next/image';
import { TableRow } from './TableRow';

export const Table = ({ open, filter, data, setData }: { open: any, filter: string, data: OrderData[] | undefined | null, setData: any }) => {
    // api for getting orders data can be pkaced here



    return (
        <>
            <div className="overflow-x-auto  w-full  scroll-smooth shadow-md rounded-lg bg-white dark:bg-gray-700">
                <table className=" w-full text-sm md:text-md border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">ORDER STATUS</th>
                            <th className="px-4 py-2 text-left">ORDER DATE</th>
                            <th className="px-4 py-2 text-left">CUSTOMER NAME</th>
                            <th className="px-4 py-2 text-left">ORDER ID</th>
                            <th className="px-4 py-2 text-left">ORDER AMOUNT</th>
                            <th className="px-4 py-2 text-left">PAYMENT STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                        {data
                            ?.filter((e) => {
                                if (filter === "") return e.order_payment_status !== "pending"; // show all
                                if (filter === "pending")
                                    return e.order_status === "pending" && e.order_payment_status !== "pending";
                                if (filter === "completed")
                                    return e.order_status === "completed" && e.order_payment_status !== "pending";
                                if (filter === "failed") return e.order_payment_status === "pending";
                                return false;
                            })
                            .map((e) => (
                                <TableRow key={e.id} e={e} setOrderData={setData} />
                            ))}
                    </tbody>
                </table>
            </div>

        </>
    )

}