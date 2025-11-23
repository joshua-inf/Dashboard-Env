import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import { Businesses } from "@/components/Businesses/Busenesses";
import Container from "@/components/Layouts/Container";

function Home() {
  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DefaultLayout>
          <>
            <Container>
              <Businesses />
            </Container>
          </>
        </DefaultLayout>
      </Suspense>
    </>
  );
}

export default Home