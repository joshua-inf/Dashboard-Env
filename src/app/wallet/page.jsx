import React, { Suspense } from 'react'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WalletPage from '@/components/Wallet/wallet';
import Container from '@/components/Layouts/Container';
import PendingInvoicesRestriction from '@/components/Billing/PendingInvoicesRestriction ';

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <PendingInvoicesRestriction>
            <WalletPage />
          </PendingInvoicesRestriction>
        </Container>
      </DefaultLayout>
    </Suspense>
  );
}

export default page