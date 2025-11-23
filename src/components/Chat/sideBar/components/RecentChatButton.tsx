"use client";
import { getDefiningChat } from '@/services/apiLennyChat';
import React, { useEffect } from 'react'
import { MdOutlineMessage } from 'react-icons/md'

export const RecentChatButton = ({ data,getChatHistoryBySession }: { data: string,getChatHistoryBySession: (value:string)=> void }) => {
    const [textTitle, setTextTitle] = React.useState<string>("");

    const getSessionTitle = () => {
        getDefiningChat(data)
            .then((res) => {
                console.log("Defining chat response:", res);
                if (res && res.question) {
                    setTextTitle(res.question);
                }
            })
            .catch((err) => {
                console.error("Error fetching session title:", err);
            })
    }

    useEffect(() => {
        getSessionTitle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <button
            onClick={() => getChatHistoryBySession(data)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors group"
        >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <MdOutlineMessage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {textTitle || data}
            </span>
        </button>
    )
}
