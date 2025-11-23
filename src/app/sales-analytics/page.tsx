import SalesAnalytics from "@/components/Analytics/SalesAnalytics/SalesAnalytics";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Loader from "@/components/common/Loader";
import Container from "@/components/Layouts/Container";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <Suspense fallback={<div><Loader /></div>}>
            <SalesAnalytics />
          </Suspense>
        </Container>
      </DefaultLayout>
    </Suspense>
  );
};

export default page;
