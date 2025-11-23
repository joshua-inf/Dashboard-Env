import React from 'react';
import '@/css/Table.css';
import { Customers } from '@/types/Customers';
import { Sale } from '@/types/Sales';
import { OrderData } from '@/types/Orders';

type TableProps = {
    setDialogOpen: (val: boolean) => void;
    open: any;
    data: OrderData[] | null | undefined;
    onTransactionClick?: any
};

export const Table: React.FC<TableProps> = ({ setDialogOpen, data, onTransactionClick }) => {
    return (
        <div className="dark:bg-gray-800 text-sm">
            <table className="w-full dark:text-gray-200">
                <thead className="bg-[#F8F9FA] shadow-md dark:bg-gray-700 text-sm dark:text-gray-200">
                    <tr>
                        <th className="text-left p-2 hidden md:table-cell">No.</th>
                        <th className="text-left p-2 hidden md:table-cell">CUSTOMER</th>
                        <th className="text-left p-2">AMOUNT</th>
                        <th className="text-left p-2">SALE DATE</th>
                    </tr>
                </thead>
                <tbody className="dark:text-gray-300">
                    {data?.map((sale, key) => (
                        <tr
                            key={key}
                            onClick={() => {
                                setDialogOpen(true);
                                onTransactionClick(sale.customer_id, sale)

                                // console.log({"sales": sale.customer_id , "sales: ": sale})
                            }}
                            className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <td className="p-2">{key+1}</td>
                            <td className="p-2">{sale.customers.name}</td>
                            <td className="p-2">K{sale.total_amount.toFixed(2)}</td>
                            <td className="p-2">
                                {sale.created_at
                                    ? new Date(sale.created_at).toLocaleDateString()
                                    : new Date(sale.created_at).toLocaleDateString()
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};
