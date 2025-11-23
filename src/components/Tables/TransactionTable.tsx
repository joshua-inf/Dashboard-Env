// components/TransactionTable.tsx
import React from "react";

type Transaction = {
  id: string;
  issuedDate: string;
  total: string;
};

const transactions: Transaction[] = [
  { id: "#5089", issuedDate: "31 March 2023", total: "$1200" },
  { id: "#5089", issuedDate: "31 March 2023", total: "$1080" },
  { id: "#5089", issuedDate: "31 March 2023", total: "$190" },
  { id: "#5089", issuedDate: "31 March 2023", total: "$1200" },
  { id: "#5089", issuedDate: "31 March 2023", total: "$1200" },
  { id: "#5089", issuedDate: "31 March 2023", total: "$1200" },
];

const TransactionTable: React.FC = () => {
  return (
    <div className="mx-auto w-full rounded-2xl bg-white p-4 shadow-md dark:bg-boxdark">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium dark:text-gray-300">
          Last Transactions
        </h2>
        <a href="#" className="text-blue-500 hover:underline">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg bg-white shadow-md dark:bg-boxdark">
          <thead className="bg-gray-100 dark:bg-boxdark dark:text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-200">
                ID
              </th>
              <th className="hidden px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-200 sm:table-cell">
                ISSUED DATE
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-200">
                TOTAL
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-200">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-t border-gray-50 dark:border-gray-800"
              >
                <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                  {transaction.id}
                </td>
                <td className="hidden px-4 py-3 text-gray-700 dark:text-gray-400 sm:table-cell">
                  {transaction.issuedDate}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
                  {transaction.total}
                </td>
                <td className="cursor-pointer px-4 py-3 font-medium text-black hover:underline dark:text-gray-300">
                  View Detail
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
