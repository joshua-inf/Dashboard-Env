"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { updateSubscription } from "@/services/subscription/subscriptionService";

type PaymentStatus = "COMPLETE" | "FAILED" | "PROCESSING" | "UNKNOWN";

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "red" | "blue" | "gray";
}

const PayStatus = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL parameters
  const bb_invoice_id = searchParams.get("bb_invoice_id");
  const token = searchParams.get("token");
  const initialStatus = searchParams.get("status") as PaymentStatus | null;

  // State
  const [status, setStatus] = useState<PaymentStatus>(initialStatus || "PROCESSING");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Status configuration with safe defaults
  const getStatusConfig = (status: PaymentStatus): StatusConfig => {
    const configs: Record<PaymentStatus, StatusConfig> = {
      COMPLETE: {
        icon: <CheckCircle2 size={64} className="text-green-500" />,
        title: "Payment Successful!",
        description: "Your payment has been confirmed successfully",
        color: "green",
      },
      FAILED: {
        icon: <XCircle size={64} className="text-red-500" />,
        title: "Payment Failed",
        description: errorMessage || "We couldn't process your payment",
        color: "red",
      },
      PROCESSING: {
        icon: <Loader2 size={64} className="text-blue-500 animate-spin" />,
        title: "Processing Payment",
        description: "Your payment is being processed",
        color: "blue",
      },
      UNKNOWN: {
        icon: <AlertCircle size={64} className="text-gray-500" />,
        title: "Payment Status Unknown",
        description: "Unable to determine payment status",
        color: "gray",
      },
    };

    return configs[status] || configs.UNKNOWN;
  };

  const statusConfig = getStatusConfig(status);

  // Validate and normalize status
  const normalizeStatus = (status: string | null): PaymentStatus => {
    if (status === "COMPLETE" || status === "FAILED" || status === "PROCESSING") {
      return status;
    }
    return "UNKNOWN";
  };

  // Update subscription status
  const updateSubscriptionStatus = async () => {
    if (!bb_invoice_id) {
      setStatus("FAILED");
      setErrorMessage("Missing invoice ID");
      setIsLoading(false);
      return;
    }

    try {
       setStatus("PROCESSING");
      setIsLoading(true);
      const result = await updateSubscription(bb_invoice_id);

      if (result) {
        console.log('Payment for subscription made successfully');
        setStatus("COMPLETE");

        // Redirect on success after delay
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        setStatus("FAILED");
        setErrorMessage("Payment verification failed");
      }
    } catch (err) {
      console.error('Subscription update error:', err);
      setStatus("FAILED");
      setErrorMessage("An error occurred while processing your payment");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleBackToHome = () => router.push("/");
  const handleGoToHomepage = () => router.push("/");
  const handleTryAgain = () => {
    updateSubscriptionStatus()
    // Implement retry logic or redirect to payment page
    // router.push("/payment"); // Adjust route as needed
  };
  const handleContactSupport = () => {
    // Implement support contact logic
    window.location.href = "mailto:support@zitfuse.net";
  };

  useEffect(() => {
    // Normalize the initial status
    const normalizedStatus = normalizeStatus(initialStatus);
    setStatus(normalizedStatus);

    if (normalizedStatus === "COMPLETE" || normalizedStatus === "FAILED") {
      setIsLoading(false);
      return;
    }

    // Only process if we need to update the subscription
    updateSubscriptionStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bb_invoice_id, initialStatus]);

  // Color class mapping for dynamic classes
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    gray: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      border: "border-gray-200",
      button: "bg-gray-600 hover:bg-gray-700",
    },
  };

  const currentColor = colorClasses[statusConfig.color] || colorClasses.gray;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleBackToHome}
          className="flex items-center text-gray-300 mb-6 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </motion.button>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Status header */}
          <div className={`${currentColor.bg} py-8 px-6 flex flex-col items-center`}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              {statusConfig.icon}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-2xl font-bold ${currentColor.text} text-center mb-2`}
            >
              {statusConfig.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${currentColor.text} text-center opacity-80`}
            >
              {statusConfig.description}
            </motion.p>
          </div>

          {/* Content section */}
          <div className="p-6">
            {/* Payment reference */}
            {bb_invoice_id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6 p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="font-medium text-gray-700 mb-2">Payment Reference</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Invoice ID:</span>
                  <span className="font-mono text-sm font-medium bg-gray-200 px-2 py-1 rounded">
                    {bb_invoice_id}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Countdown for success */}
            {status === "COMPLETE" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mb-6"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 text-sm text-center">
                    You will be redirected to the home page in 5 seconds
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col gap-3"
            >
              {status === "COMPLETE" && (
                <button
                  onClick={handleGoToHomepage}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Go to Homepage
                </button>
              )}

              {status === "FAILED" && (
                <>
                  <button
                    onClick={handleTryAgain}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <CreditCard size={18} className="mr-2" />
                    Try Payment Again
                  </button>
                  <button
                    onClick={handleContactSupport}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <AlertCircle size={18} className="mr-2" />
                    Contact Support
                  </button>
                </>
              )}

              {(status === "PROCESSING" || status === "UNKNOWN") && (
                <button
                  onClick={handleGoToHomepage}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Go to Homepage"}
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Support footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-6 text-center text-gray-400 text-sm"
        >
          <p>
            Need help?{" "}
            <button
              onClick={handleContactSupport}
              className="text-blue-400 hover:underline focus:outline-none"
            >
              Contact our support team
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PayStatus;