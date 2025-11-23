import React from 'react'

interface ToggleWalletProps {
    confirmActivation: () => void;
    cancelActivation: () => void;
    hasWallet?: boolean;
    settingWallet?: boolean;
}

export const ToggleWallte = ({ cancelActivation, hasWallet, settingWallet, confirmActivation }: ToggleWalletProps) => {
    if (!hasWallet) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Activate Wallet
                        </h3>
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to activate your wallet? This will enable all wallet features including withdrawals and payments.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={cancelActivation}
                            disabled={settingWallet} // disable while loading
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            onClick={confirmActivation}
                            disabled={settingWallet} // disable while loading
                        >
                            {settingWallet && (
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            {settingWallet ? "Activating..." : "Activate Wallet"}
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Deactivate Wallet
                        </h3>
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to deactivate your wallet? This will disable all wallet features including withdrawals and payments.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={cancelActivation}
                            disabled={settingWallet} // disable while loading
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                            onClick={confirmActivation}
                            disabled={settingWallet} // disable while loading
                        >
                            {settingWallet && (
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            {settingWallet ? "Deactivating..." : "Deactivate Wallet"}
                        </button>
                    </div>

                </div>
            </div>
        )
    }
}
