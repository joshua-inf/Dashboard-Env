import { useState, useEffect } from 'react';
import { Search, X, Check, Building2 } from 'lucide-react';
import { BusinessType } from '@/types/businesses';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { SubscriptionHistory } from '@/types/Subscription';

interface Business {
    isOpen: boolean  | undefined
    onConfirmPress: () => void
    onClose: () => void
    subscription: string[] | null
    loading: boolean
    businessIds: string[]
    businesses: BusinessType[]
    selectedBusinesses: string[]
    onBusinessSelect: (data: BusinessType) => void
    onBusinessDeselect: (data: BusinessType) => void
    maxSelections: number
}

const BusinessSelectionPopup = ({
    isOpen,
    loading,
    onClose,
    onConfirmPress,
    businesses,
    businessIds,
    subscription,
    selectedBusinesses,
    onBusinessSelect,
    onBusinessDeselect,
    maxSelections,
}: Business) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessType[]>([]);

    // Filter businesses based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredBusinesses(businesses);
        } else {
            const filtered = businesses.filter(business =>

                business.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                business.business_type?.toLowerCase().includes(searchQuery.toLowerCase())

            );
            setFilteredBusinesses(filtered);
        }
    }, [searchQuery, businesses]);

    // Reset search when popup opens/closes
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const handleBusinessToggle = (business: BusinessType) => {
        const isSelected = selectedBusinesses.some(b => b === business.id);

        if (isSelected) {
            onBusinessDeselect(business);
        } else {
            // Check if we've reached the maximum allowed selections
            if (maxSelections && selectedBusinesses.length >= maxSelections) {
                return; // Don't allow selection if max reached
            }
            onBusinessSelect(business);
        }
    };

    const isBusinessSelected = (business: BusinessType) => {
        return selectedBusinesses.some(b => b === business.id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-0 z-[9999] overflow-hidden">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent">
                                Select Businesses
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                                {maxSelections
                                    ? `Select up to ${maxSelections} businesses`
                                    : 'Select one or more businesses'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search businesses by name or type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Selected Count */}
                    {maxSelections && (
                        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200/50 dark:border-blue-800/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-700 dark:text-blue-300">
                                    {selectedBusinesses.length} of {maxSelections} selected
                                </span>
                                {selectedBusinesses.length >= maxSelections && (
                                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                                        Maximum selections reached
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Business List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {filteredBusinesses.length === 0 ? (
                            <div className="text-center py-12">
                                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchQuery ? 'No businesses match your search' : 'No businesses available'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {filteredBusinesses.filter((businessIds)=> !subscription?.includes(businessIds.id || "")).map((business) => {
                                    const isSelected = isBusinessSelected(business);
                                    const isDisabled = !isSelected && maxSelections && selectedBusinesses.length >= maxSelections;

                                    return (
                                        <div
                                            key={business.id}
                                            onClick={() => !isDisabled && handleBusinessToggle(business)}
                                            className={`p-4 rounded-xl border transition-all ${businessIds.includes(business.id || '') ? "hidden" : ""} duration-300 cursor-pointer ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20'
                                                : 'bg-gray-50/50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {business.business_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {business.business_type}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                    ? 'bg-blue-500 border-blue-500 text-white'
                                                    : 'border-gray-300 dark:border-gray-500'
                                                    }`}>
                                                    {isSelected && <Check className="w-3 h-3" />}
                                                </div>
                                            </div>

                                            {business.company_alias && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                    {business.company_alias}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedBusinesses.length} business{selectedBusinesses.length !== 1 ? 'es' : ''} selected
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={onConfirmPress}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {loading ?
                                    "loading....."
                                    :
                                    "Confirm Selection"
                                }

                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BusinessSelectionPopup;