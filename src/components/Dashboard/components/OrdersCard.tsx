import React from 'react'
import { ApexOptions } from 'apexcharts';
import ReactApexChart from "react-apexcharts";
import { DashboardSummary, formatNumber } from '@/services/api/Dashboard';
import { TrendingUp, Calendar, RefreshCw, BarChart3, DollarSign, AlertCircle } from 'lucide-react';

interface OrdersCardProps {
  data: DashboardSummary | null | undefined;
  loading?: boolean;
}

export const OrdersCard = ({ data, loading = false }: OrdersCardProps) => {
  const getLast7Days = (): string[] => {
    const daysArray: string[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      daysArray.push(date.toISOString().split('T')[0]);
    }

    return daysArray;
  };

  const convertDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const getDateAmounts = (): (number | null)[] => {
    const last7Days = getLast7Days();
    const amounts: (number | null)[] = [];

    for (const day of last7Days) {
      const dayAmount = data?.OrderData?.allOrders
        ?.filter((e) => convertDate(e.created_at) === day)
        ?.reduce((prev, cur) => prev + (cur.total_amount || 0), 0) || 0;
      
      amounts.push(dayAmount > 0 ? dayAmount : null);
    }

    return amounts;
  };

  const getFormattedDates = (): string[] => {
    return getLast7Days().map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    });
  };

  const calculateTotalRevenue = (): number => {
    return getDateAmounts()
      .filter((v): v is number => v !== null)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const calculateGrowth = (): number => {
    const amounts = getDateAmounts().filter((v): v is number => v !== null);
    if (amounts.length < 2) return 0;
    
    const firstHalf = amounts.slice(0, 3).reduce((a, b) => a + b, 0);
    const secondHalf = amounts.slice(3).reduce((a, b) => a + b, 0);
    
    if (firstHalf === 0) return 0;
    return ((secondHalf - firstHalf) / firstHalf) * 100;
  };

  // Check if we have valid data
  const hasValidData = data?.OrderData?.allOrders && data.OrderData.allOrders.length > 0;
  const dateAmounts = getDateAmounts();
  const hasRevenueData = dateAmounts.some(amount => amount !== null && amount > 0);
  const totalOrders = data?.OrderData?.allOrders?.length || 0;

  const growth = calculateGrowth();
  const isPositiveGrowth = growth >= 0;
  const totalRevenue = calculateTotalRevenue();
  const avgDaily = totalRevenue / 7;

  const series = [{
    name: "Revenue",
    data: dateAmounts.map(v => v === null ? 0 : v),
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
    colors: ["#6366F1"],
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
            color: '#6366F1',
            opacity: 0.7
          },
          {
            offset: 100,
            color: '#6366F1',
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
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!hasValidData || !hasRevenueData) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-dashed border-gray-300/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 group">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Trends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                Last 7 days • <RefreshCw className="w-3 h-3" /> No data yet
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <AlertCircle className="w-4 h-4" />
            No Data
          </div>
        </div>

        {/* Empty State Content */}
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            No Revenue Data
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs">
            Revenue trends will appear here once you start processing orders and generating sales.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>Daily Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Growth Trends</span>
            </div>
          </div>
        </div>

        {/* Sample Data Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
            What you&apos;ll see here:
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <div>• Daily revenue trends over the last 7 days</div>
            <div>• Total revenue and average daily revenue</div>
            <div>• Revenue growth percentage</div>
            <div>• Order processing insights</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              Last 7 days • <RefreshCw className="w-3 h-3" /> Updated just now
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositiveGrowth 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          <TrendingUp className={`w-4 h-4 ${!isPositiveGrowth ? 'rotate-180' : ''}`} />
          {Math.abs(growth).toFixed(1)}%
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 dark:from-gray-100 dark:to-indigo-400 bg-clip-text text-transparent">
            K{formatNumber(totalRevenue.toFixed(2))}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Daily</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            K{formatNumber(avgDaily.toFixed(2))}
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Orders</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {totalOrders}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">Avg. Order</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">
            K{formatNumber((totalRevenue / totalOrders).toFixed(2))}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
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
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {totalOrders} order{totalOrders !== 1 ? 's' : ''} processed
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Revenue (K)</span>
        </div>
      </div>

      {/* Performance Insight */}
      <div className={`mt-4 p-3 rounded-lg text-center ${
        growth > 15 
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          : growth > 0
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      }`}>
        <p className="text-sm font-medium">
          {growth > 15 ? 'Strong revenue growth' : 
           growth > 0 ? 'Steady revenue performance' : 
           'Monitor revenue trends'}
        </p>
      </div>
    </div>
  );
};