'use client'
import { ArrowLeftIcon, ArrowRightCircleIcon, ArrowRightIcon, CheckCircleIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline'
import image from '../../../public/images/icon/Vector.png'
import image2 from '../../../public/images/icon/Vector (1).png'
import React, { Suspense, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { CommingSoon } from '@/components/comingsoon/CommingSoon'
import DefaultLayout from '@/components/Layouts/DefaultLayout'

const Page = () => {
    const [page, setPage] = useState<number>(1)

    const NextBtn = () => {
        return (
            <div className='justify-end flex gap-3 '>
                <button onClick={() => setPage(page - 1)} className={`border  border-[#B9B9B9] text-[#B9B9B9] font-bold p-3 rounded-[50%] $${(page > 1) ? " " : " hidden "}`}>
                    <ArrowLeftIcon className="size-6 text-[#B9B9B9]" />
                </button>
                <button onClick={() => setPage(page + 1)} className={`bg-[#3C50E0] text-white font-bold p-3 rounded-[50%] ${(page == 5) ? " hidden " : "  "} `}>
                    <ArrowRightIcon className="size-6 text-white" />
                </button>
            </div>
        )
    }

    const Page1 = () => {
        return (
            <>
                <div className='flex  gap-10 flex-col'>
                    <div className='text-3xl grow-0 font-bold'>1. Basic Business Information</div>
                    <div className='flex gap-5 grow'>
                        <div className='grow w-full'>
                            <div className='flex flex-col gap-5'>
                                <div>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae quae veritatis quis placeat neque dolores temporibus error
                                </div>
                                <div>
                                    <div className='text-xl font-bold'>
                                        Business Name
                                    </div>
                                    <div>
                                        <input type='text' className='w-full border border-black outline-none rounded-md p-2' />
                                    </div>
                                </div>
                                <div>
                                    <div className='text-xl font-bold'>
                                        Business Contact Number
                                    </div>
                                    <div>
                                        <input type='text' className='w-full border border-black outline-none rounded-md p-2' />
                                    </div>
                                </div>
                                <div>
                                    <div className='text-xl font-bold'>
                                        Select industry do you operate in
                                    </div>
                                    <div>
                                        <div className=''>
                                            <select className='w-full border border-black outline-none rounded-md p-2'>
                                                <option>Select option</option>
                                                <option>Select option</option>
                                                <option>Select option</option>
                                                <option>Select option</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='text-xl font-bold'>
                                        Enter Your Business Location (Optional)
                                    </div>
                                    <div>
                                        <input type='text' className='w-full border border-black outline-none rounded-md p-2' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <NextBtn />
                </div>
            </>
        )
    }

    const Page2 = () => {
        const [options, setOptions] = useState<any>([])
        const [textField, setTextFiel] = useState<string>("")
        return (
            <>
                <div className='flex gap-10 flex-col'>
                    <div className='text-3xl grow-0 font-bold'>2. Set up your FAQs</div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold'>
                            Recommended Frequently Asked Questions
                        </div>
                        <div>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt eligendi enim saepe nobis quia, libero, atque inventore dignissimos
                        </div>
                    </div>
                    <div className='grow flex flex-col gap-10'>
                        {options.length > 0 ?
                            <div className='border border-black rounded-md p-4 flex flex-col gap-4 text-xl'>
                                {
                                    options?.map((e: any, key: any) =>
                                        <div key={key} className='flex justify-between'>
                                            <div>{e.textField}</div>
                                            <CheckCircleIcon className='size-6' />
                                        </div>
                                    )
                                }
                            </div>

                            :
                            <></>}
                        <div className='flex gap-5'>
                            <div className=' grow flex flex-col' >
                                <label className='font-bold'>Add a custom FAQ</label>
                                <input value={textField} onChange={(e) => setTextFiel(e.target.value)} className='p-2 grow rounded-md outline-none border border-black' />
                            </div>
                            <div className='grow-1 flex items-end'>
                                <button onClick={() => { setOptions([...options, { textField: textField }]); setTextFiel("") }} className='p-3 rounded-md  bg-[#EDF0F7]'><PlusIcon className='size-6 text-black' /></button>
                            </div>
                        </div>
                    </div>
                    <NextBtn />
                </div>
            </>
        )
    }

    const Page3 = () => {
        return (
            <>
                <div className='flex gap-10 flex-col'>
                    <div className='text-3xl font-bold'>3. AI Actions</div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold'>
                            Choose the actions you want your Chatbot AI to perform?
                        </div>
                        <div>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt eligendi enim saepe nobis quia, libero, atque inventore dignissimos
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 items-center'>
                        <div className='flex w-[600px]'>
                            <div className='border border-black rounded-l-lg grow-0'>
                                <div className='bg-[#EDF0F7] p-5 w-[200px] items-center h-[200px] flex justify-center w-full'>
                                    {/* <PhotoIcon className='size-10' /> */}
                                    <Image width={200} height={200} fill src={image} alt='something' />
                                </div>
                            </div>
                            <div className='border rounded-r-lg border-black grow flex flex-col gap-2 justify-center p-5 '>
                                <div>
                                    Import your Products from Products List
                                </div>
                                <div>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident voluptates veritatis animi rem. Labore voluptatem, nostrum maxime quae
                                </div>
                                <div className='font-bold'>
                                    Import
                                </div>
                            </div>
                        </div>
                        <div className='flex w-[600px]'>
                            <div className='border border-black rounded-l-lg grow-0'>
                                <div className='bg-[#EDF0F7] p-5 w-[200px] items-center h-[200px] flex justify-center w-full'>
                                    {/* <PhotoIcon className='size-10' /> */}
                                    <Image width={200} src={image2}  height={200} fill alt='something' />
                                </div>
                            </div>
                            <div className='border rounded-r-lg border-black grow flex flex-col gap-2 justify-center p-5 '>
                                <div>
                                    Upload Chats from WhatsApp Business
                                </div>
                                <div>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident voluptates veritatis animi rem. Labore voluptatem, nostrum maxime quae
                                </div>
                                <div className='font-bold'>
                                    Import
                                </div>
                            </div>

                        </div>
                    </div>
                    <NextBtn />
                </div>
            </>
        )
    }
    const Page4 = () => {
        return (
            <>
                <div className='flex gap-10 flex-col'>
                    <div className='text-3xl grow-0 font-bold'>4. FeedBack Configuration</div>

                    <div className='text-center'>
                        <div className='text-2xl font-bold'>
                            What kinds of Feedback would you like your Chatbot to Obtain?
                        </div>
                        <div>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt eligendi enim saepe nobis quia, libero, atque inventore dignissimos
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className='p-5 rounded-md flex flex-col gap-5 w-[800px] border border-black'>
                            <div className='flex w-full justify-between'>
                                <label className='text-xl' htmlFor="option1">
                                    Do you accept mobile money?
                                </label>
                                <input className='w-[200px]' type='checkbox' id="option1" />
                            </div>
                            <div className='flex w-full justify-between'>
                                <label className='text-xl' htmlFor="option2">
                                    Do you do deliveries within the city/town
                                </label>
                                <input className='w-[200px]' type='checkbox' id="option2" />
                            </div>
                            <div className='flex w-full justify-between'>
                                <label className='text-xl' htmlFor="option3">
                                    Do you do deliveries outside town?
                                </label>
                                <input className='w-[200px]' type='checkbox' id="option3" />
                            </div>
                            <div className='flex w-full justify-between'>
                                <label className='text-xl' htmlFor="option4">
                                    Do you still have [specific products] in stock?
                                </label>
                                <input className='w-[200px]' type='checkbox' id="option4" />
                            </div>
                        </div>
                    </div>
                    <NextBtn />
                </div>
            </>
        )
    }
    const Page5 = () => {
        return (
            <>
                <div className='flex gap-10 flex-col'>
                    <div className='text-3xl grow-0 font-bold'>5. Escalation Rules</div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold'>
                            What will the chain of contact for Consultation?
                        </div>
                        <div>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt eligendi enim saepe nobis quia, libero, atque inventore dignissimos
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <div className='p-5 rounded-md flex flex-col w-[600px] gap-10 border border-black'>
                            <div>
                                <div className='flex flex-col  gap-4'>
                                    <label className='text-xl font-bold' htmlFor="option1">
                                        Enter Name of the First Level of Escalation
                                    </label>
                                    <Input />
                                </div>
                                <div className='flex flex-col  gap-4'>
                                    <label className='text-xl font-bold' htmlFor="option1">
                                        Enter Contact Number
                                    </label>
                                    <Input />
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col  gap-4'>
                                    <label className='text-xl font-bold' htmlFor="option1">
                                        Enter Name of the Second Level of Escalation
                                    </label>
                                    <Input />
                                </div>
                                <div className='flex flex-col  gap-4'>
                                    <label className='text-xl font-bold' htmlFor="option1">
                                        Enter Contact Number
                                    </label>
                                    <Input />
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <button className='border border-[#3C50E0]  text-[#3C50E0] font-bold rounded-md px-5 py-3 flex items-center gap-3'>
                                    <PlusIcon className='size-4' />
                                    Add
                                </button>
                            </div>

                        </div>
                    </div>
                    <NextBtn />
                </div>
            </>
        )
    }


    const SwitchCases = () => {
        switch (page) {
            case 1:
                return <Page1 />
                break;
            case 2:
                return <Page2 />
                break;
            case 3:
                return <Page3 />
                break;
            case 4:
                return <Page4 />
                break;
            case 5:
                return <Page5 />
                break;
            default:
                return <><h1 className='text-3xl'>Error...</h1></>
        }
    }
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <DefaultLayout>
                    <CommingSoon />
                </DefaultLayout>
                <div className='min-h-[100vh ] hidden dark:bg-boxdark  bg-[#F3F4F6] p-10 flex justify-center w-full'>
                    <div className='w-[80%] hidden dark:bg-gray-600 dark:text-white rounded-lg overflow-hidden overflow-hidden shadow relative'>
                        <div className='bg-[#00000030]'>
                            <div className={` dark:bg-gray-500 bg-[#3C50E0] duration-300 transition-all h-[10px] ease-in-out `} style={{ width: `${page / 5 * 100}%` }}></div>
                        </div>
                        <div className='p-10'>

                            <SwitchCases />


                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    )
}


export default Page