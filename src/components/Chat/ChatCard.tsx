"use client"
import { FaImage } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { MessageSquareTextIcon, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { SideBard } from "./sideBar/SideBard";
import { get } from "http";
import { createASessionId, getChatHistoryBySession, sendMessage } from "@/services/apiLennyChat";
import { InputArea } from "./sideBar/InputArea";
import { messageType } from "@/types/LennyAi";
import { MessageArea } from "./sideBar/MessageArea";
import { getData, getOrgData } from "@/lib/createCookie";
import { useRouter, useSearchParams } from "next/navigation";
import { BusinessType } from "@/types/businesses";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ChatCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<messageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localmessage, setLocalMessage] = useState<string[]>([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const route = useRouter();
  const searchParams = useSearchParams();
  const [chatSessionId, setChatSessionId] = useState<string | null>(searchParams.get("session"));
  const userData = useSelector((state:RootState)=> state.userDetails);
  const businessId = getOrgData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getChatHistorybySession = (session_id: string) => {
    // Fetch chat history by session ID and update messages state
    // This is a placeholder function. Implement the actual API call as needed.
    getChatHistoryBySession(session_id)
      .then((data) => {
        if (data) {
          console.log("Fetched chat history for session:", data);
          setMessages(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat history by session:", error);
      });

    console.log("Fetching chat history for session:", session_id);
  }


  useEffect(() => {
    scrollToBottom();
    getChatHistorybySession(chatSessionId || "");
  }, [chatSessionId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setWaitingForResponse(true);
    console.log("Submitting message:", chatSessionId);

    const nowSendMessage = () => {
      sendMessage(userData.id, chatSessionId || "new-session-id", message, userData.name)
        .then((response) => {
          if (response) {
            console.log("AI response:", response);
            setLocalMessage((prevMessages) => [...prevMessages, response]);
            if (!chatSessionId) {
              setChatSessionId(response.session_id); // Set the session ID if it's a new session
            }
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        })
        .finally(() => { setWaitingForResponse(false); });
    }
    
    e.preventDefault();
    if (message.trim() === '') return;
    // Add user message to local state
    setLocalMessage((prevMessages) => [...prevMessages, message]);
    // Here you would typically send the message to your backend or AI service
    // and get a response. For now, we'll just simulate a response.
    if (chatSessionId) {
      nowSendMessage();
    } else {
      createASessionId(businessId?.id)
        .then((session_id : any) => {
          if (session_id) {
            setChatSessionId(session_id);
            nowSendMessage();
          }
        }
        )
        .catch((error) => {
          console.error("Error creating session ID:", error);
        });
    }
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      {/* Sidebar */}
      <SideBard
        getChatHistoryBySession={(data) => route.replace("/lennyAi?session=" + data)}
        isOpen={isOpen}
        setIsOpen={setIsOpen} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        {messages.length > 0 && (
          <div className="bg-white/80 fixed left-0 md:left-[320px] right-0 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors md:hidden"
              >
                <MessageSquareTextIcon className="w-5 h-5" />
                <span className="font-medium hidden md:block">Chat History</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Sales Assistant
                </div>
                <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                  AI Powered
                </span>
              </div>
            </div>
          </div>
        )}

        <MessageArea loading={waitingForResponse} localmessage={localmessage} messages={messages} messagesEndRef={messagesEndRef} />

        <InputArea
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          message={message}
          loading={waitingForResponse}
          setMessage={setMessage} />
      </div>
    </div>
  );
};

export default ChatCard;