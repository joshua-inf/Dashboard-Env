import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { genderType } from '@/types/Customers';
import { Users, PieChart } from 'lucide-react';

const GenderPieChart = ({ gender }: { gender: genderType }) => {
    // Validate and process gender data
    const hasValidData = gender && (
        gender.male > 0 ||
        gender.female > 0
    );

    // Prepare series and labels
    const series = [
        gender?.male || 0,
        gender?.female || 0
    ].filter(value => value > 0);

    const labels = [
        ...(gender?.male > 0 ? ['Male'] : []),
        ...(gender?.female > 0 ? ['Female'] : [])
    ];

    const totalCustomers = series.reduce((sum, value) => sum + value, 0);

    const options: ApexOptions = {
        chart: {
            type: 'donut' as const,
            background: 'transparent',
        },
        labels: labels,
        colors: ['#1A0670', '#877DFF', '#FF6B6B'], // Blue, Purple, Red for Other
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontFamily: 'inherit',
                colors: ['#ffffff']
            },
            dropShadow: {
                enabled: false
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
            labels: {
                colors: '#6B7280'
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            color: '#6B7280'
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#1A0670',
                            formatter: (val) => {
                                return val.toString();
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#6B7280',
                            fontSize: '14px',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                            }
                        }
                    }
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (value, { seriesIndex }) {
                    const percentage = totalCustomers > 0 ? ((value / totalCustomers) * 100).toFixed(1) : '0';
                    return `${value} customers (${percentage}%)`;
                }
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };

    // Empty state
    if (!hasValidData) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    <PieChart className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    No Gender Data
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    Customer gender distribution will appear here once available.
                </p>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Collect customer gender information</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={220}
            />

            {/* Additional summary */}
            <div className="text-center mt-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {totalCustomers} customer{totalCustomers !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}

export default GenderPieChart;