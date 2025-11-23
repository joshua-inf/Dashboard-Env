import { TextareaAutosize } from '@mui/material'
import React from 'react'
import { LuSendHorizontal } from 'react-icons/lu'

export const InputArea = ({ handleSubmit, loading, handleKeyDown, message, setMessage }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, loading: boolean, handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void, message: string, setMessage: (value: string) => void }) => {
    return (
        <>
            {/* Input Area */}
            <div className=" fixed bottom-[60px] right-0 left-0 md:left-[320px] " >
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="flex rounded-lg justify-end border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-5  gap-4 space-y-2 items-center flex-wrap">
                        <TextareaAutosize
                            maxRows={6}
                            minRows={1}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="grow pl-4 pr-12 py-4 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none transition-all dark:text-white"
                            placeholder="Ask me anything about sales analytics..."
                        />
                        <button
                            aria-disabled={!message.trim() || loading}
                            type="submit"
                            disabled={!message.trim()}
                            className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-95"
                        >   {
                                loading ? (
                                    <div className="w-5 h-5 border-4 border-white border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                                ) :
                                    <LuSendHorizontal className="w-4 h-4" />
                            }

                        </button>
                    </div>

                    <div className="flex justify-center ">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            Sales AI Assistant • Powered by advanced analytics
                        </span>
                    </div>
                </form>
            </div>
        </>
    )
}
