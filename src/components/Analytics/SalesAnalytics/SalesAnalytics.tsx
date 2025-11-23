"use client";
import { ShuffleIcon, BarChart3, TrendingUp, PieChart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopProducts } from "./customcomponents/TopProducts";
import { getDataforsalseAnalytics, SalesAnalyticsData } from "@/services/api/products";
import { BusinessType } from "@/types/businesses";
import { getOrgData } from "@/lib/createCookie";
import { SalesRevenueByRegion } from "./customcomponents/SalesRevenueByRegion";
import { PeakSalePeriod } from "./customcomponents/PeakSalePeriod";
import AreaChart from "./components/AreaChart";
import { useCallback } from "react";
import { BestSeller } from "./customcomponents/BestSeller";

// Loading skeleton reused for multiple sections
const LoadingSkeleton = () => (
  <div className='h-24 grow bg-gray-700 animate-pulse min-h-[200px] rounded-lg'></div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
      <BarChart3 className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      No Sales Data Available
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
      Start making sales to see detailed analytics and insights about your business performance.
      Your sales data will appear here once you have transactions.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <TrendingUp className="w-8 h-8 text-blue-500 mb-2 mx-auto" />
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Sales Trends</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your revenue growth over time</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <PieChart className="w-8 h-8 text-green-500 mb-2 mx-auto" />
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Product Performance</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">See which products are selling best</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <BarChart3 className="w-8 h-8 text-purple-500 mb-2 mx-auto" />
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Regional Insights</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Understand your sales by location</p>
      </div>
    </div>
  </div>
);

const SalesAnalytics: React.FC = () => {
  const navigation = useRouter();
  const businessData: BusinessType | null = getOrgData();
  const [data, setData] = useState<null | SalesAnalyticsData>(null);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProductsPageData = async () => {
    if (!businessData?.id) {
      setError("Missing business ID. Cannot fetch data.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res: any = await getDataforsalseAnalytics(businessData.id);
      setData(res);-
      console.log('successfully requested data')
    } catch (errr) {
      console.log(errr);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductsPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if data is empty or has no meaningful content
  const hasData = data && (
    (data.sales && data.sales.length > 0) ||
    (data.products && data.products.length > 0)
  );

  return (
    <div className="flex flex-col gap-5 p-4 py-20 justify-center">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sales Analytics
        </h1>
        {hasData && (
          <button
            onClick={() => navigation.push('sales-analytics/total_sales_over_time')}
            className="px-4 py-2 rounded-full bg-[#1A0670] dark:bg-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
          >
            View Detailed Data
          </button>
        )}
      </div>


      {Loading ? (
        // Loading state
        <div className="flex flex-col gap-3 grow items-center rounded-md dark:bg-gray-800">
          <div className="w-full font-bold dark:text-gray-200">
            Sales analysis by Product/Services
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 flex-wrap">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
          <div className="w-full">
            <LoadingSkeleton />
          </div>
        </div>
      ) : hasData ? (
        // Data exists state
        <div className="flex flex-col gap-3 grow items-center rounded-md dark:bg-gray-800">
          <div className="w-full font-bold dark:text-gray-200">
            Sales analysis by Product/Services
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 flex-wrap">
            <TopProducts data={data} />
            <SalesRevenueByRegion data={data} />
            <BestSeller/>
          </div>
          <div className="flex w-full gap-4 flex-wrap">
            <PeakSalePeriod data={data} />
          </div>
        </div>
      ) : (
        // Empty state
        <EmptyState />
      )}

      {/* AI Insights Section - Only show when there's data */}
      {hasData && (
        <div className="border text-[#616262] dark:text-gray-400 grow border-[#C9C9C9] dark:border-gray-700 p-3 rounded-md dark:bg-gray-800">
          <div className="font-bold text-black dark:text-white flex items-center justify-between">
            AI Insights
            <button>
              <ShuffleIcon className="size-4" />
            </button>
          </div>
          <div>
            {!data || (data.sales?.length ?? 0) < 10
              ? "Not enough transactions to recognize significant patterns. Perform more transactions to enable in-depth data analysis."
              : "Here are AI-generated insights based on your sales data!"}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAnalytics;