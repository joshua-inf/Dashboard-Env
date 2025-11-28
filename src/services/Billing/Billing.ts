import { getOrderById, getOrdersByBusinessId } from "../api/apiOrder";
import { supabase } from "../SupabaseConfig";

export type BillingPayment = {
    id: string;                     // UUID
    user_id: string;                // UUID (Supabase auth user)

    amount: number;                 // Payment amount
    currency: string;               // e.g. "ZMW"
    payment_method: string;         // e.g. "mobile_money", "visa"
    payment_provider: string;       // e.g. "tumeny", "pesapal"
    transaction_id: string;         // External transaction ref

    status: "pending" | "completed" | "failed" | "refunded";

    payment_period: "monthly" | "quarterly" | "semi_annual" | "annual";

    start_date: string | null;      // timestamptz
    end_date: string | null;        // timestamptz

    provider_payload: any | null;   // Raw provider response
    metadata: Record<string, any> | null;

    payment_date: string | null;    // timestamptz
    created_at: string;             // timestamptz
    updated_at: string;             // timestamptz
};

export type Invoice = {
    id: string;
    business_id: string;

    period_month: string;          // "YYYY-MM" only
    period_start: string;
    period_end: string;

    total_order_amount: number;
    billing_rate: number;
    amount_due: number;

    status: "unpaid" | "paid" | "overdue";
    payment_id: string | null;

    generated_at: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
};

type MonthlyBilling = {
    month: string;        // "2025-01"
    total_orders: number; // sum of order amounts in the month
    charge: number;       // 1.5% billing charge
};

export const getBillingAmount = async (business_id: string): Promise<MonthlyBilling[]> => {
    const orders = await getOrdersByBusinessId(business_id);

    if (!orders || orders.length === 0) {
        return [];
    }

    const monthlyMap: Record<string, { total: number; count: number }> = {};

    for (const order of orders) {
        const date = new Date(order.created_at);

        // Format: "YYYY-MM"
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { total: 0, count: 0 };
        }

        monthlyMap[monthKey].total += order.total_amount;
        monthlyMap[monthKey].count += 1;
    }

    // Convert map to array with charge calculation
    return Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        total_orders: data.total,
        charge: Number((data.total * 0.015).toFixed(2)), // 1.5%
    }));
};

export const getOrCreateInvoicesByBusinessId = async (
    business_id: string
): Promise<Invoice[] | null> => {
    const billingPeriods = await getBillingAmount(business_id);
    if (!billingPeriods) return null;

    const invoices: Invoice[] = [];

    // Current month key: YYYY-MM
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    for (const billing of billingPeriods) {
        const { month, total_orders, charge } = billing;

        // Check if invoice exists
        const { data: existingInvoiceData, error: fetchError } = await supabase
            .from("invoices")
            .select("*")
            .eq("business_id", business_id)
            .eq("period_month", month)
            .limit(1)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Error fetching invoice:", fetchError);
            return null;
        }

        // If exists → push it
        if (existingInvoiceData) {
            invoices.push(existingInvoiceData as Invoice);
            continue;
        }

        // If NOT found and month == CURRENT → return dynamic only, DO NOT CREATE
        if (month === currentMonthKey) {
            invoices.push({
                id: "dynamic-" + month,
                business_id,
                period_month: month,
                period_start: "",      // No DB entry
                period_end: "",
                total_order_amount: total_orders,
                billing_rate: 1.5,
                amount_due: charge,
                status: "unpaid",
                payment_id: null,
                generated_at: "",
                paid_at: null,
                created_at: "",
                updated_at: ""
            });
            continue;
        }

        // If month < current month → CREATE invoice
        if (month < currentMonthKey) {
            const start = new Date(`${month}-01T00:00:00Z`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);

            const { data: newInvoice, error: insertError } = await supabase
                .from("invoices")
                .insert({
                    business_id,
                    period_month: month,
                    period_start: start.toISOString(),
                    period_end: end.toISOString(),
                    total_order_amount: total_orders,
                    billing_rate: 1.5,
                    amount_due: charge,
                    status: "unpaid",
                })
                .select()
                .single();

            if (insertError) {
                console.error("Error creating invoice:", insertError);
                return null;
            }

            invoices.push(newInvoice as Invoice);
        }
    }

    // Sort newest → oldest
    invoices.sort((a, b) => (a.period_month < b.period_month ? 1 : -1));

    return invoices;
};

export const hasPendingPreviousBalance = async (business_id: string): Promise<boolean> => {
    const invoices = await getOrCreateInvoicesByBusinessId(business_id);

    if (!invoices || invoices.length === 0) {
        return false;
    }

    // Get current billing period in YYYY-MM
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Check all invoices *except* the current period
    for (const invoice of invoices) {
        // Ignore current period invoice
        if (invoice.period_month === currentPeriod) continue;

        // If older invoice is unpaid or overdue → pending balance
        if (invoice.status === "unpaid" || invoice.status === "overdue") {
            return true;
        }
    }

    return false;
};