'use client'
import React, { useEffect, useState } from 'react'
import { MainPage } from './MainPage'
import image5 from '@/components/Layouts/Sidebar/icons/trybae.png'
import { firstTimeVisitToken } from '@/lib/createCookie'
import Image from 'next/image'


const Page = () => {
    const [pageNumber, setPageNumber] = useState(1)

    useEffect(() => {

    }, [])

    return (
        <div className='p-4 min-h-[100vh] flex flex-col items-center bg-white dark:bg-boxdark'>
            {
                pageNumber == 7 ?
                    ""
                    :
                    <div className='flex justify-between w-full'>
                        <div className='flex items-center'>
                            <Image
                                width={30}
                                src={image5}
                                alt="Logo"
                                priority
                            />
                            <p className="font-bold">Inxource</p> 
                        </div>

                        <button onClick={() => firstTimeVisitToken()} className='py-2 px-4 border border-black dark:border-white rounded-md text-black dark:text-white'>
                            {
                                pageNumber > 1 ?
                                    "Exit"
                                    :
                                    "log-in"
                            }
                        </button>
                    </div>
            }
            <div className='grow flex flex-col p-5 max-w-[1200px]'>
                <MainPage pageNumber={pageNumber} setPageNumber={setPageNumber} />
            </div>
        </div>
    )
}

export default Page