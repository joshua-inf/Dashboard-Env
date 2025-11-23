import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Dashboard/Dashboard";
import React, { Suspense } from "react";
import Loader from "@/components/common/Loader";
import Container from "@/components/Layouts/Container";

function Page() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DefaultLayout>
          <Suspense fallback={<div><Loader /></div>}>
            <Container>
              <Dashboard />
            </Container>
          </Suspense>
        </DefaultLayout>
      </Suspense>
    </>
  );
}

export default Page
