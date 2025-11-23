import React from 'react'

// images section
import image from '../../../public/images/Team work-bro 1.png'
import Image from 'next/image'

import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'


export const Page1 = ({setPageNumber,pageNumber}:{setPageNumber:any,pageNumber:number}) => {
    return (
        <div className='flex flex-wrap items-center justify-center'>
            <div className='grow max-w-[500px]'>
                <Image src={image.src} alt="Brand" width={48} height={48} />
            </div>
            <div className='grow flex flex-col gap-3 max-w-[500px]'>
                <div className='font-bold text-4xl md:text-left text-center text-black dark:text-white'>Sign-Up to InXource</div>
                <div className='text-lg md:text-left text-center text-gray-700 dark:text-gray-300'>
                Grow your business with inXource-your AI-powered team of virtual agents. From sales and accounting to lead generation and customer support, our smart agents handle it all, so you don&apos;t have to hire extra employees. Focus on scaling while inXource does the work for you! 
                </div>
                <div className='flex flex-col gap-3'>
                    <div>
                        <div className='text-black dark:text-white'>
                            Enter email address
                        </div>
                        <Input type='email' className='bg-white dark:bg-gray-800' />
                    </div>
                    <div>
                        <div className='text-black dark:text-white'>
                            Enter Password
                        </div>
                        <Input type='password' className='bg-white dark:bg-gray-800' />
                    </div>
                    <div>
                        <div className='text-black dark:text-white'>
                            Confirm Password
                        </div>
                        <Input type='password' className='bg-white dark:bg-gray-800' />
                    </div>
                    <div>
                        <div className='text-black dark:text-white'>
                            what Industry do you operate in?
                        </div>
                        <Input type='text' className='bg-white dark:bg-gray-800' />
                    </div>
                </div>
                <div className='flex justify-end gap-5'>
                    <button className='border border-[#1C0F86] text-[#1C0F86] dark:text-white dark:border-white py-2 px-4 rounded-[100px] flex items-center gap-2'>Cancel</button>
                    <button onClick={()=> setPageNumber(pageNumber+1)} className='bg-[#1C0F86] text-white py-2 px-4 rounded-[100px] flex items-center gap-2 hover:bg-[#2a1ba8] dark:hover:bg-[#150b66]'>
                        Proceed
                        <ArrowRightIcon className='w-[20px]' />
                    </button>
                </div>
            </div>
        </div>
    )
}
