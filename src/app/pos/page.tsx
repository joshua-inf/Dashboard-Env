import PendingInvoicesRestriction from '@/components/Billing/PendingInvoicesRestriction '
import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import POSPage from '@/components/pos/Pos'
import React, { Suspense } from 'react'

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DefaultLayout>
                <Container>
                    <>
                        <PendingInvoicesRestriction>
                            <POSPage />
                        </PendingInvoicesRestriction>
                    </>
                </Container>
            </DefaultLayout>
        </Suspense>
    )
}

export default Page