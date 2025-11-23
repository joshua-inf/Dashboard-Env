"use client";
import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer,  updateCustomer} from "@/services/apiCustomers";
import Swal from 'sweetalert2';
import { Customers } from "@/types/Customers";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const CustomerTable = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const data = await getCustomers();
    if (data) 
      {
        setCustomers(data)
        //  console.log(data)
        };
    setLoading(false);
  };

  const showDeleteConfirmation = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
         await deleteCustomer(id)
            .then((data: any)=> {
              fetchCustomers()
            });
      } else {
        console.log('Deletion canceled');
      }
    });
  };

  useEffect(() => {
      fetchCustomers();
  }, []);

  return (
      <div className="rounded-xl bg-white px-5 pb-2.5 pt-20 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
              <p className="text-center dark:text-white text-gray-500">Loading customers...</p>
          ) : customers.length === 0 ? (
              <p className="text-center text-gray-500">No customers found.</p>
          ) : (
              <table className="w-full table-auto">
                <thead>
                <tr className="border-b text-left dark:bg-meta-4">
                  <th className="min-w-[120px] px-4 py-1 font-medium text-gray-500 dark:text-white xl:pl-11">
                    NAME
                  </th>
                  <th className="hidden min-w-[100px] px-4 py-1 font-medium text-gray-500 dark:text-white sm:table-cell">
                    PHONE NUMBER
                  </th>
                  <th className="hidden min-w-[80px] px-4 py-1 font-medium text-gray-500 dark:text-white md:table-cell">
                    CREATED
                  </th>
                  <th className="px-4 py-1 font-medium text-gray-500 dark:text-white">
                    ACTION
                  </th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer, index) => (
                    <tr key={index}>
                      <td className="flex items-center space-x-2 border-b border-[#eee] px-4 py-2 pl-9 dark:border-strokedark xl:pl-11">
                        <Image
                            src={"/images/user/user-01.png"}
                            width={35}
                            height={35}
                            alt="profile"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                        />
                        <div>
                          <h5 className="font-semibold text-black dark:text-white">
                            {customer.name}
                          </h5>
                          <p className="text-sm font-medium text-gray-400">
                            {customer.email}
                          </p>
                        </div>
                      </td>
                      <td className="hidden border-b border-[#eee] px-4 py-2 dark:border-strokedark sm:table-cell">
                        <p className="font-medium text-gray-700 dark:text-white">
                          {customer.phone}
                        </p>
                      </td>
                      <td className="hidden border-b border-[#eee] px-4 py-2 dark:border-strokedark md:table-cell">
                        <p className="text-md inline-flex bg-opacity-10 px-3 py-1 font-medium text-gray-700 dark:text-white">
                          {customer.created_at}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark">
                        <div className="flex items-center space-x-2 sm:space-x-3.5">
                          <button className="hover:text-primary">
                            <EyeIcon className="size-5" />
                          </button>
                          <button className="hover:text-primary">
                            <PencilIcon className="size-5" />
                          </button>
                          <button onClick={() => showDeleteConfirmation(customer.id)} className="hover:text-primary">
                            <TrashIcon className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
};

export default CustomerTable;
