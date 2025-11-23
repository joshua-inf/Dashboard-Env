"use client";

import React, { useState, useEffect, Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSearchParams } from "next/navigation";


// custom import can be replaced
import { createCookie, getData, getOrgData, storeData } from "@/lib/createCookie";
import { BusinessType } from "@/types/businesses";
import SubscriptionWall from "../SubscriptionWall/SubscriptionWall";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showSub, setShowSub] = useState(false)

  const userData = useSelector((state: RootState) => state.userDetails)


  // custom logic can be replaced
  const businessData: BusinessType | null = getOrgData();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || null;



  // Initialize mounted state with delay for smooth animation
  useEffect(() => {
    const subStatus = Cookies.get('showAdd')
    if (subStatus === 'show') {
      setShowSub(true)
    }

  }, []);

  const handleSubscriptionClose = () => {
    setShowSub(false)
    Cookies.set('showAdd', 'hide', { expires: 1 }) // Expires in 1 day
  }


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 transition-all duration-500 ease-out">
      {/* Sidebar */}
      {businessData ? (
        <>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </>
      ) : (
        <></>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col dark:bg-gray-900 bg-gray-50 min-w-0 transition-all duration-300 ease-out">
        {/* Header */}
        {userData && (
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userData={userData}
            userDataLoader={loadingUser}
            isOrgSelected={!!businessData}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-20 transition-all bg-light duration-300">
          <div className="w-full h-full">
            {/* Animated background elements with enhanced effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-200/30 dark:bg-purple-600/15 rounded-full blur-3xl animate-float-slow"></div>
              <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/15 rounded-full blur-3xl animate-float-slower"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-100/20 to-blue-100/20 dark:from-purple-500/10 dark:to-blue-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full">
              {/* Enhanced Loading Overlay */}
              {loadingUser && (
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl z-50 flex items-center justify-center rounded-2xl shadow-2xl">
                  <div className="text-center space-y-4 p-8">
                    <div className="relative inline-block">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-spin shadow-lg">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                        Preparing your workspace
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Loading your business data...
                      </p>
                    </div>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-white/30 animate-progress"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content with Enhanced Suspense */}
              <Suspense fallback={
                <div className="min-h-96 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <div className="text-center space-y-4 p-8">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Loading content...
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Just a moment while we prepare everything
                      </p>
                    </div>
                  </div>
                </div>
              } >
                <div className="">
                  {
                    showSub ?
                      <SubscriptionWall setOpen={handleSubscriptionClose} />
                      : <></>
                  }
                  {children}
                </div>
              </Suspense>
            </div>
          </div>
        </main>

        {/* Enhanced Footer Status Bar */}
        <footer className="border-t border-gray-200/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl px-6 py-3 transition-all duration-300">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                {businessData ? (
                  <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                    Connected to <strong>{businessData.business_name}</strong>
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    No organization selected
                  </span>
                )}
              </span>

              {userData && (
                <span className="text-gray-600 dark:text-gray-400 hidden md:inline">
                  Welcome back, <strong>{userData.name || userData.email}</strong>
                </span>
              )}
            </div>

            <div className="flex hidden md:block items-center gap-6">
              <span className="text-gray-600 dark:text-gray-400  bg-clip-text text-transparent font-semibold">
                Inxource Business Suite
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                v2.0
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Enhanced Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-lg z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DefaultLayout;