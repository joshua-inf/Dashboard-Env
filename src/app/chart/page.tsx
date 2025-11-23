import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Trybae Solutions",
  description: "Trybae Admin Dashboard",
};

const BasicChartPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Chart />
      </DefaultLayout>
    </Suspense>
  );
};

export default BasicChartPage;
