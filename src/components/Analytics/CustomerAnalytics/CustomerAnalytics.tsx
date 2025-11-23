"use client";
import React, { useEffect, useState } from 'react'
import { CrownIcon, ShuffleIcon, Users, MapPin, TrendingUp, PieChart } from "lucide-react";
import AreaChart from "./components/AreaChart";
import BarChart from "./components/BarChart";
import { useRouter } from "next/navigation";
import GenderPieChart from './components/GenderChart';
import LatestChart from './components/DemoLatest';
import { getCustomersForBusiness, getCuststomerSales } from '@/services/apiCustomers';
import { Customers, genderType, LocationType } from '@/types/Customers';
import { getData, getOrgData } from '@/lib/createCookie';
import { ApiDatatype } from '@/services/token';
import TopCustomers from './AnalyticsComponents/TopCustomers';
import TopArea from './AnalyticsComponents/TopArea';
import { NewvsRepeat } from './AnalyticsComponents/NewvsRepeat';
import { GeographicalLocation } from './AnalyticsComponents/GeographicalLocation';
import { businessesType, BusinessType } from '@/types/businesses';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className='h-24 grow bg-gray-700 animate-pulse min-h-[200px] rounded-lg'></div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
      No Customer Data Available
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
      Start building your customer base to unlock detailed analytics and insights.
      Customer data will appear here once you have active customers and transactions.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-6">
      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <Users className="w-8 h-8 text-blue-500 mb-2 mx-auto" />
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Customer Insights</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Understand your customer demographics</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <MapPin className="w-8 h-8 text-green-500 mb-2 mx-auto" />
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Location Analytics</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">See where your customers are located</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <TrendingUp className="w-8 h-8 text-purple-500 mb-2 mx-auto" />
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Retention Rates</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track customer loyalty and engagement</p>
      </div>
    </div>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
    >
      Refresh Data
    </button>
  </div>
);

export const CustomerAnalytics = () => {
  const navigation = useRouter()
  const [customerData, setCustomerData] = useState<Customers | null>(null)
  const [LocationData, setLocationData] = useState<{ location: string, number: number }[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<LocationType[] | null>(null)
  const [gender, setGender] = useState<genderType | null>(null)
  const [numberOfNewRepeat, setNumberOfNewRepeat] = useState<number | null>(null)
  const [amountMade, setAmountMade] = useState<number | null>(null)
  const [customerRetention, setCustomerRetention] = useState<number | null>(null)
  const userData: ApiDatatype = getData()
  const business: BusinessType | null = getOrgData()

  const getCustomers = React.useCallback(() => {
    setLoading(true)
    getCuststomerSales(business?.id)
      .then((res) => {
        console.log(res)
        setCustomerData(res.customer)
        setLocation(res.location)
        console.log(res.location)
        setNumberOfNewRepeat(res.customerNumber)
        setGender(res.gender)
        setAmountMade(res.amountInLastSevenDays)
        setCustomerRetention(res.totalReturnRatio)
        setLocationData(res.customerLocationRatio)
      })
      .catch((er) => {
        console.log(er)
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [business?.id])

  useEffect(() => {
    getCustomers()
  }, [getCustomers])

  // Check if we have meaningful data to display
  const hasData = customerData ||
    (gender && (gender.male > 0 || gender.female > 0)) ||
    (numberOfNewRepeat && numberOfNewRepeat > 0) ||
    (location && location.length > 0) ||
    (customerRetention && customerRetention > 0);

  return (
    <div className="flex flex-col text-sm dark:text-white gap-5 py-20 justify-center">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Analytics
        </h1>
        {hasData && (
          <button
            onClick={() => navigation.push('customer-analytics/customer_gender_ratio')}
            className="px-4 py-2 rounded-full bg-[#1A0670] dark:bg-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
          >
            View Data
          </button>
        )}
      </div>

      {loading ? (
        // Loading State
        <div className="flex flex-col gap-3 grow items-center rounded-md dark:border-strokedark">
          <div className="w-full font-bold">Revenue & Spending</div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full flex-wrap">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        </div>
      ) : hasData ? (
        // Data Available State
        <>
          <div className="flex flex-col gap-3 grow items-center rounded-md dark:border-strokedark">
            <div className="w-full font-bold">Revenue & Spending</div>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full flex-wrap">
              {/* Top Customers */}
              <div className="border flex flex-col justify-between grow border-[#C9C9C9] dark:border-strokedark p-3 rounded-md">
                {customerData ? (
                  <TopCustomers cutomerDatas={customerData} amountInLastSevenDays={amountMade} />
                ) : (
                  <LoadingSkeleton />
                )}
              </div>

              {/* Gender Ratio */}
              {gender ? (
                <div className="border grow border-[#C9C9C9]  flex flex-col dark:border-strokedark p-3 rounded-md">
                  <div className="grow w-full flex flex-col items-center ">
                    <div className="max-w-[300px] ">
                      <GenderPieChart gender={gender} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[#1A0670] dark:text-white">Customer Gender Ratio</div>
                    <div className="flex text-[#1A0670] dark:text-white justify-between items-end gap-2">
                      <div className="flex items-end gap-2">
                        <div className="font-bold text-2xl">K{amountMade?.toFixed(2)}</div>
                        <div className="text-sm font-light">last 7 days</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <LoadingSkeleton />
              )}

              {/* New vs Repeat */}
              {numberOfNewRepeat ? (
                <NewvsRepeat data={numberOfNewRepeat} />
              ) : (
                <LoadingSkeleton />
              )}
            </div>
          </div>

          {/* Customer Demographics */}
          <div className="border flex flex-col gap-3 grow p-5 items-center rounded-md dark:border-strokedark">
            <div className="w-full font-bold">Customer Demographics</div>
            <div className="flex w-full gap-4 flex-wrap">
              {!loading ? (
                <div className="border grow border-[#C9C9C9] dark:border-strokedark p-3 rounded-md">
                  <GeographicalLocation location={location} />
                </div>
              ) : (
                <div className="w-full">
                  <LoadingSkeleton />
                </div>
              )}
            </div>
          </div>

          {/* Customer Behavior and Engagement */}
          <div className="border flex flex-col gap-3 grow p-5 items-center rounded-md dark:border-strokedark ">
            <div className="w-full font-bold text-lg text-gray-900 dark:text-white">
              Customer Behavior and Engagement
            </div>
            <div className="flex w-full gap-4 flex-wrap">
              <div className="grow border border-gray-200 dark:border-strokedark p-4 rounded-lg ">
                {customerRetention !== null && customerRetention !== undefined && customerRetention > 0 ? (
                  <>
                    <div className="grow">
                      <AreaChart customers={LocationData} />
                    </div>
                    <div className="mt-4">
                      <div className="text-[#1A0670] dark:text-white font-semibold text-lg mb-2">
                        Customer Retention Rates
                      </div>
                      <div className="flex text-[#1A0670] dark:text-white justify-between items-end gap-2">
                        <div className="flex items-end gap-3">
                          <div className="font-bold text-3xl">{customerRetention.toFixed(2)}%</div>
                          <div className="flex flex-col">
                            <div className="text-sm font-light">Retention Rate</div>
                            <div className={`flex items-center gap-1 text-xs ${customerRetention >= 70 ? 'text-green-600 dark:text-green-400' :
                              customerRetention >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                              {customerRetention >= 70 ? 'Excellent' :
                                customerRetention >= 50 ? 'Good' :
                                  'Needs Improvement'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Based on {LocationData?.length || 0} locations
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Last 30 days
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      No Engagement Data
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-md">
                      Customer behavior and retention analytics will appear here once you have sufficient customer interaction data.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Retention Rates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Engagement Metrics</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Engagement Metrics - Only show when data exists */}
              {customerRetention !== null && customerRetention !== undefined && customerRetention > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Repeat Customer Rate */}
                  <div className="border border-gray-200 dark:border-strokedark p-4 rounded-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-semibold text-gray-900 dark:text-white">Repeat Purchases</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(customerRetention * 0.8).toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Customers with multiple purchases
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="border text-[#616262] dark:text-bodydark grow border-[#C9C9C9] dark:border-strokedark p-3 rounded-md">
            <div className="font-bold text-black dark:text-white flex items-center justify-between">
              AI Insights
              <button>
                <ShuffleIcon className="size-4" />
              </button>
            </div>
            <div>
              Not enough transactions to recognize significant patterns. Perform more transactions to enable in-depth data analysis.
              {/* {
                ? "Not enough customer data to recognize significant patterns. Build your customer base to enable in-depth analysis."
                : "Here are AI-generated insights based on your customer data!"} */}
            </div>
          </div>
        </>
      ) : (
        // Empty State
        <EmptyState />
      )}
    </div>
  )
}