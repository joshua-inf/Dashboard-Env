'use client'
import React from 'react'
import { Lock, Zap, Star, ArrowRight } from 'lucide-react'

const SimpleSubscriptionWall = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10 p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Lock className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Upgrade to Premium
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          This feature is part of our premium plan. Upgrade now to unlock advanced analytics, 
          AI-powered insights, and exclusive business tools.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Zap className="w-5 h-5 text-green-500" />
            <span>Advanced AI Analytics</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Priority Support</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Lock className="w-5 h-5 text-purple-500" />
            <span>Exclusive Features</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg">
            Upgrade Now
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </button>
          
          <button className="w-full text-gray-600 dark:text-gray-400 py-2 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            See Plan Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleSubscriptionWall