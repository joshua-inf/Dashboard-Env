import { getData } from '@/lib/createCookie';
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { checkForFirstTimeUser, updateFirstTimeStatus } from '@/services/Welcome';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const MainPage = () => {
    const [screenNumber, setScreenNumber] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const userData = useSelector((state:RootState)=> state.userDetails)

    useEffect(() => {
        // Show the modal after a brief delay for better UX
        checkForFirstTimeUser(userData?.id)
            .then((res) => {
                if (!res) {
                    setIsVisible(true)
                }
            })
            .catch((error) => {
                console.log(error)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextScreen = () => {
        setScreenNumber(prev => prev + 1);
    };

    const prevScreen = () => {
        setScreenNumber(prev => prev - 1);
    };

    const closeModal = () => {
        updateFirstTimeStatus(userData.id)
            .then((res) => {
                if (res) {
                    setIsVisible(false);
                }
            })
            .catch((error) => {
                console.log("error setting the fisrttime visit")
                setIsVisible(false);
            })
            .finally(() => {
                setIsVisible(false);
            })
        // Optional: Set a cookie to prevent showing again
    };

    if (!isVisible) return null;

    const screens = [
        {
            title: "Welcome aboard! 🎉",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-200 leading-relaxed">
                        We genuinely want you to succeed, and that starts with understanding how Inxource works.
                    </p>
                    <p className="text-gray-200 leading-relaxed">
                        Our User Guide is designed to be your companion as you set up—it explains the important choices
                        you&apos;ll make and how to get the most out of every feature.
                    </p>
                </div>
            )
        },
        {
            title: "Flexible Payment Options 💳",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-200 leading-relaxed">
                        When you subscribe to Inxource, you can choose between two payment options based on your convenience:
                    </p>

                    <div className="space-y-3">
                        {/* Wallet Option */}
                        <div className="flex items-start gap-3 p-3 bg-gray-600 rounded-lg border border-gray-500">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">1</span>
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Inxource Wallet</h4>
                                <p className="text-gray-300 text-sm mt-1">
                                    Store funds securely in your digital wallet for instant, seamless payments with no physical interaction.
                                    You can also request withdrawals anytime.
                                </p>
                            </div>
                        </div>

                        {/* Direct Payment Option */}
                        <div className="flex items-start gap-3 p-3 bg-gray-600 rounded-lg border border-gray-500">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">2</span>
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Direct (Cash) Payments</h4>
                                <p className="text-gray-300 text-sm mt-1">
                                    Pay directly in cash or through manual transactions without using the wallet system.
                                    Best for clients who prefer in-person or traditional payment methods.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 text-sm">
                        You can switch between these payment options before you subscribe.
                    </p>
                </div>

            )
        },
        {
            title: "Get Started Guide 📚",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-200 leading-relaxed">
                        Please take a moment to read through our comprehensive user guide:
                    </p>
                    <a
                        href='https://www.inxource.com/user_guide'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-4 py-3 bg-gray-500 hover:bg-gray-400 text-white rounded-lg transition-all duration-200 group border border-gray-400'
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open User Guide</span>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                    </a>
                    <p className="text-sm text-gray-300 mt-4">
                        This guide will help you with setup, best practices, and advanced features.
                    </p>
                </div>
            )
        },
        {
            title: "You're All Set! 🚀",
            content: (
                <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                        Thank you for taking the time to get familiar with Inxource.
                        We&apos;re excited to have you on board and can&apos;t wait to see what you&apos;ll accomplish!
                    </p>
                    <p className="text-gray-300 text-sm">
                        You can always access the user guide from the help menu.
                    </p>
                </div>
            )
        }
    ];
    const currentScreen = screens[screenNumber];
    const isFirstScreen = screenNumber === 0;
    const isLastScreen = screenNumber === screens.length - 1;

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#00000090] z-[9999] flex justify-center items-center p-4'>
            <div className="bg-gray-700 rounded-xl max-w-2xl w-full shadow-2xl border border-gray-600 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-600">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{currentScreen.title}</h2>
                        <div className="flex gap-1 mt-3">
                            {screens.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 rounded-full transition-all duration-300 ${index <= screenNumber ? 'bg-blue-500 w-4' : 'bg-gray-600 w-2'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        {currentScreen.content}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center p-6 border-t border-gray-600 bg-gray-650 rounded-b-xl">
                    <button
                        onClick={prevScreen}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isFirstScreen
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            }`}
                        disabled={isFirstScreen}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">
                            {screenNumber + 1} of {screens.length}
                        </span>

                        {isLastScreen ? (
                            <><button
                                onClick={isLastScreen ? closeModal : nextScreen}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                <Check className="w-4 h-4" />
                                Get Started

                            </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={isLastScreen ? closeModal : nextScreen}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4" />

                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MainPage;