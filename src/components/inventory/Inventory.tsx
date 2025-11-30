'use client'
import { PlusIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from 'react'
import AddProductModal from './components/Dialog';
import { inventoryData, InventoryResponse, InventoryResponses } from "@/types/inventoryTypes";
import { getInventory } from "@/services/api/apiinventory";
import { getCookie, getOrgData } from "@/lib/createCookie";


const Inventory = () => {
    const [data, setData] = useState<InventoryResponses[]>([]);
    const [filter, setFilter] = useState('')
    const [titleFilter, setTitleFilter] = useState('')
    const [loading, setLoading] = useState(false)

    const businessData = getOrgData() // Assuming this function returns the business data

    const CheckStock = ({ orders, stock }: { orders: number, stock: number }) => {
        const [status, setStatus] = useState('loading')

        useEffect(() => {
            if (stock > orders) {
                if (stock > 10) {
                    setStatus('In Stock')
                } else {
                    setStatus('Low Stock')
                }
            } else {
                setStatus('no Stock')
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
            <span
                className={`px-2 py-1 text-xs rounded-full ${status === "In Stock"
                    ? "bg-green-100 text-green-700"
                    : status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
            >
                {status}
            </span>
        )

    }

    const getInventoryData = () => {
        getInventory(businessData?.id)
            .then((res: any) => {
                setData(res.allInventory)
                console.log("data", res.allInventory)
            })
            .catch((err) => {
                console.log(err)
            }
            )
            .finally(() => [
                setLoading(false)
            ])
    }

    useEffect(() => {
        setLoading(true)
        getInventoryData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className=" space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <ArchiveBoxIcon className="h-7 w-7 text-blue-600" />
                    Inventory
                </h1>
                <AddProductModal data={data} getInventoryData={getInventoryData} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500">Total Products</h2>
                    <p className="text-2xl dark:text-white font-bold">{data.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500">Low Stock</h2>
                    <p className="text-2xl font-bold text-yellow-500">
                        {data.map((e, i) => {
                            const stockQty = Math.max(e.quantity, 0);
                            const orderQty = e.sales;
                            const remaining = Math.max(stockQty - orderQty, 0);

                            return remaining;
                        }).filter((e) => e <= 100).length
                        }
                    </p>

                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500">Out of Stock</h2>
                    <p className="text-2xl font-bold text-red-500">
                        {data.map((e, i) => {
                            const stockQty = Math.max(e.quantity, 0);
                            const orderQty = e.sales;
                            const remaining = Math.max(stockQty - orderQty, 0);

                            return remaining;
                        }).filter((e) => e <= 0).length
                        }
                    </p>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-4">
                <div className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-xl shadow w-full md:w-1/3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        onChange={(e) => setTitleFilter(e.target.value)}
                        placeholder="Search products..."
                        className="ml-2 w-full bg-transparent outline-none text-sm"
                    />
                </div>
                <select onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 text-center rounded-xl border bg-white dark:bg-gray-800 dark:text-gray-200 shadow">
                    <option value="">-- Select Category --</option>
                    {Array.from(new Set(data.map(e => e.category))).map((category, key) => (
                        <option key={key} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Inventory Table */}
            <div className="bg-white overflow-x-auto bg-black max-w-[90vw] p-3 scroll-smooth  dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
                <table className="text-left border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold">Product</th>
                            <th className="p-3 text-sm font-semibold">Category</th>
                            <th className="p-3 text-sm font-semibold">Stock</th>
                            <th className="p-3 text-sm font-semibold">Price</th>
                            <th className="p-3 text-sm font-semibold">Status</th>
                            {/* <th className="p-3 text-sm font-semibold">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                <>
                                    <tr>
                                        <td colSpan={5} className="text-center font-bold">
                                            <div className="flex justify-center items-center py-5">
                                                <div className="size-4 border-4 border-white border-dashed rounded-full animate-spin"></div>
                                            </div>
                                            {/* No data available */}
                                        </td>
                                    </tr>
                                </>
                                :
                                <>
                                    {data
                                        ?.filter((e) => filter == '' ? e : e.category == filter)
                                        .filter((e) => titleFilter == '' ? e : e.name.includes(titleFilter))
                                        .map((item, idx) => (
                                            <tr key={idx} className="border-t dark:text-white whitespace-nowrap dark:border-gray-700">
                                                <td className="p-3 ">{item.name}</td>
                                                <td className="p-3">{item.category}</td>
                                                <td className="p-3">{Math.max(
                                                    item.quantity -
                                                    item.sales,
                                                    0
                                                )}</td>
                                                <td className="p-3">${item.price}</td>
                                                <td className="p-3 whitespace-nowrap">
                                                    <CheckStock stock={item.quantity} orders={item.sales} />
                                                </td>
                                                {/* <td className="p-3">
                                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
                                    <button className="text-red-600 hover:underline text-sm ml-3">Delete</button>
                                </td> */}
                                            </tr>
                                        ))}
                                </>
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Inventory