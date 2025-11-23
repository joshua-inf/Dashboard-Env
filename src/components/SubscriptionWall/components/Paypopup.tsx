import { ChangeEvent, useCallback, useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Wallet, Banknote, CheckCircle2, AlertCircle, Loader2, Copy, Shield, Wallet2, LucideIcon, X, XCircle, ArrowLeft, ArrowRight, Gift } from "lucide-react"
import { checkforreferal, getSubscription, redirectToPayment } from "@/services/subscription/subscriptionService"
import { getData } from "@/lib/createCookie"
import { PayoutPopupProps, Subscription } from "@/types/Subscription"
import { useRouter } from "next/navigation"
import BusinessSelectionPopup from "@/components/Businesses/component/BusinessSelectionPopup "
import { BusinessReferralType, BusinessType } from "@/types/businesses"
import { getBusinessByOwnerID } from "@/services/api/apiBusiness"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export const PayoutPopup = ({ isOpen, onClose, amountPayable, plan }: PayoutPopupProps) => {
    const [loading, setLoading] = useState(false)
    const [referralLoading, setReferralLoading] = useState(false)
    const [payoutAmount, setPayoutAmount] = useState('')
    const [selectedMethod, setSelectedMethod] = useState('momo')
    const [withWallet, setWithWallet] = useState(true)
    const [step, setStep] = useState<'details' | 'method' | 'referral' | 'success'>('details')
    const [error, setError] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [isReferralValid, setIsReferralValid] = useState<boolean | null>(null)
    const [referral, setReferral] = useState<BusinessReferralType | null>(null)
    const userData = useSelector((state: RootState) => state.userDetails)
    const [isSelectionPopupOpen, setIsSelectionPopupOpen] = useState(false);
    const [organisationData, setOrganisationData] = useState<BusinessType[] | null>(null)
    const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
    const route = useRouter()

    const getBusinessByUserID = useCallback(async () => {
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
    }, [userData])

    const payoutMethods = [
        {
            id: 'momo',
            name: 'mobile money',
            description: 'Direct to your mobile money',
            icon: <Banknote className="w-5 h-5" />,
            fee: '',
            processing: 'instant'
        },
    ]

    const handlePayout = async () => {
        setError('')
        setLoading(true)

        getSubscription(plan.id, userData?.id, (amountPayable ?? 0) * 25, withWallet, selectedBusinesses, referral?.id)
            .then((res) => {
                const result = res as { data: { paymentLink: string } }
                redirectToPayment(result.data.paymentLink)
                console.log(result.data.paymentLink)
                setStep('success')
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleClose = () => {
        setStep('details')
        setReferralCode('')
        setIsReferralValid(null)
        onClose()
    }

    const WalletCard = ({ name, Icon, value }: { name: string, Icon: LucideIcon, value: boolean }) => {
        return (
            <div
                onClick={() => setWithWallet(value)}
                className={`p-4 border-2 grow rounded-xl cursor-pointer transition-all duration-200 ${withWallet == value
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${withWallet == value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            <Icon />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                                {name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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

    // Progress Steps
    const steps = [
        { id: 'details', name: 'Details', number: 1 },
        { id: 'method', name: 'Method', number: 2 },
        { id: 'referral', name: 'Referral', number: 3 },
    ]

    const checkifReferral = (code: ChangeEvent<HTMLInputElement>) => {
        setReferralLoading(true)
        setReferralCode(code.target.value)
        checkforreferal(code.target.value)
            .then((res) => {
                if (res) {
                    setIsReferralValid(true)
                    setReferral(res)
                } else {
                    setIsReferralValid(false)
                }
            })
            .catch((error) => {
                if (error) {
                    setIsReferralValid(false)
                }
            })
            .finally(() => {
                setReferralLoading(false)
            })
    }



    useEffect(() => {
        getBusinessByUserID()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <BusinessSelectionPopup
                subscription={null}
                businessIds={organisationData ? organisationData.map(business => business.id).filter((id): id is string => !!id) : [""]}
                isOpen={isSelectionPopupOpen}
                loading={loading}
                onClose={() => setIsSelectionPopupOpen(false)}
                businesses={organisationData || []}
                selectedBusinesses={selectedBusinesses}
                onBusinessSelect={handleBusinessSelect}
                onConfirmPress={handlePayout}
                onBusinessDeselect={handleBusinessDeselect}
                maxSelections={3}
            />
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-0 z-[9999] overflow-hidden">

                    {/* Success State */}
                    {step === 'success' ? (
                        <div className="p-6 text-center space-y-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>

                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Payout Successful!
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 dark:text-gray-400 text-lg">
                                    ${payoutAmount} is on its way to your {payoutMethods.find(m => m.id === selectedMethod)?.name}
                                </DialogDescription>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                                <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                                    <div className="flex justify-between">
                                        <span>Transaction ID:</span>
                                        <span className="font-mono flex items-center gap-1">
                                            TXN_{Date.now().toString().slice(-8)}
                                            <Copy className="w-3 h-3 cursor-pointer hover:text-green-800" />
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated arrival:</span>
                                        <span>{payoutMethods.find(m => m.id === selectedMethod)?.processing}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header with Progress Steps */}
                            <DialogHeader className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                                        <Wallet className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                            Complete Purchase
                                        </DialogTitle>
                                    </div>
                                </div>

                                {/* Progress Steps */}
                                <div className="flex items-center justify-between">
                                    {steps.map((stepItem, index) => (
                                        <div key={stepItem.id} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${steps.findIndex(s => s.id === step) >= index
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {stepItem.number}
                                                </div>
                                                <span className={`text-xs mt-1 font-medium ${steps.findIndex(s => s.id === step) >= index
                                                    ? 'text-blue-500'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {stepItem.name}
                                                </span>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`flex-1 h-1 mx-2 rounded ${steps.findIndex(s => s.id === step) > index
                                                    ? 'bg-blue-500'
                                                    : 'bg-gray-200 dark:bg-gray-600'
                                                    }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </DialogHeader>

                            <div className="p-6 space-y-6">
                                {/* Step 1: Details */}
                                {step === 'details' && (
                                    <div className="space-y-6">
                                        {/* Amount Input */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Payout Amount
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    ${(amountPayable ?? 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Do you want to use our wallet?
                                            </label>
                                            <div className="flex gap-4">
                                                <WalletCard name="Yes" value={true} Icon={Wallet2} />
                                                <WalletCard name="No" value={false} Icon={XCircle} />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={handleClose}
                                                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setStep('method')}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                Next
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Payment Method */}
                                {step === 'method' && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Payout Method
                                            </label>

                                            <div className="space-y-2">
                                                {payoutMethods.map((method) => (
                                                    <div
                                                        key={method.id}
                                                        onClick={() => setSelectedMethod(method.id)}
                                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedMethod === method.id
                                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                                            : 'border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${selectedMethod === method.id
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                                    }`}>
                                                                    {method.icon}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                                        {method.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {method.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={() => setStep('details')}
                                                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                Back
                                            </button>
                                            <button
                                                onClick={() => setStep('referral')}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                Next
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Referral */}
                                {step === 'referral' && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Gift className="w-4 h-4" />
                                                Referral Code (Optional)
                                            </label>

                                            <div className="relative flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={referralCode}
                                                        onChange={checkifReferral}
                                                        placeholder="Enter referral code"
                                                        className="w-full p-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                                    />
                                                    {referralLoading && (
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                                        </div>
                                                    )}

                                                    {/* {isReferralValid !== null && !validatingReferral && (
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            {isReferralValid ? (
                                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 text-red-500" />
                                                            )}
                                                        </div>
                                                    )} */}
                                                </div>
                                            </div>

                                            {isReferralValid === false && (
                                                <div className="text-sm text-red-500 dark:text-red-400 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Invalid referral code
                                                </div>
                                            )}
                                            {isReferralValid && (
                                                <div className="text-sm text-green-500 dark:text-green-400 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Referral code applied successfully!
                                                </div>
                                            )}
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={() => setStep('method')}
                                                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                Back
                                            </button>
                                            <button
                                                onClick={() => { setIsSelectionPopupOpen(true); handleClose() }}
                                                disabled={loading || !((amountPayable ?? 0) >= 0)}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        Complete Purchase
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}