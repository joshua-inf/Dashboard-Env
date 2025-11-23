"use client";
import React, { useEffect } from 'react'
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { CiInboxOut } from "react-icons/ci";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Sparkles } from 'lucide-react';
import { getData, getOrgData } from '@/lib/createCookie';
import { getChatHistory } from '@/services/apiLennyChat';
import { RecentChatButton } from './components/RecentChatButton';


export const SideBard = ({ isOpen, setIsOpen,getChatHistoryBySession }: { isOpen: boolean, setIsOpen: (value: boolean) => void, getChatHistoryBySession: (value:string)=>void }) => {
    const [loading, setLoading] = React.useState(false);
    const [sessionIds, setSessionIds] = React.useState<string[]>([]);
    const business = getOrgData()

    const userData = getData();
    const getSessionIds = () => {
        if (userData) {
            getChatHistory(business?.id)
                .then((data) => {
                    if (data) {
                        setSessionIds(data)
                        // console.log("Fetched session IDs:", data);
                    }
                }
                ).catch((error) => {
                    console.error("Error fetching session IDs:", error);
                })
                .finally(() => { setLoading(false); });
        }
    }

    useEffect(() => {
        getSessionIds()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={`
         py-30  fixed z-30 bottom-[40px] top-[60px] transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
        border-r border-gray-200/50 dark:border-gray-700/50
      `} >
            <div className="flex flex-col h-full p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            SalesAI
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Bars3BottomLeftIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        placeholder="Search conversations..."
                    />
                </div>

                {/* Chat History */}
                <div className="flex-1 space-y-2 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Recent Chats
                    </h3>
                    {sessionIds.map((data, index) => (
                        <a key={index} href={`?session-${data}`}>
                            <RecentChatButton  
                            getChatHistoryBySession={getChatHistoryBySession} 
                            key={index} 
                            data={data} />
                        </a>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <a href={'/lennyAi'} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        <FaPlus className="w-4 h-4" />
                        New Chat
                    </a>

                    <button className="w-full flex items-center gap-3 p-3 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                        <CiInboxOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Updates & FAQs</span>
                    </button>
                </div>
            </div>
        </div>
    )
}