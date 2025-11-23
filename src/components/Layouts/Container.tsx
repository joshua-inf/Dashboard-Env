'use client'
import { useEffect, useState } from "react"
import { ShouldShowSubscriptionWarn } from "../SubscriptionWall/subscriptionWarn"
import { checkuserexists } from "@/services/apiUsers"
import { getOrgData, removeData } from "@/lib/createCookie"
import { useRouter } from "next/navigation"
import MainPage from "../onboarding/MainPage"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { hasPendingPreviousBalance } from "@/services/Billing/Billing"
import { BusinessType } from "@/types/businesses"

const Container = ({ children }: { children: any }) => {
    const router = useRouter()
    const [hasPendingBalance, setHasPendingBalance] = useState<boolean>(false);
    const userData = useSelector((state: RootState) => state.userDetails)

    const businessData: BusinessType | null | undefined = getOrgData();

    useEffect(() => {
        const checkPendingBalance = async () => {
            if (!businessData?.id) return;

            try {
                const pendingBalance = await hasPendingPreviousBalance(businessData.id);
                const userExists = await checkuserexists(userData?.id)

                if (userExists) {
                    // console.log()
                } else {
                    router.push('/signin')
                    removeData()
                }

                setHasPendingBalance(pendingBalance);
            } catch (error) {
                console.error("Error checking pending balance:", error);
            }
        };

        checkPendingBalance();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MainPage />
            <div className="grid grid-cols-12 gap-4 p-4 relative">
                {/* Left Spacer: hides on small screens, appears on md+ */}
                <div className="hidden md:block md:col-span-1 lg:col-span-2"></div>

                {/* Centered Content */}
                <div className="col-span-12  w-full lg:col-span-8 md:col-span-10  mx-auto">
                    {/* Centered content goes here */}
                    {/* Alert Banner */}
                    
                    {hasPendingBalance && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        Pending Balance
                                    </h3>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                        You have unpaid invoices from previous billing periods. Please settle these to avoid service interruption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {children}
                </div>

                {/* Right Spacer: hides on small screens, appears on md+ */}
                <div className="hidden md:block md:col-span-1 lg:col-span-2 "></div>
            </div>
        </>
    )
}

export default Container