import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const PieChart = () => {
  const series = [44, 55, 13, 30]; // Values for each region

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent',
    },
    labels: ['Lusaka', 'Copperbelt', 'Central', 'Other'],
    colors: ['#1A0670', '#877DFF', '#AEA7FF', '#D0CDFD'],
    dataLabels: {
      enabled: false,
    },
    theme: {
      mode: 'dark',
    },
    legend: {
      labels: {
        colors: '#616262',
      },
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
    <ReactApexChart
      options={options}
      series={series}
      type="pie"
      height={200}
      width="100%"
    />
  );
};

export default PieChart;
