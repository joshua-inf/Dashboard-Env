import React, { useState } from 'react'
import { Subscription } from "@/types/Subscription";
import { CheckCircle } from 'lucide-react';
import { PayoutPopup } from './Paypopup';

export const PlanCard = ({ plan }: { plan: Subscription }) => {
    const [showPayout, setShowPayout] = useState(false)

    return (
        <>
            <PayoutPopup
                plan={plan}
                amountPayable={plan.price}
                isOpen={showPayout}
                onClose={() => setShowPayout(false)}
            />
            <div className={`
                        ${plan.isActive ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl ' : 'disabled cursor-not-allowed opacity-50 '}
                        relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border-2 
                        ${plan.popular
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-200/50 dark:border-gray-700/50 shadow-md'
                }`}>
                {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                            Most Popular
                        </span>
                    </div>
                )}

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.plan_name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent">
                            ${plan.price?.toFixed(2)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{plan.duration_in_days}{" "}
                            {plan.period === "days"
                                ? (plan.duration_in_days > 1 ? "days" : "day")
                                : (plan.duration_in_days > 1 ? "years" : "year")}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                    {plan.features?.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                    ))}
                </ul>

                <button
                    disabled={!plan.isActive}
                    onClick={() => setShowPayout(true)}
                    className={`.
                       ${plan.isActive ? ' duration-300 transition-all transform hover:scale-105 ' : ''}
                        w-full py-3 rounded-xl font-semibold  
                        ${plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                        `}>
                    Get {plan.plan_name} plan
                </button>
            </div>
        </>
    )
}
