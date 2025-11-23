import CustomersTable from "@/components/Customers/CustomersTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <CustomersTable />
      </DefaultLayout>
    </Suspense>
  );
};

export default page;
