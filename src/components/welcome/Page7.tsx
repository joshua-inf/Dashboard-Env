import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import image from '../../../public/images/InXource.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const Page7 = () => {
    const router = useRouter()
    return (
        <div className='flex items-center  items-center grow justify-center'>
            <div className='flex flex-col justify-center '>
                <div className='flex flex-col'>
                    <div className='m-0 p-0'>
                    </div>
                    <span className='text-black dark:text-white'>Welcome to</span> <br />
                    <span className='font-bold text-7xl text-black dark:text-white'>
                        InXource
                    </span>
                </div>
                <div className='py-3 justify-center flex '>
                    <button onClick={() => router.push('/')} className='border border-[#2D3648] dark:border-white rounded-[100px] py-2 px-4 text-[#2D3648] dark:text-white flex items-center'>Proceed <ArrowRightIcon className='w-[15px]' /></button>
                </div>
            </div>
        </div>
    )
}
