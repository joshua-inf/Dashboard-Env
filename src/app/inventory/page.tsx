import Inventory from '@/components/inventory/Inventory';
import Container from '@/components/Layouts/Container';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { PlusIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { Suspense } from 'react'

const page = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DefaultLayout>
                <Container>
                    <Inventory />
                </Container>
            </DefaultLayout>
        </Suspense>
    )
}

export default page