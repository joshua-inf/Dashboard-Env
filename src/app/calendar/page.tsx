import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Trybae Solutions",
  description: "Trybae Admin Dashboard",
};

const CalendarPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DefaultLayout>
          <Calendar />
        </DefaultLayout>

      </Suspense>
    </>
  );
};

export default CalendarPage;
