import { SalesAnalyticsData } from '@/services/api/products';
import { ApexOptions } from 'apexcharts';
import React from 'react'
import ReactApexChart from 'react-apexcharts';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { OrderData } from '@/types/Orders';

const BarChart = ({ data }: { data: undefined | OrderData[] }) => {

    const salesData = data ?? [];

    // Calculate sales by day (ensure all days are included)
    const salesByDayMap = salesData.reduce<Record<string, number>>((acc, sale) => {
        const day = format(parseISO(sale.created_at), 'EEEE');
        acc[day] = (acc[day] ?? 0) + sale.total_amount;
        return acc;
    }, {});

    // Define the full week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Convert to array with default 0 for missing days
    const salesByDayArray = daysOfWeek.map(day => salesByDayMap[day] ?? 0);

    // Now use this data in the chart
    const series = [
        {
            name: 'Total Sales',
            data: salesByDayArray,
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
            categories: daysOfWeek,  // All days
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
