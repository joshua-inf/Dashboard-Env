import { Customers } from '@/types/Customers';
import { ApexOptions } from 'apexcharts';
import React from 'react'
import ReactApexChart from "react-apexcharts";
import { BarChart3, Users, MapPin, AlertCircle } from 'lucide-react';

const AreaChart = ({ customers }: { customers: {location: string, number: number}[] | null }) => {
    // Validate and process customer data
    const isValidCustomerData = Array.isArray(customers) && customers.length > 0;
    const hasValidData = isValidCustomerData && customers.some(customer => 
        customer && customer.number > 0
    );

    // Prepare chart data
    const series = [
        {
            name: "Customers",
            data: hasValidData ? customers.map((customer) => customer.number || 0) : []
        },
    ];

    const categories = hasValidData ? customers.map((customer) => customer.location || 'Unknown') : [];

    // Calculate total customers for insights
    const totalCustomers = hasValidData ? customers.reduce((sum, customer) => sum + (customer.number || 0), 0) : 0;
    const maxCustomers = hasValidData ? Math.max(...customers.map(customer => customer.number || 0)) : 0;
    const topLocation = hasValidData ? customers.reduce((max, customer) => 
        (customer.number || 0) > (max.number || 0) ? customer : max
    ) : null;

    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
            background: "transparent",
            animations: {
                enabled: true,
                speed: 800,
            }
        },
        colors: ["#1A0670"],
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 6,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: "#616262",
                    fontSize: '12px',
                    fontFamily: 'inherit',
                },
                rotate: -45,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#616262",
                    fontSize: '12px',
                    fontFamily: 'inherit',
                },
                formatter: function (val: number) {
                    return val.toFixed(0);
                }
            },
            title: {
                text: "Number of Customers",
                style: {
                    color: "#616262",
                    fontSize: '12px',
                    fontFamily: 'inherit',
                }
            }
        },
        grid: {
            borderColor: "#E5E7EB",
            strokeDashArray: 4,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        tooltip: {
            theme: "light",
            y: {
                formatter: function (val: number) {
                    return `${val} customers`;
                },
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                }
            }
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "60%",
                            borderRadius: 4,
                        },
                    },
                    xaxis: {
                        labels: {
                            rotate: -45,
                        }
                    }
                },
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%",
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "70%",
                            borderRadius: 3,
                        },
                    },
                    xaxis: {
                        labels: {
                            rotate: -45,
                            style: {
                                fontSize: '10px',
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: '10px',
                            }
                        }
                    }
                },
            },
        ],
    };

    // Empty state component
    if (!hasValidData) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center h-full min-h-[250px]">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    No Location Data
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs">
                    Customer location distribution will appear here once you have geographical data.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Locations</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Customers</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Chart Header with Insights */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1A0670] dark:text-white" />
                    <span className="text-sm font-medium text-[#1A0670] dark:text-white">
                        Customer Distribution
                    </span>
                </div>
                {topLocation && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Top: {topLocation.location} ({topLocation.number})
                    </div>
                )}
            </div>

            {/* Chart */}
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={250}
                width="100%"
            />

            {/* Chart Footer Stats */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {customers.length} location{customers.length !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total: {totalCustomers} customer{totalCustomers !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Max: {maxCustomers}
                </div>
            </div>
        </div>
    );
}

export default AreaChart;