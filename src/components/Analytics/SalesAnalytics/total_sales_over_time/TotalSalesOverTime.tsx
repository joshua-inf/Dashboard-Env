'use client'
import { Table } from '@/app/sales-analytics/total_sales_over_time/components/Table'
import { ArrowLeftIcon, FilterIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getOrgData } from '@/lib/createCookie'
import { BusinessType } from '@/types/businesses'
import { OrderData } from '@/types/Orders'
import { Customers } from '@/types/Customers'
import { TransactionTableType } from '@/types/TransactionsTablePopup'
import { getOrdersByBusinessId } from '@/services/api/apiOrder'

// Define available months
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const getMonth = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth(); // getMonth() returns 0-11, so add 1 for 1-12

    return month
}

interface TransactionDetails {
    customers?: Partial<Customers>;
    created_at: string;
    product_id: string;
    phone_number: string;
    receiptNo: string;
    email: string;
    amount: number;
    address: string;
}

const TotalSalesOverTime = () => {
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Total Sales Value");
    const [selectedM, setSelectedMonth] = useState<number>(new Date().getMonth())
    const [transactionDetails, setTransactionDetails] = useState<any>(null);
    const businessData: BusinessType | null = getOrgData()
    const [data, setData] = useState<null | OrderData[] | undefined>(null)
    const [Loading, setLoading] = useState(false)

    const handleTransactionClick = (customer_id: string, order: OrderData) => {
        // console.log("this is clicked: ",customer_id)

        let userData = data?.filter((e) => e.id == customer_id)[0]

        let PayloadData = {
            customers: userData, // assign the full Customers object
            created_at: order?.created_at ?? "",
            product_id: order?.product_id ?? "",
            phone_number: userData?.customers.phone ?? "",
            receiptNo: order.id ?? "",
            email: userData?.customers.email ?? "",
            amount: order.total_amount ?? "",
            address: userData?.delivery_location ?? "",
        }
        setTransactionDetails(PayloadData);
        setOpenDialog(true);
    };

    const getProductsPageData = React.useCallback(() => {
        setLoading(true)
        getOrdersByBusinessId(businessData?.id ?? null)
            .then((res: any) => {
                // console.log(res)
                setData(res)
            })
            .catch((errr) => {
                console.log(errr)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [businessData?.id])

    useEffect(() => {
        getProductsPageData()
    }, [getProductsPageData])


    const growthRate = () => {
        const previouse = data?.filter((e) => getMonth(e.created_at) == selectedM - 1).reduce((prev, cur) => prev + cur.total_amount, 0) ?? 0;
        const current = data?.filter((e) => getMonth(e.created_at) == selectedM).reduce((prev, cur) => prev + cur.total_amount, 0) ?? 0;
        if (previouse === 0) return 0;
        return ((current - previouse) / previouse) * 100;
    }


    return (
        <div className='pt-20 flex flex-col gap-10 p-3'>
            {/* Header */}
            <div className='w-full'>
                <div className='flex gap-4 items-center'>
                    <button className='dark:text-gray-200' onClick={() => router.back()}>
                        <ArrowLeftIcon className='size-4' />
                    </button>
                    <div className='text-[#8B909AA8] dark:text-gray-400 text-xl flex gap-5 items-center font-bold'>
                        Total Sales Over Time
                        <span className='text-[#1A0670] dark:text-blue-400 text-2xl'> ZMW {data?.reduce((prev, curr) => prev + curr.total_amount, 0)} </span>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-xs">
                <label htmlFor="month-select" className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                    Select Month
                </label>
                <select
                    id="month-select"
                    value={selectedM}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full p-2 text-lg rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A0670]"
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filter Dropdown */}
            <div className='w-full flex justify-end pe-5'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex text-lg items-center bg-white text-gray-800 dark:text-gray-200 dark:bg-boxdark'>
                        <FilterIcon className='size-4' />
                        {selectedFilter}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-boxdark">
                        <DropdownMenuSeparator />
                        {["Total Sales Value", "Total Number of Transactions", "Date", "Customer Name"].map(filter => (
                            <DropdownMenuItem
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                                By: {filter}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Stats Section */}
            <div className='flex w-full'>
                <div className='grow'>
                    <div className='flex flex-wrap justify-between'>
                        {[
                            {
                                value: 'ZMW ' + (data ?? [])
                                    .filter(e => getMonth(e.created_at) == selectedM)
                                    .reduce((sum, e) => sum + (e.total_amount ?? 0), 0), label: 'Current Month Revenue'
                            },
                            { value: data?.filter((e) => getMonth(e?.created_at) == selectedM).length, label: 'Number of Sales' },
                            { value: growthRate().toFixed(2) + '%', label: 'Growth from Previous Month' }
                        ].map(stat => (
                            <div key={stat.label} className='grow text-center'>
                                <div className='text-2xl text-[#1A0670] dark:text-blue-400 font-bold'>{stat.value}</div>
                                <div className='font-light dark:text-gray-300'>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Table with transaction click */}
                    <Table
                        open={openDialog}
                        setDialogOpen={setOpenDialog}
                        data={data?.filter((e) => getMonth(e.created_at) == selectedM)}
                        onTransactionClick={handleTransactionClick}
                    />
                </div>
            </div>

            {/* Dynamic AlertDialog for Transaction Details */}
            <AlertDialog open={openDialog}>
                <AlertDialogContent className="dark:bg-gray-800  bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-gray-200">Transaction Details</AlertDialogTitle>
                        <AlertDialogDescription>
                            {transactionDetails ? (
                                <div className="overflow-x-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Customer Name */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Customer Name</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.customers?.name}</p>
                                        </div>

                                        {/* Transaction Date */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Transaction Date</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.created_at}</p>
                                        </div>

                                        {/* Product/Services */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Product/Services</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.product_id}</p>
                                        </div>

                                        {/* Phone Number */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Phone Number</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.phone_number}</p>
                                        </div>

                                        {/* Receipt No. */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Receipt No.</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.receiptNo}</p>
                                        </div>

                                        {/* Email */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Email</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.email}</p>
                                        </div>

                                        {/* Transaction Amount */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Transaction Amount</p>
                                            <p className="text-gray-900 dark:text-gray-100">ZMW {transactionDetails.amount}</p>
                                        </div>

                                        {/* Address */}
                                        <div className="p-4 border rounded-lg dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Address</p>
                                            <p className="text-gray-900 dark:text-gray-100">{transactionDetails.address}</p>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">No transaction selected.</p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setOpenDialog(false)}
                            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Close
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-[#1C0F86] dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-700">
                            Done
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}

// Helper component for detail items
const DetailItem = ({ label, value }: { label: string; value: any }) => (
    <div>
        <div className='text-sm text-[#8B909A] dark:text-gray-400'>{label}</div>
        <div className='text-lg font-bold dark:text-gray-200'>{value}</div>
    </div>
);

export default TotalSalesOverTime;
