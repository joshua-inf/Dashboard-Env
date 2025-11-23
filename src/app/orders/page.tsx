import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { Orders } from '@/components/orders/Orders'
import React, { Suspense } from 'react'

const OrdersManagement = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <Orders />
        </Container>
      </DefaultLayout>
    </Suspense>
  )
}

export default OrdersManagement