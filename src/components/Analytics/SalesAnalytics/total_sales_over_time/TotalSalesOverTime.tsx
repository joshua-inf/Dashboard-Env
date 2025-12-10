'use client'
import { Table } from '@/app/sales-analytics/total_sales_over_time/components/Table'
import { ArrowLeftIcon, CalendarIcon, CheckIcon, ChevronDownIcon, FilterIcon, ShoppingCartIcon, TableIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
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
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'

// Define available months
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


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
    const [selectedM, setSelectedMonth] = useState<number>(
        new Date().getFullYear() * 100 + (new Date().getMonth() + 1)
    );
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
            phone_number: userData?.customers?.phone ?? "",
            receiptNo: order.id ?? "",
            email: userData?.customers?.email ?? "",
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
                console.log(res)
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

    const getYearMonth = (dateString: string): number => {
        const d = new Date(dateString);
        const y = d.getFullYear();
        const m = d.getMonth() + 1; // 1-12
        return y * 100 + m; // YYYYMM
    }

    const growthRate = () => {
        const previous = data
            ?.filter(e => getYearMonth(e.created_at) === selectedM - 1)
            .reduce((prev, cur) => prev + (cur.total_amount ?? 0), 0) ?? 0;

        const current = data
            ?.filter(e => getYearMonth(e.created_at) === selectedM)
            .reduce((prev, cur) => prev + (cur.total_amount ?? 0), 0) ?? 0;

        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    return (
        <div className=' flex flex-col gap-10 p-3'>
            {/* Header */}
            <div className="w-full space-y-4">
                {/* Main Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="size-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Total Sales Over Time
                        </h1>
                        <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                ZMW {data?.reduce((prev, curr) => prev + curr.total_amount, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    {/* Month Selector */}
                    <div className="w-full sm:w-48">
                        <select
                            value={selectedM}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            {months.map((month, index) => {
                                const yearMonth = new Date().getFullYear() * 100 + (index + 1);
                                return (
                                    <option key={index} value={yearMonth}>
                                        {month} {new Date().getFullYear()}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex dark:text-white items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                            <FilterIcon className="size-4" />
                            {selectedFilter}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            {["Total Sales Value", "Total Number of Transactions", "Date", "Customer Name"].map((filter) => (
                                <DropdownMenuItem
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className="px-3 py-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {filter}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            value: 'ZMW ' + (data ?? [])
                                .filter(e => getYearMonth(e.created_at) === selectedM)
                                .reduce((sum, e) => sum + (e.total_amount ?? 0), 0)
                                .toLocaleString(),
                            label: 'Current Month'
                        },
                        {
                            value: data
                                ?.filter(e => getYearMonth(e.created_at) === selectedM)
                                .length,
                            label: 'Number of Sales'
                        },
                        {
                            value: growthRate().toFixed(1) + '%',
                            label: 'Growth Rate'
                        }
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <Table
                    open={openDialog}
                    setDialogOpen={setOpenDialog}
                    data={data?.filter(e => getYearMonth(e.created_at) == selectedM)}
                    onTransactionClick={handleTransactionClick}
                />
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


export default TotalSalesOverTime;
