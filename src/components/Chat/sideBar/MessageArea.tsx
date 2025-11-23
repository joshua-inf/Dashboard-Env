import { messageType } from '@/types/LennyAi'
import { Sparkles } from 'lucide-react'
import React from 'react'

export const MessageArea = ({ messages, loading, messagesEndRef, localmessage }: { messagesEndRef: any, messages: messageType[], localmessage: string[], loading: boolean }) => {
    return (
        <>
            {/* Messages Area */}
            <div className="flex-1 md:ps-[330px] py-[100px] ">
                {messages.length === 0 && localmessage.length === 0 ? (
                    // Welcome Screen
                    <div className="h-full  flex items-center justify-center ">
                        <div className="text-center max-w-2xl">
                            <div className="mb-8">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-gray-900"></div>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                                    Hello! I&apos;m your Sales AI Assistant
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Ready to help you analyze data and optimize your sales strategy
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                            </div>
                        </div>
                    </div>
                ) : (
                    // Messages List
                    <div className="p-6 space-y-6">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={` dark:text-white`}
                            >
                                <div className="flex items-end justify-end gap-3 mb-2">
                                    <div className={`max-w-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl rounded-tr-none shadow-sm p-4`}>
                                        <div className="flex items-start gap-3">
                                            <div className="text-sm leading-relaxed">
                                                {msg.question}
                                            </div>
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="text-xs">👤</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 mb-2">
                                    <div className={`max-w-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl rounded-tl-none p-4`}>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <Sparkles className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="text-sm leading-relaxed">
                                                {msg.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {localmessage.map((msg, index) => (
                            <div
                                key={index}
                                className={`dark:text-white`}
                            >
                                <div className={`flex flex-col ${(index + 1) % 2 == 0 ? 'items-start' : 'items-end'} gap-3 mb-2`}>
                                    <div className="flex items-end justify-end gap-3 mb-2">
                                        <div className={`max-w-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl rounded-tr-none shadow-sm p-4`}>
                                            <div className="flex items-start gap-3">
                                                {
                                                    (index + 1) % 2 == 0 ?
                                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                            <Sparkles className="w-3 h-3 text-white" />
                                                        </div>
                                                        : <>

                                                        </>
                                                }
                                                <div className="text-sm leading-relaxed">
                                                    {msg}
                                                </div>


                                                {
                                                    (index + 1) % 2 == 0 ?
                                                        <></>
                                                        :
                                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                            <span className="text-xs">👤</span>
                                                        </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}


                        {loading ?
                            <div className={`dark:text-white`}>
                                <div className={`flex flex-col items-start gap-3 mb-2`}>
                                    <div className="flex items-end justify-end gap-3 mb-2">
                                        <div className={`max-w-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl rounded-tr-none shadow-sm p-4`}>
                                            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                        }

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </>
    )
}
