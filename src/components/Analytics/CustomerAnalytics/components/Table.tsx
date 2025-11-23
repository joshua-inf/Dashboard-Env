import React from 'react';
import '@/css/Table.css';
import { Customers } from '@/types/Customers';

type TableProps = {
    setDialogOpen: (val: boolean) => void;
    open: any;
    data: Customers[] | null | undefined;
    onCustomerClick?: (customer: Customers) => void;
};

export const Table: React.FC<TableProps> = ({ setDialogOpen, data, onCustomerClick }) => {
    return (
        <div className="dark:bg-gray-800 text-sm">
            <table className="w-full dark:text-gray-200">
                <thead className="bg-[#F8F9FA] shadow-md dark:bg-gray-700 text-sm dark:text-gray-200">
                    <tr>
                        <th className="text-left p-2">NAME</th>
                        <th className="text-left p-2 hidden md:table-cell">EMAIL</th>
                        <th className="text-left p-2 hidden md:table-cell">PHONE</th>
                        <th className="text-left p-2 hidden md:table-cell">LOCATION</th>
                        <th className="text-left p-2">JOINED DATE</th>
                        <th className="text-left p-2 hidden md:table-cell">GENDER</th>
                    </tr>
                </thead>
                <tbody className="dark:text-gray-300">
                    {data?.map((customer) => (
                        <tr
                            key={customer.id}
                            onClick={() => {
                                setDialogOpen(true);
                                onCustomerClick?.(customer);
                            }}
                            className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <td className="p-2">{customer.name}</td>
                            <td className="p-2 hidden md:table-cell">{customer.email}</td>
                            <td className="p-2 hidden md:table-cell">{customer.phone}</td>
                            <td className="p-2 hidden md:table-cell">{customer.location}</td>
                            <td className="p-2">{new Date(customer.created_at).toLocaleDateString()}</td>
                            <td className="p-2 hidden md:table-cell">{customer.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
