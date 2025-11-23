import { PhotoIcon } from '@heroicons/react/24/outline'
import React from 'react'

export const Page6 = ({ setPageNumber, pageNumber }: { setPageNumber: any, pageNumber: number }) => {
    return (
        <div className=''>
            <div className='flex flex-col gap-10'>
                <div>
                    <div className='text-4xl font-bold text-black dark:text-white'>
                        Would you like to link your Social
                        Media accounts?
                    </div>
                    <div className='text-black dark:text-white'>
                    Customers may want to learn more about your business when interacting with inXource customer care. Help Inxource provide them with accurate information by linking your social media accounts.
                    </div>
                </div>
                <div className='flex flex-wrap gap-5 justify-start'>
                    <button className='grow border border-black dark:border-white rounded-lg'>
                        <div className='flex'>
                            <div className='px-6 flex items-center bg-[#EDF0F7] dark:bg-meta-4'>
                                <PhotoIcon className='w-[40px] text-black dark:text-white' />
                            </div>
                            <div className='py-10 px-3 flex flex-col gap-1'>
                                <div className='text-[#717D96] dark:text-white'>Facebook</div>
                            </div>
                        </div>
                    </button>
                    <button className='grow border border-black dark:border-white rounded-lg'>
                        <div className='flex border border-black dark:border-white rounded-lg'>
                            <div className='px-6 flex items-center bg-[#EDF0F7] dark:bg-meta-4'>
                                <PhotoIcon className='w-[40px] text-black dark:text-white' />
                            </div>
                            <div className='py-10 px-3 flex flex-col gap-1'>
                                <div className='text-[#717D96] dark:text-white'>WhatsApp Business</div>
                            </div>
                        </div>
                    </button>
                    <button className='grow border border-black dark:border-white rounded-lg'>
                        <div className='flex border border-black dark:border-white rounded-lg'>
                            <div className='px-6 flex items-center bg-[#EDF0F7] dark:bg-meta-4'>
                                <PhotoIcon className='w-[40px] text-black dark:text-white' />
                            </div>
                            <div className='py-10 px-3 flex flex-col gap-1'>
                                <div className='text-[#717D96] dark:text-white'>Instagram</div>
                            </div>
                        </div>
                    </button>
                    <button className='grow border border-black dark:border-white rounded-lg'>
                        <div className='flex border border-black dark:border-white rounded-lg'>
                            <div className='px-6 flex items-center bg-[#EDF0F7] dark:bg-meta-4'>
                                <PhotoIcon className='w-[40px] text-black dark:text-white' />
                            </div>
                            <div className='py-10 px-3 flex flex-col gap-1'>
                                <div className='text-[#717D96] dark:text-white'>Twitter (X)</div>
                            </div>
                        </div>
                    </button>
                </div>
                <div className='py-3 justify-end flex gap-5'>
                    <button onClick={() => setPageNumber(pageNumber + 1)} className='border border-[#2D3648] dark:border-white rounded-[100px] py-2 px-4 text-[#2D3648] dark:text-white'>Skip</button>
                </div>
            </div>
        </div>
    )
}
