"use client";
import React, { useState, useEffect } from "react";
import { getOrgData } from "@/lib/createCookie";
import { BusinessType } from "@/types/businesses";
import Link from "next/link";
import { hasPendingPreviousBalance } from "@/services/Billing/Billing";

const PendingInvoicesRestriction = ({ children }: { children: any }) => {
  const [hasPendingBalance, setHasPendingBalance] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const businessData: BusinessType | null | undefined = getOrgData();

  useEffect(() => {
    const checkPendingBalance = async () => {
      if (!businessData?.id) return;
      
      setLoading(true);
      try {
        const pendingBalance = await hasPendingPreviousBalance(businessData.id);
        setHasPendingBalance(pendingBalance);
      } catch (error) {
        console.error("Error checking pending balance:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPendingBalance();
  }, [businessData?.id]);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking account status...</p>
        </div>
      </div>
    );
  }

  // If no pending balance, don't show the restriction
  if (!hasPendingBalance) {
    return children; // Or you can return children here if this is a wrapper component
  }

  // Restrictive page when pending balance exists
  return (
    <div className=" flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-10 h-10 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Action Required
          </h1>

          {/* Message */}
          <div className="text-gray-600 dark:text-gray-300 mb-6 space-y-3">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              You have pending invoices that require your attention.
            </p>
            <p className="text-sm">
              To continue using all features of our platform, please settle your outstanding balance by visiting the billing section.
            </p>
          </div>

          {/* Features Blocked */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
              Currently Restricted:
            </h3>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
              <li className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                New order processing
              </li>
              <li className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Withdrawal requests
              </li>
              <li className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Account upgrades
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/Billing"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 block"
            >
              Go to Billing & Pay Now
            </Link>
            
            {/* <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Contact Support
            </button> */}
          </div>

          {/* Additional Help */}
          {/* <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            <p>Need help? Our support team is available 24/7</p>
            <p className="mt-1">Email: support@yourcompany.com | Phone: +1 (555) 123-4567</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PendingInvoicesRestriction;