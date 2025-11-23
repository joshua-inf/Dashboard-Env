import React from 'react';
import { XCircle, AlertTriangle, RotateCcw, HelpCircle } from 'lucide-react';

interface FailedDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry?: () => void;
    title?: string;
    message?: string;
    errorDetails?: string;
    retryText?: string;
    closeText?: string;
    showSupport?: boolean;
}

export const FailedDialog = ({
    isOpen,
    onClose,
    onRetry,
    title = "Something went wrong",
    message = "We encountered an issue while processing your request.",
    errorDetails,
    retryText = "Try Again",
    closeText = "Close",
    showSupport = true
}: FailedDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {message}
                    </p>

                    {/* Error Details */}
                    {errorDetails && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 text-left">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                                        Error Details
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        {errorDetails}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support Message */}
                    {showSupport && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <HelpCircle className="w-4 h-4" />
                                <span>If this continues, please contact support</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        {closeText}
                    </button>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            {retryText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};