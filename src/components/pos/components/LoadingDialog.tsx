import React from 'react';
import { Loader2, Clock } from 'lucide-react';

interface LoadingDialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    showProgress?: boolean;
    progress?: number;
}

export const LoadingDialog = ({
    isOpen,
    title = "Processing",
    message = "Please wait while we process your request...",
    showProgress = false,
    progress = 0
}: LoadingDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
                {/* Animated Spinner */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {message}
                </p>

                {/* Progress Bar (Optional) */}
                {showProgress && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>0%</span>
                            <span>{progress}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                )}

                {/* Loading Dots Animation */}
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
};