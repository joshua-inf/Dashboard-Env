import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { SalesAnalyticsData } from '@/services/api/products';

const PieChart = ({ data }: { data: null | SalesAnalyticsData }) => {
  const series = data?.revenueData.map((e) => e.scrappedSales) ?? [] ;  // Values for the pie slices
  const options: ApexOptions = {
    chart: {
      type: 'donut' as const,  // The type of chart we want (pie chart in this case)
      background: 'transparent'
    },
    labels: data?.revenueData.map((e) => e.locations) ?? [],
  
    colors: ['#1A0670', '#877DFF', '#AEA7FF', '#D0CDFD'],  // Labels for each slice
    dataLabels: {
      enabled: false, // Hides the numbers inside the chart
    },
    theme: {
      mode: 'dark'
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
  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={200}
        width="100%"
      />
    </>
  )
}

export default PieChart