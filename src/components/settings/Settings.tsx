'use client'
import { useState } from 'react'
import { Settings, Wrench, Rocket, Calendar, Users, Bell } from 'lucide-react'

const InteractiveSettingsComingSoon = () => {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setSubscribed(true)
            setEmail('')
            // Here you would typically send the email to your backend
        }
    }

    return (
        <div className=" p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                                <Wrench className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                                <Rocket className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                        Enhanced Settings In Progress
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        We&apos;re completely revamping the settings experience with powerful new features
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left Side - Features */}
                    <div className="space-y-6">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-purple-500" />
                                What&apos;s Coming
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">Team Management</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Invite and manage team members</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <Bell className="w-4 h-4 text-green-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">Smart Notifications</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Customize what alerts you receive</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">Advanced Scheduling</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Set up automated workflows</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Subscription */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Stay in the Loop
                        </h2>

                        {subscribed ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    You&apos;re on the list! 🎉
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We&apos;ll send you an email as soon as the new settings are live.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
                                >
                                    Notify Me When Ready
                                </button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    No spam, just one email when we launch. Unsubscribe anytime.
                                </p>
                            </form>
                        )}

                        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    <strong>Expected Launch:</strong> Late December 2024
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InteractiveSettingsComingSoon