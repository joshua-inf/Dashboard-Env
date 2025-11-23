import React from 'react'
import BarChart from '../components/BarChart'
import { MapPin, Users, Globe, AlertCircle } from 'lucide-react'

export const GeographicalLocation = ({ location }: { location: any }) => {
    // Validate and process location data
    const isValidLocationData = Array.isArray(location) && location.length > 0;
    const hasValidLocations = isValidLocationData && location.some((loc: any) => 
        loc && (loc.customers > 0 || loc.count > 0 || loc.number > 0)
    );

    // Calculate total customers across all locations
    const totalCustomers = isValidLocationData ? location.reduce((total: number, loc: any) => {
        return total + (loc.customers || loc.count || loc.number || 0);
    }, 0) : 0;

    // Find the location with the most customers
    const topLocation = isValidLocationData ? location.reduce((max: any, loc: any) => {
        const currentCount = loc.customers || loc.count || loc.number || 0;
        const maxCount = max.customers || max.count || max.number || 0;
        return currentCount > maxCount ? loc : max;
    }, location[0]) : null;

    // Empty state component
    if (!hasValidLocations) {
        return (
            <div className="flex flex-col h-full">
                {/* Chart Area */}
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center min-h-[200px]">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        No Location Data
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs">
                        Customer geographical distribution will appear here once you have location data.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span>Customer locations will be mapped here</span>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-[#1A0670] dark:text-white font-medium mb-2">
                        Geographical Location of Customers
                    </div>
                    <div className="flex text-[#1A0670] dark:text-white justify-between items-end gap-2">
                        <div className="flex items-end gap-2">
                            <div className="font-bold text-2xl">0 Locations</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                No data
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total customers: 0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chart Area */}
            <div className="flex-1 mb-4">
                <BarChart location={location} />
            </div>

            {/* Stats Summary */}
            {isValidLocationData && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Locations</span>
                        </div>
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {location.length}
                        </div>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">Total</span>
                        </div>
                        <div className="text-xl font-bold text-green-700 dark:text-green-300">
                            {totalCustomers}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Title and Information */}
            <div className="mt-auto">
                <div className="text-[#1A0670] dark:text-white font-medium mb-2">
                    Geographical Location of Customers
                </div>
                <div className="flex text-[#1A0670] dark:text-white justify-between items-end gap-2">
                    <div className="flex items-end gap-2">
                        <div className="font-bold text-2xl">{location.length} Locations</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {totalCustomers} total customers
                        </div>
                    </div>
                </div>

                {/* Additional Insights */}
                {topLocation && (
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Top location:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {topLocation.location || topLocation.name || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Customers in top location:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {topLocation.customers || topLocation.count || topLocation.number}
                            </span>
                        </div>
                        {totalCustomers > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Market share:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {(((topLocation.customers || topLocation.count || topLocation.number) / totalCustomers) * 100).toFixed(1)}%
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}