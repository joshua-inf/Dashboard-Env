'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    Lock,
    CheckCircle,
    ArrowLeft,
    Eye,
    EyeOff,
    Shield,
    Smartphone
} from 'lucide-react';
import { useVerificationCode } from '@/hooks/useVerificationCode';
import { checkifuserExistswithemail, resetPassword } from '@/services/api/apiUser';

type ForgotPasswordStep = 'email' | 'verification' | 'reset' | 'success';

export const ForgotPasswordPage = () => {
    const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passLoading, setPassLoading] = useState(false)


    const {
        sendVerificationCode,
        verifyCode,
        isLoading,
        error,
        clearError
    } = useVerificationCode({
        onSuccess: () => {
            // This will be called when verification is successful
            setCurrentStep('reset');
        },
        onError: (errorMessage) => {
            // Handle errors (already handled in the hook, but you can add additional logic)
        }
    });




    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!email) {
            // Set local form error
            return;
        }




        try {
            let response = await checkifuserExistswithemail(email)
            if(response){
                await sendVerificationCode(email, 'password_reset');
                setCurrentStep('verification');
            } else {
                setErrors({email: "error when checking for is user exists"})
            }
        } catch (err) {
            // Error is already handled in the hook
        }
    };



    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassLoading(true)
        try {
            if (newPassword != confirmPassword) {
                setErrors({ confirmPassword: "passwords do not match" });
            } else {
                setErrors({})
                let response = await resetPassword(email, confirmPassword)

                if (response) {
                    setCurrentStep("success")
                    console.log("error when updating")
                }
            }
        } catch (error) {

        } finally {
            setPassLoading(false)
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!verificationCode) {
            // Set local form error
            return;
        }

        try {
            await verifyCode(email, verificationCode);
            // onSuccess callback will handle the step change
        } catch (err) {
            // Error is already handled in the hook
        }
    };

    const handleResendCode = async () => {
        clearError();
        try {
            await sendVerificationCode(email, 'password_reset');
            // You can show a success message for resend
        } catch (err) {
            // Error is already handled in the hook
        }
    };

    const ProgressBar = () => (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between">
                {(['email', 'verification', 'reset', 'success'] as ForgotPasswordStep[]).map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep === step
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : currentStepIndex(currentStep) > index
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                    }`}
                            >
                                {currentStepIndex(currentStep) > index ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={`text-xs mt-2 font-medium ${currentStep === step
                                    ? 'text-blue-600'
                                    : currentStepIndex(currentStep) > index
                                        ? 'text-green-500'
                                        : 'text-gray-500'
                                    }`}
                            >
                                {stepLabels[step]}
                            </span>
                        </div>
                        {index < 3 && (
                            <div
                                className={`flex-1 h-1 mx-2 transition-colors duration-300 ${currentStepIndex(currentStep) > index ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const currentStepIndex = (step: ForgotPasswordStep) =>
        ['email', 'verification', 'reset', 'success'].indexOf(step);

    const stepLabels = {
        email: 'Email',
        verification: 'Verify',
        reset: 'Reset',
        success: 'Done'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Progress Bar */}
                <ProgressBar />

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentStep === 'email' && 'Reset Your Password'}
                            {currentStep === 'verification' && 'Verify Your Email'}
                            {currentStep === 'reset' && 'Create New Password'}
                            {currentStep === 'success' && 'Password Reset Successfully'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {currentStep === 'email' && 'Enter your email address to receive a verification code'}
                            {currentStep === 'verification' && 'Enter the 6-digit code sent to your email'}
                            {currentStep === 'reset' && 'Create a new password for your account'}
                            {currentStep === 'success' && 'Your password has been reset successfully'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-400 text-sm">{errors.general}</p>
                        </div>
                    )}

                    {/* Forms */}
                    <div className="space-y-6">
                        {/* Step 1: Email Input */}
                        {currentStep === 'email' && (
                            <form onSubmit={handleSendCode} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending Code...
                                        </div>
                                    ) : (
                                        'Send Verification Code'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 2: Verification Code */}
                        {currentStep === 'verification' && (
                            <form onSubmit={handleVerifyCode} className="space-y-6">
                                <div>
                                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Verification Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Smartphone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="verificationCode"
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.verification ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                        />
                                    </div>
                                    {errors.verification && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.verification}</p>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={isLoading}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium disabled:opacity-50"
                                    >
                                        Didn&apos;t receive code? Resend
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep('email')}
                                        disabled={isLoading}
                                        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Verifying...
                                            </div>
                                        ) : (
                                            'Verify Code'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Reset Password */}
                        {currentStep === 'reset' && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep('verification')}
                                        disabled={passLoading}
                                        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={passLoading}
                                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {passLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Resetting...
                                            </div>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 4: Success */}
                        {currentStep === 'success' && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Password Reset Successful!
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Your password has been reset successfully. You can now log in with your new password.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href="/signin"
                                        className="block w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        Go to Login
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setCurrentStep('email');
                                            setEmail('');
                                            setVerificationCode('');
                                            setNewPassword('');
                                            setConfirmPassword('');
                                        }}
                                        className="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Reset Another Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Back to Login */}
                    {currentStep !== 'success' && (
                        <div className="mt-6 text-center">
                            <Link
                                href="/signin"
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};