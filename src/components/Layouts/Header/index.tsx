"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, KeyRound, PowerIcon, User2Icon, QrCodeIcon, ShoppingBag, Store } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "../../Notifications/DropdownNotification";
import { getOrgData, removeData, removeOrgData } from "@/lib/createCookie";
import { BusinessType } from "@/types/businesses";
import LightDarkLogo from "@/components/Logo";
import { UsersType } from "@/types/Customers";

interface HeaderProps {
  sidebarOpen: boolean;
  isOrgSelected: boolean;
  userDataLoader: boolean;
  setSidebarOpen: (open: boolean) => void;
  userData: Partial<UsersType> | null | undefined;
}

const Header = ({
  sidebarOpen,
  isOrgSelected,
  setSidebarOpen,
  userData
}: HeaderProps) => {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);
  const [openOptions, setOpenOptions] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrText, setQrText] = useState('');
  const [loading, setLoading] = useState(false);
  const businessData: BusinessType | null = getOrgData();

  const generateOrderLink = (companyAlias: string) => {
    const link = `https://payment.inxource.com/payment/${companyAlias}`;
    setQrText(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrText);
      // You could replace alert with a toast notification
      alert('Copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = qrText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${businessData?.business_name || 'business'}_qr_code.png`;
      link.click();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await removeData();
      removeOrgData();
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white/80 dark:bg-boxdark/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-gray-700 dark:text-gray-300 font-semibold">
            Logging out...
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center px-2 py-3">
          {/* Left Section */}
          <div className="flex justify-between grow items-center gap-4">
            {/* Hamburger Menu */}
            <div className="flex gap-2">
              {userData && isOrgSelected && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
                  aria-label="Toggle sidebar"
                >
                  <div className="w-6 h-6 relative">
                    <span className={`absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
                    <span className={`absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${sidebarOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {/* Logo and Brand */}
                <Link href="/" className="flex items-center gap-4 group">
                  <div className="flex flex-col gap-2">
                    {businessData ?
                      <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                        {businessData.business_name}
                      </span>
                      :
                      <div>
                        <LightDarkLogo className="h-2" />
                      </div>
                    }
                  </div>
                </Link>

                {/* Order Link Generator */}
                {userData && businessData && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 text-sm "
                  >
                    <Store size={16} />
                    <span className="hidden sm:block">Create Store Link</span>
                  </button>
                )}
              </div>
            </div>


            {/* Right Section */}
            <div className="flex items-center gap-2">
              {userData ? (
                <>
                  {/* Search Bar */}
                  {/* <div className="hidden md:block">
                    <Search />
                  </div> */}

                  {/* Notifications */}
                  {
                    businessData && (
                      <DropdownNotification />
                    )
                  }

                  {/* Dark Mode Toggle */}
                  {/* <DarkModeSwitcher /> */}

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenOptions(!openOptions)}
                      className="w-10 h-10 dark:bg-gray-900 bg-gray-100  rounded-full flex items-center justify-center text-gray-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {userData?.name?.[0]?.toUpperCase() || "U"}
                    </button>

                    {/* Dropdown Menu */}
                    {openOptions && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenOptions(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden">
                          <div className="p-2 space-y-1">
                            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                              <User2Icon size={16} />
                              Profile
                            </button>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            >
                              <PowerIcon size={16} />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/signin"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {modalOpen && (
          <>
            <div className="fixed top-0 h-screen left-0 right-0 flex justify-center items-center">
              <div
                className="fixed inset-0  h-screen  bg-black/50 backdrop-blur-lg z-[60]"
                onClick={() => setModalOpen(false)}
              ></div>

              <div className="relative z-[90] w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-6 space-y-4 text-gray-800 dark:text-white">
                <div className=" p-6 space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <QrCodeIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Order Link Generator
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {businessData?.business_name}
                    </p>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={() => {
                      if (businessData?.id && businessData?.company_alias) {
                        generateOrderLink(businessData.business_name);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Generate QR Code
                  </button>

                  {/* QR Code Display */}
                  {qrText && (
                    <div className="space-y-4 ">
                      <div ref={qrRef} className="flex justify-center">
                        <QRCodeCanvas
                          value={qrText}
                          size={160}
                          level="H"
                          bgColor="#ffffff"
                          fgColor="#000000"
                          className="rounded-lg shadow-lg"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={handleCopy}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                        >
                          <Copy size={16} />
                          Copy
                        </button>
                        <button
                          onClick={handleDownload}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;