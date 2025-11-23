import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { ProductsAndServices } from '@/components/ProductsAndServices/ProductsAndServices'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <ProductsAndServices />
        </Container>
      </DefaultLayout>
    </Suspense>
  )
}

export default Page