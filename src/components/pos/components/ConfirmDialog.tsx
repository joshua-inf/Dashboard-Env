import React, { useState } from 'react';
import {
    AlertTriangle,
    X,
    Info,
    HelpCircle,
    AlertCircle,
    CheckCircle2,
    Search,
    User,
    UserPlus,
    CreditCard,
    Zap
} from 'lucide-react';
import { createNormalUser, getCustomerbyPhoneandBusiness } from '@/services/apiCustomers';
import { getOrgData } from '@/lib/createCookie';
import { Customers } from '@/types/Customers';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


interface StepByStepTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    setPayableUSerData: (data: Partial<Customers>) => void;
    onComplete: () => void;
    variant?: 'warning' | 'danger' | 'info' | 'success';
    isLoading?: boolean;
}

export const StepByStepTransaction = ({
    isOpen,
    onClose,
    onComplete,
    setPayableUSerData,
    variant = 'info',
    isLoading = false
}: StepByStepTransactionProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedOption, setSelectedOption] = useState<'admin' | 'current' | 'customer' | null>(null);
    const [userAccount, setUserAccount] = useState<Partial<Customers> | null>(null);
    const [searchPhone, setSearchPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const businessData = getOrgData()
    const userData = useSelector((state: RootState) => state.userDetails)

    if (!isOpen) return null;
    const zambianTowns = [
        "Lusaka", "Ndola", "Kitwe", "Livingstone", "Chipata", "Chingola", "Mansa",
        "Kabwe", "Kasama", "Solwezi", "Mongu", "Mazabuka", "Kafue", "Luanshya",
        "Kalulushi", "Kapiri Mposhi", "Choma", "Siavonga", "Mpika", "Petauke",
        "Katete", "Isoka", "Nakonde", "Mumbwa", "Serenje", "Samfya", "Monze",
        "Lundazi", "Chililabombwe", "Namwala", "Zimba", "Mbala", "Chadiza", "Kaoma",
        "Itezhi-Tezhi", "Maamba", "Senanga", "Chavuma", "Nchelenge", "Kawambwa",
        "Kalabo", "Mpongwe", "Lukulu", "Chama", "Nyimba", "Mwense", "Chilubi",
        "Milenge", "Chembe", "Mwinilunga", "Nakambala", "Kalengwa", "Kasumbalesa",
        "Mufulira", "Shangombo", "Mutanda"
    ];

    const variantStyles = {
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            button: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        },
        danger: {
            icon: AlertCircle,
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            button: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        },
        info: {
            icon: Info,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
        },
        success: {
            icon: CheckCircle2,
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            button: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        }
    };

    const { icon: Icon, iconBg, iconColor, button } = variantStyles[variant];

    // Mock function to search for user
    const searchUser = async (phoneNumber: string) => {
        setIsSearching(true);
        // Simulate API call

        try {
            let responsefromCustomerTable = await getCustomerbyPhoneandBusiness(phoneNumber, businessData.id)

            console.log(responsefromCustomerTable)
            if (responsefromCustomerTable) {
                setUserExists(true);
                setPayableUSerData(responsefromCustomerTable)
                setUserAccount(responsefromCustomerTable);

            } else {
                // Initialize new user with phone number
                setUserExists(false)
                setUserAccount({ ...userAccount, phone: searchPhone });
            }
        } catch (error) {
            console.error("Error searching user:", error);
            // Optionally, show a toast or message here
            setUserExists(false);
        } finally {
            // Always turn off the loading spinner
            setIsSearching(false);
        }
    };

    const handleStep1Continue = () => {
        if (selectedOption) {
            if (selectedOption === 'current') {
                // Skip to payment step for admin/current user
                setPayableUSerData(userData)
                setCurrentStep(3);
            } else {
                setCurrentStep(2);
            }
        }
    };

    const handleStep2Continue = async () => {
        if (userAccount && userAccount.name) {

            // add businessID

            if (!userExists) {
                setUserAccount({ ...userAccount, business_id: businessData.id })
                let response = await createNormalUser(userAccount)
                if (response) {

                    setUserAccount(response)
                }
            }

            setCurrentStep(3);

        }
    };

    const handleComplete = () => {
        resetForm();
        onComplete();
    };

    const resetForm = () => {
        setCurrentStep(1);
        setSelectedOption(null);
        setUserAccount(null);
        setSearchPhone('');
        setUserExists(null);
        setPaymentAmount('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Quick Checkout
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Choose how you&apos;d like to proceed
                </p>
            </div>

            <div className="grid gap-3">
                <button
                    onClick={() => setSelectedOption('current')}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${selectedOption === 'current'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">Quick Purchase</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Checkout without creating account</div>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setSelectedOption('customer')}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${selectedOption === 'customer'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">Create Customer Account</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Save details for future purchases</div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {userExists ? 'Customer Found' : 'Create Customer Account'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {userExists
                        ? 'We found an existing customer with this phone number'
                        : 'Please enter customer details to continue'
                    }
                </p>
            </div>

            {/* Phone Search */}
            <div className="space-y-4">
                {/* Search Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="tel"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={() => searchUser(searchPhone)}
                            disabled={!searchPhone || isSearching}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSearching ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Search
                        </button>
                    </div>
                </div>

                {/* User Details Form */}
                {userAccount && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={userAccount.name}
                                onChange={(e) =>
                                    setUserAccount({ ...userAccount, name: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={userAccount.email}
                                onChange={(e) =>
                                    setUserAccount({ ...userAccount, email: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* New Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Gender
                                </label>
                                <select
                                    value={userAccount.gender || ""}
                                    onChange={(e) =>
                                        setUserAccount({ ...userAccount, gender: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    id="location"
                                    name="location"
                                    value={userAccount.location}
                                    onChange={(e) => setUserAccount({ ...userAccount, location: e.target.value })}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {zambianTowns.map((town, index) => (
                                        <option key={index} value={town}>{town}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Payment Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Review the payment information before proceeding.
                </p>
            </div>

            {/* Transaction Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Transaction Summary</h4>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
                        <span className="text-gray-900 dark:text-white capitalize">{selectedOption}</span>
                    </div>

                    {selectedOption === "customer" && userAccount && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                                <span className="text-gray-900 dark:text-white">{userAccount.name}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                <span className="text-gray-900 dark:text-white">{userAccount.phone}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Caution Notice */}
            <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-lg p-4">
                <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                </svg>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Note:</strong> Once confirmed, this order will be <strong>saved immediately</strong> and cannot be undone.
                </p>
            </div>
        </div>

    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Select Account';
            case 2:
                return 'Customer Details';
            case 3:
                return 'Payment';
            default:
                return '';
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return selectedOption !== null;
            case 2:
                return userAccount && userAccount.name && userAccount.phone && userAccount.location && userAccount.email;
            case 3:
                return true
            default:
                return false;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {getStepTitle()}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-2 h-2 rounded-full transition-all duration-200 ${step === currentStep
                                            ? 'bg-blue-500'
                                            : step < currentStep
                                                ? 'bg-green-500'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderStepContent()}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-600">
                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (currentStep === 3) {
                                handleComplete();
                            }
                            else if (currentStep === 1) {
                                handleStep1Continue();
                            }
                            else {
                                handleStep2Continue();
                            }
                        }}
                        disabled={!canProceed() || isLoading}
                        className={`${currentStep > 1 ? 'flex-1' : 'w-full'} py-3 px-4 ${button} text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : currentStep === 3 ? (
                            <>
                                <CreditCard className="w-4 h-4" />
                                Confirm
                            </>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};