import React from 'react'
import { ApexOptions } from 'apexcharts';
import ReactApexChart from "react-apexcharts";
import { DashboardSummary, formatNumber } from '@/services/api/Dashboard';
import { TrendingUp, DollarSign, Calendar, RefreshCw, ArrowUpRight, BarChart3, AlertCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface TotalRevenueProps {
  data: DashboardSummary | null | undefined;
  loading?: boolean;
  range: string
}

export const TotalRevenue = ({ data, loading = false, range }: TotalRevenueProps) => {
  const getDateRange = (range: string): string[] => {
    const dates: string[] = [];
    const today = new Date();

    if (range === "7_days") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    else if (range === "30_days") {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    else if (range === "12_months") {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        // Format as YYYY-MM (for monthly grouping)
        const yearMonth = date.toISOString().split("T")[0].slice(0, 7);
        dates.push(yearMonth);
      }
    }

    return dates;
  };


  const convertDate = (dateString: string, range: string = "7_days") => {
  try {
    // Normalize the date (handles both "2025-11-12 03:08:03" and ISO formats)
    const date = new Date(dateString.replace(" ", "T"));

    if (range === "12_months") {
      // Return YYYY-MM (for monthly grouping)
      return date.toISOString().split("T")[0].slice(0, 7);
    } else if (range === "year") {
      // Return only year (YYYY)
      return date.getFullYear().toString();
    } else {
      // Default: YYYY-MM-DD (for 7-day or 30-day views)
      return date.toISOString().split("T")[0];
    }
  } catch {
    const now = new Date();
    if (range === "12_months") return now.toISOString().split("T")[0].slice(0, 7);
    if (range === "year") return now.getFullYear().toString();
    return now.toISOString().split("T")[0];
  }
};


  const getRevenueData = (): number[] => {
    const last7Days = getDateRange(range);
    const amounts: number[] = [];

    for (const day of last7Days) {
      const dayRevenue =
        data?.allSales
          ?.filter((sale) => convertDate(sale.created_at, range) == day)
          ?.reduce((prev, cur) => prev + (cur.total_amount || 0), 0) || 0;

      amounts.push(dayRevenue);
    }

    // console.log('Revenue Amounts:', amounts);
    return amounts;
  };


  const getFormattedDates = (): string[] => {
    return getDateRange(range).map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    });
  };

  const calculateGrowth = (): number => {
    const revenueData = getRevenueData().filter((v): v is number => v !== null);
    if (revenueData.length < 2) return 0;

    const firstHalf = revenueData.slice(0, 3).reduce((a, b) => a + b, 0);
    const secondHalf = revenueData.slice(3).reduce((a, b) => a + b, 0);

    if (firstHalf === 0) return secondHalf > 0 ? 100 : 0;
    return ((secondHalf - firstHalf) / firstHalf) * 100;
  };


  // Check if we have valid data
  const revenueData = getRevenueData();
  const totalTransactions = data?.allSales?.length || 0;

  const growth = calculateGrowth();
  const isPositiveGrowth = growth >= 0;

  const series = [{
    name: "Revenue",
    data: revenueData.map(v => v === null ? 0 : v),
  }];

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#6B7280',
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        speed: 800,
      }
    },
    colors: ["#8B5CF6"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: 'round'
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#8B5CF6',
            opacity: 0.7
          },
          {
            offset: 100,
            color: '#8B5CF6',
            opacity: 0.1
          }
        ]
      },
    },
    xaxis: {
      categories: getFormattedDates(),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#6B7280',
          fontFamily: 'inherit',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontFamily: 'inherit',
          fontSize: '12px'
        },
        formatter: (value) => `K${formatNumber(value)}`
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontFamily: 'inherit'
      },
      y: {
        formatter: (value) => `K${formatNumber(value)}`
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: { height: 200 },
        xaxis: { labels: { rotate: -45 } }
      }
    }]
  };

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  // if (!hasValidData || !hasRevenueData) {
  //   return (
  //     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-dashed border-gray-300/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 group">
  //       {/* Header */}
  //       <div className="flex items-center justify-between mb-6">
  //         <div className="flex items-center gap-3">
  //           <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg">
  //             <DollarSign className="w-5 h-5 text-white" />
  //           </div>
  //           <div>
  //             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
  //               Revenue Analytics
  //             </h3>
  //             <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
  //               Last 7 days • <RefreshCw className="w-3 h-3" /> No data yet
  //             </p>
  //           </div>
  //         </div>

  //         <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
  //           <AlertCircle className="w-4 h-4" />
  //           No Data
  //         </div>
  //       </div>

  //       {/* Empty State Content */}
  //       <div className="flex flex-col items-center justify-center py-8 text-center">
  //         <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
  //           <BarChart3 className="w-8 h-8 text-gray-400" />
  //         </div>
  //         <h4 className="font-medium text-gray-900 dark:text-white mb-2">
  //           No Revenue Data
  //         </h4>
  //         <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
  //           Revenue analytics will appear here once you start making sales and generating revenue.
  //         </p>

  //         {/* Sample Metrics Preview */}
  //         <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
  //           <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
  //             <DollarSign className="w-4 h-4 text-purple-500 mx-auto mb-1" />
  //             <div className="text-xs text-purple-600 dark:text-purple-400">Total Revenue</div>
  //             <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">K0.00</div>
  //           </div>
  //           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
  //             <TrendingUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
  //             <div className="text-xs text-blue-600 dark:text-blue-400">Daily Avg</div>
  //             <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">K0.00</div>
  //           </div>
  //         </div>

  //         <div className="flex items-center gap-4 text-xs text-gray-400">
  //           <div className="flex items-center gap-1">
  //             <Calendar className="w-3 h-3" />
  //             <span>Daily Trends</span>
  //           </div>
  //           <div className="flex items-center gap-1">
  //             <TrendingUp className="w-3 h-3" />
  //             <span>Growth Analysis</span>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Action Suggestions */}
  //       <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
  //         <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
  //           Start generating revenue:
  //         </div>
  //         <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
  //           <div className="flex items-center gap-2">
  //             <DollarSign className="w-3 h-3" />
  //             <span>Process your first sale</span>
  //           </div>
  //           <div className="flex items-center gap-2">
  //             <BarChart3 className="w-3 h-3" />
  //             <span>Track revenue performance</span>
  //           </div>
  //           <div className="flex items-center gap-2">
  //             <TrendingUp className="w-3 h-3" />
  //             <span>Monitor growth trends</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              Last 7 days • <RefreshCw className="w-3 h-3" /> Real-time tracking
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isPositiveGrowth
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {isPositiveGrowth ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(growth).toFixed(1)}%
        </div>
      </div>

      {/* Chart */}
      <div className="relative mb-4">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={250}
        />

        {/* Chart Overlay Gradient */}
        <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-t from-white/50 dark:from-gray-800/50 to-transparent" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''} processed
        </p>
        <Link href="/sales-analytics/total_sales_over_time" className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
          View details
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};