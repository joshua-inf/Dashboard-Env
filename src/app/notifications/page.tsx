'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NotificationsPage from "@/components/Notifications/NotificationsPage";
import { Suspense } from "react";

const Page = () => {

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <DefaultLayout>
                    <NotificationsPage />
                </DefaultLayout>
            </Suspense>
        </>
    )
}

export default Page