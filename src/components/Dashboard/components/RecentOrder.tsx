import React from 'react'
import { DashboardSummary } from '@/services/api/Dashboard'
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, ShoppingBag, Users, PlusCircle, BarChart3 } from 'lucide-react'
import Link from 'next/link';

interface RecentOrderProps {
  data: DashboardSummary | null | undefined;
  loading?: boolean;
}

interface OrderStatusConfig {
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export const RecentOrder = ({ data, loading = false }: RecentOrderProps) => {
  const recentOrders = data?.OrderData?.allOrders?.slice(0, 6) || [];

  // Check if we have valid data
  const hasValidData = recentOrders.length > 0;

  const getStatusConfig = (status: string): OrderStatusConfig => {
    const baseConfig = {
      completed: {
        color: 'green',
        icon: <CheckCircle className="w-3 h-3" />,
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400'
      },
      pending: {
        color: 'yellow',
        icon: <Clock className="w-3 h-3" />,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-400'
      },
      cancelled: {
        color: 'red',
        icon: <XCircle className="w-3 h-3" />,
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-400'
      },
      processing: {
        color: 'blue',
        icon: <AlertCircle className="w-3 h-3" />,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-400'
      }
    };

    return baseConfig[status as keyof typeof baseConfig] || baseConfig.pending;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate order statistics for insights
  const getOrderStats = () => {
    const totalAmount = recentOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const statusCounts = recentOrders.reduce((acc, order) => {
      acc[order.order_status] = (acc[order.order_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAmount,
      statusCounts,
      averageOrder: recentOrders.length > 0 ? totalAmount / recentOrders.length : 0
    };
  };

  const orderStats = getOrderStats();

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Header Skeleton */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        
        {/* Table Skeleton */}
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasValidData) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-dashed border-gray-300/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 group">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h3>
            </div>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
              No orders
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Orders will appear here once customers start purchasing
          </p>
        </div>

        {/* Enhanced Empty State */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              No Orders Yet
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
              Start accepting orders to see customer transactions, order status, and revenue insights here.
            </p>
            
            {/* Quick Stats Preview */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-xs text-blue-600 dark:text-blue-400">Customers</div>
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">0</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">0</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Pending Orders</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                <span>Revenue Tracking</span>
              </div>
            </div>
          </div>

          {/* Action Suggestions */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
              Get started:
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-3 h-3" />
                <span>Set up your products and services</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>Share your store with customers</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3 h-3" />
                <span>Start accepting orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
          </div>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
            {recentOrders.length} order{recentOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Latest customer transactions and order status
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              Total: <strong className="text-gray-900 dark:text-white">K{orderStats.totalAmount.toFixed(2)}</strong>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Avg: <strong className="text-gray-900 dark:text-white">K{orderStats.averageOrder.toFixed(2)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {Object.entries(orderStats.statusCounts).map(([status, count]) => {
              const config = getStatusConfig(status);
              return (
                <span key={status} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.textColor}`}>
                  {config.icon}
                  {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {recentOrders.map((order, index) => {
          const statusConfig = getStatusConfig(order.order_status);
          
          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group/item"
            >
              {/* Customer Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(order.customers?.name || 'Customer')}
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    statusConfig.color === 'green' ? 'bg-green-400' :
                    statusConfig.color === 'yellow' ? 'bg-yellow-400' :
                    statusConfig.color === 'red' ? 'bg-red-400' : 'bg-blue-400'
                  }`} />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {order.customers?.name || 'Unknown Customer'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mx-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                  {statusConfig.icon}
                  {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                </span>
              </div>

              {/* Amount */}
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-gray-900 dark:text-white">
                  K{order.total_amount?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  #{order.id?.slice(-4) || index + 1}
                </p>
              </div>

              {/* Hover Action */}
              <button className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/50 dark:hover:bg-gray-600/50 rounded">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Showing {recentOrders.length} most recent orders</span>
          <Link href="/orders"  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
            View all orders
            <Eye className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};