import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MoreVertical, Building2, ArrowRight, Edit, Trash2, Image as ImageIcon, Eye } from 'lucide-react'
import { getData, getOrgData, storeOrgData } from '@/lib/createCookie'
import { BusinessType } from '@/types/businesses'
import { useRouter } from 'next/navigation'
import { DeleteDiag } from './DeleteDiag'
import { EditDiag } from './EditDiag'
import { getProductImages, isBusinessOnActiveSubscription } from '@/services/api/apiBusiness'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface BusinessCardProps {
    data: BusinessType
    getBusinessByUserID: () => void
}

export const BusinessCard = ({ data, getBusinessByUserID }: BusinessCardProps) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imageLoading, setImageLoading] = useState(true)
    const [hasSubscription, setHasSubscription] = useState(false)
    const navigation = useRouter()
    const userData = useSelector((state:RootState)=> state.userDetails)

    const storeDataToCookies = (businessData: BusinessType) => {
        storeOrgData(businessData)
        navigation.push('/overview')
    }

    const getImages = async () => {
        try {
            setImageLoading(true)
            const res = await getProductImages(data?.id, data.imageName)
            if (res && res.length > 0) {
                setImageUrl(res)
            }
        } catch (err) {
            console.error('Error loading business image:', err)
        } finally {
            setImageLoading(false)
        }
    }

    const checksubdetails = () => {
        isBusinessOnActiveSubscription(data?.id, userData?.id )
            .then((res) => {
                if (res) {
                    setHasSubscription(res)
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {

            })
    }

    useEffect(() => {
        getImages()
        // checksubdetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getIndustryColor = (industry: string | undefined) => {
        const colors = {
            'technology': 'from-blue-500 to-cyan-500',
            'retail': 'from-purple-500 to-pink-500',
            'food': 'from-orange-500 to-red-500',
            'healthcare': 'from-green-500 to-emerald-500',
            'finance': 'from-indigo-500 to-purple-500',
            'education': 'from-yellow-500 to-orange-500',
            'default': 'from-gray-500 to-gray-600'
        }
        return colors[industry?.toLowerCase() as keyof typeof colors] || colors.default
    }

    return (
        <>
            <DeleteDiag
                getBusinessByUserID={getBusinessByUserID}
                data={data}
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
            />

            <EditDiag
                getBusinessByUserID={getBusinessByUserID}
                productImage={imageUrl}
                data={data}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />

            <div className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]  relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm  overflow-hidden`}>
                {/* Header with Dropdown */}
                <div className="p-4 pb-3">
                    <div className="flex items-start justify-between">
                        {/* Business Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Business Avatar */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${getIndustryColor(data.industry)} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                {imageUrl && !imageLoading ? (
                                    <div
                                        className="w-full h-full bg-cover bg-center rounded-xl"
                                        style={{ backgroundImage: `url(${imageUrl})` }}
                                    />
                                ) : (
                                    <Building2 className="w-6 h-6 text-white" />
                                )}
                            </div>

                            {/* Business Details */}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                                    {data.business_name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {data.company_alias}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium capitalize">
                                        {data.industry || 'Business'}
                                    </span>
                                    {data.status === 'active' && (
                                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-2 min-w-[140px] z-50"
                            >
                                <DropdownMenuItem
                                    disabled={!hasSubscription}
                                    onClick={() => setIsEditOpen(true)}
                                    className="flex items-center gap-2 p-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

                                <DropdownMenuItem
                                    disabled={!hasSubscription}
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="flex items-center gap-2 p-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="px-4 pb-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-gray-600 dark:text-gray-400">Type</div>
                            <div className="font-medium text-gray-900 dark:text-white capitalize">
                                {data.types?.replace('_', ' ') || 'N/A'}
                            </div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-gray-600 dark:text-gray-400">Status</div>
                            <div className={`font-medium ${data.is_active
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                {data.is_active ? 'active' : 'Inactive'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with CTA */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                        onClick={() => storeDataToCookies(data)}
                        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group/button"
                    >
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Dashboard
                        </span>
                        <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </>
    )
}