import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

export const Page3 = ({ setPageNumber, pageNumber }: { setPageNumber: any, pageNumber: number }) => {
    return (
        <div className='flex flex-wrap items-center grow items-center justify-center'>
            <div className='flex flex-col gap-8'>
                <div>
                    <div className='font-bold flex justify-center text-4xl text-center'><CheckCircleIcon className='w-[100px]  text-[#5E53F0BF]' /></div>
                    <div className='text-lg font-bold text-center text-black dark:text-white'>
                        Congratulations, <br />
                        Your payment was successful.
                    </div>
                </div>
                <div className='text-center text-sm text-black dark:text-white'>
                    Welcome to InXource,<br />
                    Let&#39;s get started
                </div>
                <div className='flex justify-center'>
                    <button onClick={()=> setPageNumber(pageNumber+1)} className='flex gap-2 items-center bg-gradient-to-r from-[#1C0F86] to-[#5E53F0BF] py-3 px-5 rounded-[100px] text-white hover:bg-opacity-90'>
                        Proceed to onboarding <ArrowRightIcon className='w-[20px]' />
                    </button>
                </div>
            </div>
        </div>
    )
}
