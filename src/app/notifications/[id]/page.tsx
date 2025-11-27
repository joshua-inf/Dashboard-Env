import DefaultLayout from '@/components/Layouts/DefaultLayout'
import NotificationDetailPage from '@/components/Notifications/NotificationDetailPage'
import React from 'react'

const Page = () => {
    return (
        <div>
            <DefaultLayout>
                <NotificationDetailPage />
            </DefaultLayout>
        </div>
    )
}

export default Page