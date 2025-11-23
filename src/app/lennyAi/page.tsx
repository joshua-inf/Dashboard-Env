'use client'
import ChatCard from "@/components/Chat/ChatCard"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Suspense } from "react";

const TryCat = () => {

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <DefaultLayout>
                    <ChatCard />
                </DefaultLayout>
            </Suspense>
        </>
    )
}

export default TryCat