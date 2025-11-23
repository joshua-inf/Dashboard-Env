'use client'
import React, { useState, useEffect, useRef } from "react";
import { createWithdrawal, getWalletBalance, sendMail } from "../../../services/api/apiWallet"
import { useRouter } from "next/navigation";
import "../WithdrawForm.css";
import { getData, getOrgData } from "@/lib/createCookie";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export const WithdrawDialog = ({ open, onClose, balance, fetchData }: { open: boolean, onClose: () => void, balance: number, fetchData: () => void }) => {

    const formRef = useRef<HTMLFormElement>(null);
    const businessId = getOrgData()
    const userData = getData()

    const [form, setForm] = useState<any>({
        amount: "",
        method: "",
        account_details: "",
        business_id: businessId?.id
    });

    type errorTypw = {
        type: string
        text: string
    }


    const router = useRouter();
    const [errors, setErrors] = useState<errorTypw[] | null>(null);
    const [success, setSuccess] = useState<any | boolean>(false);
    const [loading, setLoading] = useState<any | boolean>(false);

    const validate = ({
        amount,
        method,
        account_details
    }: {
        amount: number;
        method: string;
        account_details: string;
    }) => {
        const trimmedDetails = account_details.trim();
        const errors: errorTypw[] = [];

        // Amount validation
        if (!amount || isNaN(amount) || amount <= 0) {
            errors.push({
                type: "amount",
                text: "Please enter a positive amount"
            });
        } else if (amount > balance) {
            errors.push({
                type: "amount",
                text: `Amount cannot exceed your available balance of ZMW ${balance.toFixed(2)}`
            });
        }

        // Method validation
        if (!method) {
            errors.push({
                type: "method",
                text: "Please select a withdrawal method"
            });
        }

        // Account details validation
        if (!trimmedDetails) {
            errors.push({
                type: "account_details",
                text: "Please enter your account details"
            });
        } else if (method === "mobile" && !/^0[79][0-9]{8}$/.test(trimmedDetails)) {
            errors.push({
                type: "account_details",
                text: "Please enter a valid Zambian mobile number (e.g., 097XXXXXXX)"
            });
        } else if (method === "bank" && trimmedDetails.length < 5) {
            errors.push({
                type: "account_details",
                text: "Please enter complete bank account details"
            });
        }

        setErrors(errors);
        console.log(errors);
        return errors.length === 0;
    };


    const handleChange = (e: any) => {
        setForm((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const SendMail = async (userMail: string, amount: number, ID: string) => {
        try {
            const res = await sendMail(userMail, amount, ID);
            if (res) {
                alert("Withdrawal Successful");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to send withdrawal confirmation email");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            console.log(data);
        }

        if (!validate({ amount: Number(form.amount), method: form.method, account_details: form.account_details })) return;

        try {
            setLoading(true);
            const res = await createWithdrawal(form);
            if (res) {
                fetchData(); // fetch latest data only on success
                console.log("Company Withdrawals:", res);
                await SendMail(userData.email, form.amount, businessId?.id ?? '');
            }
        } finally {
            setLoading(false); // always reset loading, even if something fails
            onClose();
        }
    };
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto z-[9999] bg-white dark:text-white dark:bg-boxdark rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-200">
                        Request Withdrawal
                    </DialogTitle>
                    <DialogDescription className="text-gray-700 dark:text-gray-400">
                        Available Balance: {balance !== null ? `ZMW ${balance.toFixed(2)}` : "Loading..."}
                    </DialogDescription>
                </DialogHeader>

                <div className="  overflow-y-auto rounded-md dark:text-white">
                    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-3">
                            <label htmlFor="amount">Amount (ZMW)</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                min="1"
                                step="0.01"
                                placeholder="Enter amount"
                                className={errors && errors.length ? "error text-black " : " text-black "}
                            />
                            {errors && errors.filter((e) => e.type == "amount").length > 0 && <div className="error-message">{errors.filter((e) => e.type == "amount")[0].text}</div>}
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="method">Withdrawal Method</label>
                            <select
                                name="method"
                                value={form.method}
                                onChange={handleChange}
                                className={errors && errors.filter((e) => e.type == "method").length > 0 ? "error text-black " : " text-black "}
                            >
                                <option value="">Select a method</option>
                                <option value="mobile">Mobile Money</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                            {errors && errors.filter((e) => e.type == "method").length > 0 && <div className="error-message">{errors.filter((e) => e.type == "method")[0].text}</div>}
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="account_details">
                                {form.method === "mobile"
                                    ? "Mobile Money Number"
                                    : form.method === "bank"
                                        ? "Bank Account Details"
                                        : "Account Details"}
                            </label>
                            <input
                                type="text"
                                name="account_details"
                                placeholder={
                                    form.method === "mobile"
                                        ? "e.g. 097XXXXXXX"
                                        : form.method === "bank"
                                            ? "Account number and bank name"
                                            : "Enter account details"
                                }
                                value={form.account_details}
                                onChange={handleChange}
                                className={errors && errors.filter((E) => E.type == "account_details").length > 0 ? "error text-black " : " text-black "}
                            />
                            {errors && errors.filter((E) => E.type == "account_details").length > 0 && (
                                <div className="error-message">{errors.filter((E) => E.type == "account_details")[0].text}</div>
                            )}
                        </div>

                        <button className="submit-btn flex items-center justify-center gap-5 text-white" type="submit">
                            {loading ? <>
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>  loading...</> : 'Submit Withdrawal Request'}</button>
                    </form>

                    {success && (
                        <div className="success-message">
                            Your withdrawal request has been submitted successfully! TryBae will contact you shortly.
                        </div>
                    )}

                    <div className="form-info">
                        <p><strong>Note:</strong> After submitting your withdrawal request, the TryBae team will review it and contact you to confirm before processing.</p>
                        <p>Processing time is typically 1-3 business days after confirmation.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
