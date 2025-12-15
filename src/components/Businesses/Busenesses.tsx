'use client'
import { getData } from '@/lib/createCookie'
import { getBusinessByOwnerID } from '@/services/api/apiBusiness'
import { BusinessType } from '@/types/businesses'
import React, { Suspense, useEffect, useState } from 'react'
import { Plus, Search, Filter, Building2, Users, TrendingUp, AlertCircle, PlusIcon } from 'lucide-react'
import { BusinessCard } from './component/BusinessCard'
import { CreateBusinessDiag } from './component/CreateBusinessDiag'
import { AddAbusinessToSubscription, addbusinessToSubscription, checkSub, getActiveSubscription } from '@/services/subscription/subscriptionService'
import { checkifhasbusinesses } from '@/services/businesses/Businesses'
import BusinessSelectionPopup from './component/BusinessSelectionPopup '
import { SubscriptionHistory } from '@/types/Subscription'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const userData = getData()

export const Businesses = () => {
    const [sunsubscription, setSunsubscription] = useState<SubscriptionHistory | null>(null)
    const [loading, setLoading] = useState(false)
    const [businessloading, setBusinessLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [openBusinessModal, setOpenBusinessModal] = useState(false)
    const [organisationData, setOrganisationData] = useState<BusinessType[] | null>(null)
    const [businesses, setBusinesses] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSelectionPopupOpen, setIsSelectionPopupOpen] = useState(false);
    const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);

    const userData = useSelector((state: RootState) => state.userDetails)

    const getBusinessByUserID = React.useCallback(async () => {
        setLoading(true)
        if (!userData?.id) {
            setError('User authentication required')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await getBusinessByOwnerID(userData.id)
            setOrganisationData(response)
        } catch (err) {
            setError('Failed to load businesses')
            console.error('Error fetching businesses:', err)
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])




    const checkifhasbusinessesLocal = () => {
        checkifhasbusinesses(userData.id)
            .then((res) => {
                if (res) {
                    // console.log(res)
                    setBusinesses(res.registeredBusinesses)

                    if (res.registeredBusinesses == null) {
                        setIsSelectionPopupOpen(true)
                        console.log("not true")
                    }

                    if (res.registeredBusinesses.length < 1) {
                        setIsSelectionPopupOpen(true)
                        console.log("not true")
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
            })
    }

    const handleBusinessSelect = (business: BusinessType) => {
        setSelectedBusinesses(prev => {
            const next = [...prev, business.id].filter((id): id is string => !!id);
            return next;
        });
    };


    const handleBusinessDeselect = (business: BusinessType) => {
        setSelectedBusinesses(prev => prev.filter(b => b !== business.id));
    };


    const AddBusiness = async () => {
        setBusinessLoading(true)
        let response = await AddAbusinessToSubscription(userData?.id, selectedBusinesses)
        if (response) {
            console.log("added")
            setBusinessLoading(false)
            getBusinessByUserID()
            setIsSelectionPopupOpen(false)
        } else {
            console.log("failed")
            getBusinessByUserID()
            setIsSelectionPopupOpen(false)
            setBusinessLoading(false)
        }
    }

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
                <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm animate-pulse"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
                    </div>
                </div>
            ))}
        </div>
    )

    const getSub = async () => {
        let response = await getActiveSubscription(userData.id)

        if (response) {
            setSunsubscription(response)
        }
    }


    useEffect(() => {
        getBusinessByUserID()
        getSub()
        checkifhasbusinessesLocal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="space-y-8 ">
            <BusinessSelectionPopup
                businessIds={businesses}
                subscription={sunsubscription?.registeredBusinesses || null}
                isOpen={isSelectionPopupOpen && userData.hasSubscription}
                loading={businessloading}
                onClose={() => setIsSelectionPopupOpen(false)}
                businesses={organisationData || []}
                onConfirmPress={() => AddBusiness()}
                selectedBusinesses={selectedBusinesses}
                onBusinessSelect={handleBusinessSelect}
                onBusinessDeselect={handleBusinessDeselect}
                maxSelections={3 - (sunsubscription?.registeredBusinesses.length || 0)} // Optional: limit number of selections
            />

            <CreateBusinessDiag
                isOpen={openBusinessModal}
                getBusinessByUserID={getBusinessByUserID}
                onClose={() => setOpenBusinessModal(false)}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent">
                        My Businesses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage and monitor all your business profiles
                    </p>
                </div>

                <div className="flex justify-end w-full items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {organisationData?.length || 0} businesses
                    </span>
                    <button
                        disabled={!userData.hasSubscription && !(organisationData ? organisationData?.length <= 3 : false)}
                        onClick={() => setOpenBusinessModal(true)}
                        className={`flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-xl ${!userData.hasSubscription ? 'cursor-not-allowed opacity-50' : ''} font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg `}
                    >
                        <Plus className="w-5 h-5" />
                        New Business
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="flex flex gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search businesses by name or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Filter Button */}
                    <button disabled={userData.hasSubscription} className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50">
                        <Filter className="w-5 h-5" />
                        <span className="hidden sm:block">Filter</span>
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                    <button
                        onClick={getBusinessByUserID}
                        className="ml-auto text-sm bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-700/30 px-3 py-1 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* <AddBusinessToSub subscription={sunsubscription} Businesses={businesses} setIsSelectionPopupOpen={setIsSelectionPopupOpen} /> */}


            {/* Content */}
            <div>

                {loading ?
                    <LoadingSkeleton />
                    :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {
                            organisationData?.map((business, index) => (
                                <BusinessCard
                                    key={business.id || index}
                                    getBusinessByUserID={getBusinessByUserID}
                                    data={business}
                                />
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}

const AddBusinessToSub = ({ setIsSelectionPopupOpen, subscription }: { setIsSelectionPopupOpen: (data: boolean) => void, Businesses?: string[], subscription: SubscriptionHistory | null }) => {


    if (!subscription) {
        return
    }

    if (subscription.registeredBusinesses.length >= 3) {
        return (
            <div className='bg-blue-200/20  rounded-md p-3'>
                <div className='dark:text-yellow-200 flex items-center gap-2'>
                    you have no more slots available on your subscription...
                </div>
            </div>
        )
    }

    return (
        <div className='bg-blue-200/20  rounded-md p-3'>
            <div className='dark:text-yellow-200 flex items-center gap-2'>
                you currectly have {3 - subscription.registeredBusinesses.length} slots available on your subscription... <button onClick={() => setIsSelectionPopupOpen(true)} className='flex gap-1 bg-green-400/50 p-1 rounded-md items-center '>
                    <PlusIcon size={15} />
                    add a business
                </button>
            </div>
        </div>
    )
}