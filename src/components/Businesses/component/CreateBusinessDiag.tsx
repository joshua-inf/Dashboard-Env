import { useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ImagePreview } from "@/services/api/products"
import { createBusiness } from "@/services/api/apiBusiness"
import { Upload, Building2, X, Loader2, CheckCircle, AlertCircle, Sparkles, ArrowLeft, ArrowRight } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface CreateBusinessDiagProps {
    isOpen: boolean
    onClose: () => void
    getBusinessByUserID: () => void
}

type FormStep = 'basic' | 'details' | 'review';

export const CreateBusinessDiag = ({ isOpen, onClose, getBusinessByUserID }: CreateBusinessDiagProps) => {
    const [loading, setLoading] = useState(false)
    const [companyAlias, setCompanyAlias] = useState('')
    const [selectedImages, setSelectedImages] = useState<ImagePreview | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [currentStep, setCurrentStep] = useState<FormStep>('basic')
    const [formData, setFormData] = useState({
        business_name: '',
        industry: '',
        registration_number: '',
        phone: ''
    })
    const userData = useSelector((state: RootState) => state.userDetails)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const industries = [
        "Technology & Software",
        "Retail & E-commerce",
        "Food & Beverages",
        "Healthcare & Pharmaceuticals",
        "Finance & Banking",
        "Education & Training",
        "Real Estate",
        "Manufacturing",
        "Professional Services",
        "Hospitality & Tourism",
        "Media & Entertainment",
        "Transportation & Logistics",
        "Construction",
        "Agriculture",
        "Energy & Utilities",
        "Nonprofit & NGOs",
        "Beauty & Personal Care",
        "Automotive",
        "Sports & Recreation",
        "Other"
    ]

    const getFirstTwoInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !file.type.startsWith("image/")) {
            setError('Please select a valid image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB')
            return
        }

        const newImage: ImagePreview = {
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        }

        setSelectedImages(newImage)
        setError('')
        event.target.value = ""
    }

    const removeImage = () => {
        if (selectedImages?.url) {
            URL.revokeObjectURL(selectedImages.url)
        }
        setSelectedImages(null)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (field === 'business_name') {
            setCompanyAlias(getFirstTwoInitials(value))
        }
    }

    const handleNext = () => {
        if (currentStep === 'basic' && formData.business_name && formData.industry) {
            setCurrentStep('details')
        } else if (currentStep === 'details') {
            setCurrentStep('review')
        }
    }

    const handleBack = () => {
        if (currentStep === 'details') {
            setCurrentStep('basic')
        } else if (currentStep === 'review') {
            setCurrentStep('details')
        }
    }

    const addBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const businessData = {
                industry: formData.industry,
                business_name: formData.business_name,
                registration_number: formData.registration_number,
                phone: formData.phone,
                company_alias: companyAlias,
                imageName: selectedImages?.name
            }

            await createBusiness(businessData, userData, selectedImages)

            setSuccess(true)
            setTimeout(() => {
                onClose()
                getBusinessByUserID()
                resetForm()
            }, 1500)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create business. Please try again.')
            console.error('Business creation error:', err)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setCompanyAlias('')
        setSelectedImages(null)
        setError('')
        setSuccess(false)
        setCurrentStep('basic')
        setFormData({
            business_name: '',
            industry: '',
            registration_number: '',
            phone: ''
        })
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
            onClose()
        }
    }

    // Render Basic Information Step
    const renderBasicStep = () => (
        <>
            <DialogHeader className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Basic Information
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Tell us about your business
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Business Logo
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group
                            ${selectedImages
                                ? 'border-green-400 bg-green-50/50 dark:bg-green-900/10'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-700/50'
                            }
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {selectedImages ? (
                            <div className="relative">
                                <div
                                    className="w-32 h-32 mx-auto bg-cover bg-center rounded-lg shadow-lg"
                                    style={{ backgroundImage: `url(${selectedImages.url})` }}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Upload Business Logo
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        PNG, JPG up to 5MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Business Name */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Business Name *
                    </label>
                    <Input
                        required
                        value={formData.business_name}
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                        type="text"
                        placeholder="Enter your business name"
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                    />
                </div>

                {/* Company Alias */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Company Alias
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="font-mono text-blue-700 dark:text-blue-300">
                            {companyAlias || "AB"}
                        </span>
                        <span className="text-sm text-blue-600 dark:text-blue-400 ml-auto">
                            Auto-generated
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        This unique identifier will be used across the platform
                    </p>
                </div>

                {/* Industry */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Industry *
                    </label>
                    <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                    >
                        <option value="" disabled>Select your industry</option>
                        {industries.map((industry, index) => (
                            <option key={index} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )

    // Render Details Step
    const renderDetailsStep = () => (
        <>
            <DialogHeader className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Business Details
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Additional information about your business
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
                {/* Registration & Phone */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Registration Number
                        </label>
                        <Input
                            value={formData.registration_number}
                            onChange={(e) => handleInputChange('registration_number', e.target.value)}
                            type="text"
                            placeholder="REG-123456"
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number
                        </label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Preview</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Business Name:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formData.business_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formData.industry}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Company Alias:</span>
                            <span className="font-mono text-blue-600 dark:text-blue-400">{companyAlias || "AB"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    // Render Review Step
    const renderReviewStep = () => (
        <>
            <DialogHeader className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Review & Create
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Confirm your business information
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <form onSubmit={addBusiness} className="p-6 space-y-6">
                {/* Success State */}
                {success && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Business created successfully!</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Summary Card */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
                    {selectedImages && (
                        <div
                            className="h-32 bg-cover bg-center"
                            style={{ backgroundImage: `url(${selectedImages.url})` }}
                        />
                    )}
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{formData.business_name}</h3>
                            <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                {companyAlias}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formData.industry}</span>
                            </div>
                            {formData.registration_number && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Registration:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formData.registration_number}</span>
                                </div>
                            )}
                            {formData.phone && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formData.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                        Ready to create your business profile?
                    </p>
                </div>
            </form>
        </>
    )

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'basic':
                return renderBasicStep()
            case 'details':
                return renderDetailsStep()
            case 'review':
                return renderReviewStep()
            default:
                return renderBasicStep()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-0 z-[9999]">
                <form onSubmit={addBusiness}>
                    <div className="flex flex-col">
                        {renderCurrentStep()}

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="capitalize">{currentStep} step</span>
                            </div>

                            <div className="flex gap-3">
                                {currentStep !== 'basic' && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                )}

                                {currentStep === 'basic' && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}

                                {currentStep !== 'review' && (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={
                                            (currentStep === 'basic' && (!formData.business_name || !formData.industry)) ||
                                            loading
                                        }
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}

                                {currentStep === 'review' && (
                                    <button
                                        type="submit"

                                        disabled={loading || success}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating...
                                            </div>
                                        ) : success ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Created!
                                            </div>
                                        ) : (
                                            <>
                                                Create Business
                                                <CheckCircle className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}