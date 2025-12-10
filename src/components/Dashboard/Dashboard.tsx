"use client";
import React, { useEffect, useState } from "react";
import { OrdersCard } from "./components/OrdersCard";
import { TotalRevenue } from "./components/TotalRevenue";
import { CustomerReturn } from "./components/CustomerReturn";
import { LastTransactions } from "./components/LastTransactions";
import { SalesByCategory } from "./components/SalesByCategory";
import { RecentOrder } from "./components/RecentOrder";
import { dashboard, DashboardSummary } from "@/services/api/Dashboard";
import { getOrgData } from "@/lib/createCookie";
import { BusinessType } from "@/types/businesses";
import { Card } from "./components/Card";
import { TrendingUp, Users, ShoppingCart, BarChart3, RefreshCw, AlertCircle, FilterX, Table, Clock10Icon, LucideIcon, DollarSign, Clock1 } from "lucide-react";
import { TotalRevenueCont } from "./components/TotalRevenueCont";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const businessData: BusinessType | null = getOrgData();
  const [data, setData] = useState<DashboardSummary | null>(null);

  const GetDashData = React.useCallback(async () => {
    try {
      setError("");
      const result = await dashboard(businessData?.id);
      if (result) {
        setData(result);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [businessData?.id]);

  useEffect(() => {
    GetDashData();
  }, [GetDashData]);

  const handleRefresh = () => {
    setRefreshing(true);
    GetDashData();
  };

  const calculateTodaysRevenue = () => {
    if (!data?.OrderData?.allOrders) return "K0.00";

    const today = new Date();
    const todayDateOnly = today.toISOString().split("T")[0]; // e.g., "2025-11-02"

    const todaysRevenue = data.OrderData.allOrders
      .filter((order: any) => {
        const orderDate = new Date(order.created_at).toISOString().split("T")[0];
        return orderDate === todayDateOnly;
      })
      .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);

    return `K${todaysRevenue.toFixed(2)}`;
  };



  const Header = ({ title, Icon }: { title: string, Icon: LucideIcon }) => {
    return (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-500" />
        {title}
      </h3>
    )
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className=" backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className=" backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm h-80">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-6"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className=" backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center dark:text-white gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              title="Growth Rate"
              value={`${data?.GrowthRate || 0}%`}
              description="Annual Growth"
              icon={TrendingUp}
              trend="up"
            />

            <Card
              title="Customer Satisfaction"
              value={`${data?.Customers || 0}%`}
              description="Customer Retention"
              icon={Users}
              trend="neutral"
            />

            <Card
              title="Today's Revenue"
              value={calculateTodaysRevenue()}
              description="Daily Performance"
              icon={ShoppingCart}
              trend="up"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Orders Overview
                </h3>
                <OrdersCard data={data} />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Customer Analytics
                </h3>
                <CustomerReturn data={data} />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2">
                <Header title="Sales By Category" Icon={FilterX} />
                <SalesByCategory data={data} />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock10Icon className="w-5 h-5 text-blue-500" />
                  Recent Orders
                </h3>
                <RecentOrder data={data} />
              </div>
            </div>
          </div>

          {/* Additional Charts (Hidden on mobile) */}
          <TotalRevenueCont data={data} />
        </>
      )}
    </div>
  );
};

export default Dashboard;