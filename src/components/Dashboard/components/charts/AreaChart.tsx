import { DashboardSummary } from '@/services/api/Dashboard';
import { ApexOptions } from 'apexcharts';
import React from 'react'
import ReactApexChart from "react-apexcharts";

const AreaChart = ({data}:{data:DashboardSummary| null | undefined}) => {

    const getDate =(data1:string) => {
        const data = new Date(data1)

        return data.getDate()
    }
    const series = [
        {
            name: "amount", // Dataset name
            data: data?.OrderData.allOrders.map((e: any) => e.total_amount) ?? [], // Ensure data is always an array
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "area" as const,
            toolbar: {
                show: false, // ✅ Hides the options (menu) icon
            },
            background: 'transparent',
            foreColor: '#AEB7C0', // Text color for dark mode
        },
        colors: ["#3C50E0"], // Primary color from theme
        dataLabels: {
            enabled: false, // Hide labels on the chart
        },
        stroke: {
            curve: "smooth", // Smooth line
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        xaxis: {
            categories: data?.OrderData.allOrders.map((e:any)=> getDate(e.created_at)), // X-axis labels
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
                    colors: '#AEB7C0', // Text color for dark mode
                }
            }
        },
        grid: {
            borderColor: '#2E3A47', // strokedark from theme
            strokeDashArray: 7,
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    return (
        <>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                />
        </>
    )
}

export default AreaChart