"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChartOne from "@/components/Charts/ChartOne";
import ChartTwo from "@/components/Charts/ChartTwo";
import dynamic from "next/dynamic";
import { Props as ApexChartProps } from "react-apexcharts";
import React from "react";

const ReactApexChart = dynamic<ApexChartProps>(() => import("react-apexcharts").then((mod) => mod.default), {
  ssr: false,
});


const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ReactApexChart />
      </div>
    </>
  );
};

export default Chart;
