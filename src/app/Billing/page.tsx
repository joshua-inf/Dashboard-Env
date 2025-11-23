import BillingPage from '@/components/Billing/BillingPage'
import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const Page = () => {
    return (
        <DefaultLayout>
            <Container>
                <BillingPage />
            </Container>
        </DefaultLayout>
    )
}

export default Page