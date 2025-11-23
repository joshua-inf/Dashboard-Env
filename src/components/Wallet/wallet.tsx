"use client";
import React, { useState, useEffect } from "react";
import { getWithdrawalsByBusinessId, getWalletBalance, Withdrawal, activateWallet } from "../../services/api/apiWallet";
import { getOrgData } from "@/lib/createCookie";
import { BusinessType } from "@/types/businesses";
import { WithdrawDialog } from "./Components/WithdrawDialog";
import { ToggleWallte } from "./Components/ToggleWallte";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState<any>("transactionHistory");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [withdrawalsState, setWithdrawalsState] = useState<boolean>(false);
  const [showActivationPrompt, setShowActivationPrompt] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [settingWallet, setSettingWallet] = useState(false);
  const businessData: BusinessType | null | undefined = getOrgData();

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const withdrawalData = await getWithdrawalsByBusinessId(businessData?.id);
      console.log(withdrawalData);
      if (withdrawalData?.withdrawData) setWithdrawals(withdrawalData.withdrawData);
      if (withdrawalData?.balance) setBalance(withdrawalData.balance);
      if (withdrawalData?.currentBalance) setCurrentBalance(withdrawalData.currentBalance);

      // Check if wallet is already activated (you might want to get this from your API)
      // For now, we'll assume it's not activated initially
    } catch (err) {
      setLoading(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [businessData?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openTab = (tab: any) => setActiveTab(tab);

  const handleActivateWallet = () => {
    setShowActivationPrompt(true);
  };

  const handleDeactivateWallet = () => {
    // Add your wallet deactivation logic here
    console.log("Deactivating wallet...");
  }

  const confirmActivation = async () => {
    setSettingWallet(true)
    // Add your wallet activation logic here
    console.log("Activating wallet...");

    try {
      let response = await activateWallet(businessData?.id, !businessData?.hasWallet);
      if (response) {
        console.log("Wallet activated successfully:")
      } else {
        console.log("Failed to activate wallet:");
      }
    } catch (error) {
      console.error("Error activating wallet:", error);
    } finally {
      setSettingWallet(false);
      fetchData();
      // Simulate API call to activate wallet
      setShowActivationPrompt(false);
    }


    // You would typically call an API endpoint here to activate the wallet
    // await activateWalletAPI(businessData?.id);
  };

  const cancelActivation = () => {
    setShowActivationPrompt(false);
  };

  return (
    <>
      <WithdrawDialog open={withdrawalsState} onClose={() => setWithdrawalsState(false)} balance={balance} fetchData={() => fetchData()} />

      {/* Activation Prompt Dialog */}
      {showActivationPrompt && (
        <ToggleWallte cancelActivation={cancelActivation} settingWallet={settingWallet} hasWallet={businessData?.hasWallet} confirmActivation={confirmActivation} />
      )}

      <div className="items-center flex justify-center p-3">
        <div className="w-full rounded-md p-8 shadow-md dark:bg-gray-800 bg-white border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex flex-wrap gap-5 justify-between items-center mb-6">
            <div className="wallet-info">
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {!loading ? `ZMW ${balance ? balance?.toFixed(2) : 0.00}` : "Loading..."}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                Current Balance: {!loading ? `ZMW ${currentBalance ? currentBalance?.toFixed(2) : 0.00}` : "Loading..."}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Status: <span className={`font-semibold ${businessData?.hasWallet ? "text-green-600" : "text-red-600"}`}>
                  {businessData?.hasWallet ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                onClick={() => setWithdrawalsState(true)}
              >
                Request Withdrawal
              </button>
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm shadow-sm"
                onClick={() => fetchData()}
              >
                Refresh
              </button>
              {!businessData?.hasWallet ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                  onClick={handleActivateWallet}
                >
                  Activate Wallet
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
                  onClick={handleActivateWallet}
                >
                  Deactivate Wallet
                </button>
              )}
            </div>
          </div>

          {/* Only show tabs and content if wallet is activated */}
          {balance > 0 && (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
                <div
                  className={`inline-block py-3 px-4 border-b-2 font-medium cursor-pointer transition-colors ${activeTab === "withdrawHistory"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  onClick={() => openTab("withdrawHistory")}
                >
                  Withdrawal History
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Account Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Request Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {withdrawals?.map((w, key) => (
                        <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ZMW {w.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {w.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {w.account_details}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {w.requested_at
                              ? new Date(w.requested_at).toISOString().slice(0, 10)
                              : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${w.status?.toLowerCase() === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : w.status?.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : w.status?.toLowerCase() === 'failed'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Show message if wallet is not activated */}
          {balance <= 0 && !loading && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg mt-6">
              <p className="text-gray-600 dark:text-gray-300">
                Your wallet is currently empty. you reques for withdraws will be shown here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WalletPage;