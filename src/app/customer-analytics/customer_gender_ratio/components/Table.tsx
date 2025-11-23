import React from 'react'
import '@/css/Table.css'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
export const Table = ({open}: {open:any}) => {

    let data = [
        {
            Customer_Name: 'Jack Griffin',
            Product_Services: 'Web Hosting',
            Transaction_ID: 'TXN123456',
            Issued_Date: '30 Jan 2024',
            Total: '$200',
        },
        {
            Customer_Name: 'Emily Carter',
            Product_Services: 'Graphic Design',
            Transaction_ID: 'TXN123457',
            Issued_Date: '05 Feb 2024',
            Total: '$350',
        },
        {
            Customer_Name: 'Michael Smith',
            Product_Services: 'SEO Optimization',
            Transaction_ID: 'TXN123458',
            Issued_Date: '12 Feb 2024',
            Total: '$150',
        },
        {
            Customer_Name: 'Sophia Johnson',
            Product_Services: 'Digital Marketing',
            Transaction_ID: 'TXN123459',
            Issued_Date: '20 Feb 2024',
            Total: '$500',
        },
        {
            Customer_Name: 'David Brown',
            Product_Services: 'Software Development',
            Transaction_ID: 'TXN123460',
            Issued_Date: '25 Feb 2024',
            Total: '$800',
        },
        {
            Customer_Name: 'Olivia Wilson',
            Product_Services: 'Cloud Hosting',
            Transaction_ID: 'TXN123461',
            Issued_Date: '28 Feb 2024',
            Total: '$300',
        },
        {
            Customer_Name: 'James Anderson',
            Product_Services: 'IT Consultation',
            Transaction_ID: 'TXN123462',
            Issued_Date: '01 Mar 2024',
            Total: '$600',
        },
        {
            Customer_Name: 'Emma Martinez',
            Product_Services: 'Social Media Management',
            Transaction_ID: 'TXN123463',
            Issued_Date: '05 Mar 2024',
            Total: '$450',
        },
        {
            Customer_Name: 'Liam Thomas',
            Product_Services: 'Web Development',
            Transaction_ID: 'TXN123464',
            Issued_Date: '10 Mar 2024',
            Total: '$700',
        },
        {
            Customer_Name: 'Ava White',
            Product_Services: 'Cybersecurity Audit',
            Transaction_ID: 'TXN123465',
            Issued_Date: '15 Mar 2024',
            Total: '$900',
        },
    ];
    
    return (
        <div className=''>
            <table >
                <thead className='bg-[#F8F9FA] shadow-md dark:bg-gray-400 dark:text-gray-600'>
                    <tr>
                        <th>CUSTOMER NAME</th>
                        <th>PRODUCT/SERVICES</th>
                        <th>TRANSACTION ID</th>
                        <th>ISSUED DATE</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {data.map(e => {
                        return (
                            <>
                                <tr onClick={()=> open(true)} className='cursor-pointer hover:bg-gray-300'>
                                    <td>{e.Customer_Name}</td>
                                    <td>{e.Product_Services}</td>
                                    <td>{e.Transaction_ID}</td>
                                    <td>{e.Issued_Date}</td>
                                    <td>{e.Total}</td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

}
