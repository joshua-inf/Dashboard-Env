import CustomerGenerRatio from '@/components/Analytics/CustomerAnalytics/customer_gender_ratio/customerGenderRatio'
import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <CustomerGenerRatio />
        </Container>
      </DefaultLayout>
    </Suspense>
  )
}

export default Page