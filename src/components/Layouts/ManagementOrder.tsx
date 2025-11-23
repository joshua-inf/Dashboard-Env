'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'


function ManagementOrder({ children } : {children:any}) {
    const pathname = usePathname()
    let TopBarItems = [
        {
            name: 'Pending',
            url: '/orderManagement/pending'
        },
        {
            name: 'Confirmed',
            url: '/orderManagement/confirmed'
        },
        {
            name: 'Processing',
            url: '/orderManagement/processing'
        },
        {
            name: 'Picked',
            url: '/orderManagement/picked'
        },
        {
            name: 'Shipped',
            url: '/orderManagement/shipped'
        },
        {
            name: 'Delivery',
            url: '/orderManagement/delivery'
        },
        {
            name: 'Cancelled',
            url: '/orderManagement/cancelled'
        }
    ]
    return (
        <>
            <div className=' '>
                <div className='flex bg-gray-100 dark:bg-boxdark flex-col pb-2 gap-2' style={{position:'sticky', top:60}} >
                    <div className='flex  shadow-md'>
                        {TopBarItems.map((e, key) =>
                            <Link key={key} className={`${pathname == e.url ? 'text-primary border-b border-primary' : ''} px-6 pt-6`} href={e.url}>
                                {e.name}
                            </Link>
                        )}
                    </div>
                    <div className='flex  px-3 justify-between'>
                        <div className='flex shadow-md items-center dark:bg-gray-600 p-2 rounded-md bg-gray-200'>
                            <input className='grow-0 bg-gray-200 dark:bg-gray-600' placeholder='search' style={{ outline: 'none' }} />
                            <MagnifyingGlassIcon className="size-5  font-bold text-gray-700 dark:text-gray-300" />
                        </div>
                        <div className='flex items-center p-2 shadow-md rounded-md gap-2 bg-gray-200 dark:bg-gray-600'>
                            Filter by date range:
                            <select style={{ outline: 'none' }} className=' bg-gray-200 dark:bg-gray-600'>
                                <option></option>
                                <option>other optio</option>
                                <option>other optio</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div >
                    <div className=' p-3'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManagementOrder