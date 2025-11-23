import React from 'react'

export const Page5 = ({ setPageNumber, pageNumber }: { setPageNumber: any, pageNumber: number }) => {
    return (
        <div className=''>
            <div className='flex flex-col gap-10'>
                <div>
                    <div className='text-4xl font-bold text-black dark:text-white'>
                        How will Customers pay you?
                    </div>
                    <div className='text-black dark:text-white'>
                    Help Inxource understand your business better by selecting the payment methods you accept.
                    </div>
                </div>
                <div className='flex justify-center'>
                    <div className='border min-w-[500px] p-5 border-[#B9B9B9] dark:border-strokedark text-[#6B7280] dark:text-white rounded-lg'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex w-full justify-between'>
                                <label className='' htmlFor="option1">
                                    Cash
                                </label>
                                <input className='w-[100px]' type='checkbox' id="option1" />
                            </div>
                            <div className='flex w-full justify-between'>
                                <label className='' htmlFor="Mobile Money">
                                    Mobile Money
                                </label>
                                <input className='w-[100px]' type='checkbox' id="Mobile Money" />
                            </div>
                            <div className='flex w-full justify-between'>
                                <label className='' htmlFor="Visa/Master Card">
                                    Visa/Master Card
                                </label>
                                <input className='w-[100px]' type='checkbox' id="Visa/Master Card" />
                            </div>
                            <div className='flex w-full justify-between'>
                                <label className='' htmlFor="Direct Bank Transfer">
                                    Direct Bank Transfer
                                </label>
                                <input className='w-[100px]' type='checkbox' id="Direct Bank Transfer" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-3 justify-end flex gap-5'>
                    <button onClick={() => setPageNumber(pageNumber + 1)} className='border border-[#2D3648] dark:border-white rounded-[100px] py-2 px-4 text-[#2D3648] dark:text-white'>Confirm</button>
                </div>
            </div>
        </div>
    )
}
