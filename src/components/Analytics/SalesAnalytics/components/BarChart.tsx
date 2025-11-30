import { RevenueData, SalesAnalyticsData } from '@/services/api/products';
import { ApexOptions } from 'apexcharts';
import React from 'react'
import ReactApexChart from 'react-apexcharts';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { OrderData } from '@/types/Orders';

const BarChart = ({ data }: { data: undefined | OrderData[] }) => {

    const salesData = data ?? [];

    // Define the full week
    const groupSalesByDay = (orders: OrderData[]) => {
        // Map: { "2025-11-25": totalAmount }
        const dayMap: Record<string, number> = {};

        for (const order of orders) {
            const date = new Date(order.created_at);
            const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

            if (!dayMap[dayKey]) {
                dayMap[dayKey] = 0;
            }
            dayMap[dayKey] += order.total_amount ?? 0;
        }

        return dayMap;
    };


    const dayMap = groupSalesByDay(salesData);
    // Chart labels (sorted by day)
    const labels = Object.keys(dayMap).sort();

    // Convert to array with default 0 for missing days
    const totalAmounts = labels.map(day => dayMap[day]);
    // Now use this data in the chart
    const series = [
        {
            name: 'Total Sales',
            data: totalAmounts,
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'bar' as const,
            toolbar: {
                show: false,
            },
            background: 'transparent',
        },
        colors: ['#7165A6'],
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                borderRadius: 8,
            },
        },
        xaxis: {
            categories: labels,  // All days
            labels: {
                style: {
                    colors: '#616262',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#616262',
                },
            },
        },
        theme: {
            mode: 'dark',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%",
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height={200}
        />
    );
};

export default BarChart;
