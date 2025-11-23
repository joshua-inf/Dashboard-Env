import React from 'react';
import { CheckCircle2, PartyPopper, Download, Mail, Share2 } from 'lucide-react';

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    showConfetti?: boolean;
    details?: {
        orderNumber?: string;
        totalAmount?: number;
        paymentMethod?: string;
        timestamp?: string;
    };
}

export const SuccessDialog = ({
    isOpen,
    onClose,
    title = "Success!",
    message = "Your action was completed successfully.",
    primaryButtonText = "Continue",
    secondaryButtonText,
    onPrimaryAction,
    onSecondaryAction,
    showConfetti = true,
    details
}: SuccessDialogProps) => {
    if (!isOpen) return null;

    const handlePrimaryClick = () => {
        onPrimaryAction ? onPrimaryAction() : onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scaleIn">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {message}
                    </p>

                    {/* Success Details */}
                    {details && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 text-left">
                            <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                                {details.orderNumber && (
                                    <div className="flex justify-between">
                                        <span>Order Number:</span>
                                        <span className="font-semibold">{details.orderNumber}</span>
                                    </div>
                                )}
                                {details.totalAmount && (
                                    <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span className="font-semibold">K{details.totalAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {details.paymentMethod && (
                                    <div className="flex justify-between">
                                        <span>Payment Method:</span>
                                        <span className="font-semibold">{details.paymentMethod}</span>
                                    </div>
                                )}
                                {details.timestamp && (
                                    <div className="flex justify-between">
                                        <span>Time:</span>
                                        <span className="font-semibold">{details.timestamp}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className={`flex gap-3 p-6 border-t border-gray-200 dark:border-gray-600 ${secondaryButtonText ? 'justify-between' : 'justify-center'
                    }`}>
                    {secondaryButtonText && (
                        <button
                            onClick={onSecondaryAction}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            {secondaryButtonText}
                        </button>
                    )}

                    <button
                        onClick={handlePrimaryClick}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <PartyPopper className="w-4 h-4" />
                        {primaryButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};