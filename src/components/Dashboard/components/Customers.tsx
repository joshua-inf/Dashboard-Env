import React from 'react'

export const Customers = ({ data }: { data: any }) => {
  return (
    <div className="relative h-full rounded-xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-900 shadow-xl p-6 flex flex-col gap-4 text-center justify-center border dark:border-gray-600 border-gray-200">
      {/* Top Icon - Optional Decorative Element */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white rounded-full p-2 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
        </svg>
      </div>

      {/* Title */}
      <div className="text-lg font-semibold text-gray-800 dark:text-white mt-2">Customers</div>

      {/* Main Value */}
      <div className="text-4xl font-extrabold text-green-700 dark:text-green-400">{data.Customers}%</div>

      {/* Subtitle */}
      <div className="flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium px-3 py-1 rounded-full">
          Daily Customers
        </div>
      </div>
    </div>

  )
}
