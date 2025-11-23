import TotalSalesOverTime from '@/components/Analytics/SalesAnalytics/total_sales_over_time/TotalSalesOverTime'
import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <TotalSalesOverTime />
        </Container>
      </DefaultLayout>
    </Suspense>
  )
}

export default Page