'use client'
import { checkSub } from "@/services/subscription/subscriptionService"
import Cookies from "js-cookie"
import Link from "next/link"
import { useEffect, useState } from "react"
import { X, Crown } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export const ShouldShowSubscriptionWarn = () => {
    const [showWarning, setShowWarning] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const userData = useSelector((state: RootState) => state.userDetails)

    const checkSubscription = async () => {
        if (!userData?.id) return

        try {
            setIsLoading(true)
            const result = await checkSub(userData.id)
            const cookieValue = Cookies.get('showAdd')

            if (result?.hasSubscription === false && cookieValue !== 'hide') {
                setShowWarning(true)
            }
        } catch (error) {
            console.error('Error checking subscription:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDismiss = () => {
        setShowWarning(false)
        Cookies.set('showAdd', 'hide', { expires: 7 }) // Remember for 7 days
    }

    useEffect(() => {
        checkSubscription()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading || !showWarning) {
        return null
    }

    return (
        <div className="group relative w-full p-4 mb-6">
            {/* Background with gradient border */}
            <div className="absolute inset-0 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

            {/* Main content card */}
            <div className="relative bg-white dark:bg-gray-800   rounded-lg shadow-lg overflow-hidden">
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full b"></div>

                <div className="pl-5 pr-4 py-4 flex items-start gap-3">
                    {/* Icon */}
                    <div className=" mt-0.5">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                            <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className=" ">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                            Subscription Required
                            <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
                                Important
                            </span>
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                            You&apos;re currently using the free tier. Upgrade to a subscription to unlock all features and continue enjoying uninterrupted service.
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                            <Link
                                href="/subscribe"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Crown className="w-4 h-4" />
                                Upgrade Now
                            </Link>

                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 hidden p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group/close"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4 group-hover/close:scale-110 transition-transform duration-200" />
                    </button>
                </div>

                {/* Progress bar for auto-dismiss (optional) */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
                    <div className="h-full bg-blue-400 dark:bg-purple-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}