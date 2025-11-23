import { CustomerAnalytics } from '@/components/Analytics/CustomerAnalytics/CustomerAnalytics'
import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { Suspense } from 'react'

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DefaultLayout>
                <Container>
                    <CustomerAnalytics />
                </Container>
            </DefaultLayout>
        </Suspense>
    )
}


export default Page