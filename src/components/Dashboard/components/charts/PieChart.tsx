import React from 'react'
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Users, TrendingUp, Venus, Mars, Equal } from 'lucide-react';

interface SalesByCategoryProps {
  data: any;
  loading?: boolean;
}

interface GenderData {
  Salesbyfemale?: number;
  Salesbymale?: number;
  [key: string]: number | undefined;
}

export const SalesByCategory = ({ data, loading = false }: SalesByCategoryProps) => {
  const genderData: GenderData = data?.GenderSales || {};
  
  const totalSales = (genderData.Salesbyfemale || 0) + (genderData.Salesbymale || 0);
  const femalePercentage = totalSales > 0 ? ((genderData.Salesbyfemale || 0) / totalSales) * 100 : 0;
  const malePercentage = totalSales > 0 ? ((genderData.Salesbymale || 0) / totalSales) * 100 : 0;
  
  const getDominantGender = () => {
    if (femalePercentage > malePercentage) return { gender: 'female', percentage: femalePercentage };
    if (malePercentage > femalePercentage) return { gender: 'male', percentage: malePercentage };
    return { gender: 'equal', percentage: femalePercentage };
  };

  const dominantGender = getDominantGender();

  const series = [genderData.Salesbyfemale || 0, genderData.Salesbymale || 0];
  
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      foreColor: '#6B7280',
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        // easing: 'easeinout',
        speed: 800,
      }
    },
    labels: ['Women', 'Men'],
    colors: ['#EC4899', '#3B82F6'],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        fontWeight: '600'
      },
      dropShadow: {
        enabled: false
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontFamily: 'inherit',
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'inherit',
              color: '#6B7280'
            },
            value: {
              show: true,
              fontSize: '20px',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              color: '#111827',
              formatter: function (val) {
                return `${parseFloat(val).toFixed(0)}%`;
              }
            },
            total: {
              show: true,
              label: 'Total',
              color: '#6B7280',
              fontFamily: 'inherit',
              formatter: function (w) {
                return `${totalSales.toLocaleString()}`;
              }
            }
          }
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['transparent']
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (value, { seriesIndex }) {
          const percentage = seriesIndex === 0 ? femalePercentage : malePercentage;
          return `${value.toLocaleString()} (${percentage.toFixed(1)}%)`;
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="flex justify-center gap-6">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales by Gender
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customer distribution analysis
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          dominantGender.gender === 'female' 
            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
            : dominantGender.gender === 'male'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {dominantGender.gender === 'female' ? (
            <Venus className="w-4 h-4" />
          ) : dominantGender.gender === 'male' ? (
            <Mars className="w-4 h-4" />
          ) : (
            <Equal className="w-4 h-4" />
          )}
          {dominantGender.percentage.toFixed(1)}%
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative mb-6">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={300}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Venus className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Women</span>
          </div>
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {femalePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-pink-600 dark:text-pink-400 opacity-75">
            {((genderData.Salesbyfemale || 0) / 1000).toFixed(1)}K sales
          </div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Mars className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Men</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {malePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 opacity-75">
            {((genderData.Salesbymale || 0) / 1000).toFixed(1)}K sales
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {dominantGender.gender === 'female' ? (
            <>Women lead sales by <strong>{femalePercentage.toFixed(1)}%</strong></>
          ) : dominantGender.gender === 'male' ? (
            <>Men lead sales by <strong>{malePercentage.toFixed(1)}%</strong></>
          ) : (
            <>Sales are evenly distributed between genders</>
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total: {totalSales.toLocaleString()} sales
        </p>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Gender split</span>
        </div>
      </div>
    </div>
  );
};

// Standalone PieChart component (if still needed separately)
export const PieChart = ({ data }: { data: any }) => {
  const genderData = data?.GenderSales || {};
  const series = [genderData.Salesbyfemale || 0, genderData.Salesbymale || 0];
  
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: ['Women', 'Men'],
    colors: ['#EC4899', '#3B82F6'],
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    }
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={200}
    />
  );
};

export default PieChart;