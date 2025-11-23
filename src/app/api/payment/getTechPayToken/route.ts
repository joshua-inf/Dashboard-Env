import { apiID, apiKey } from "@/services/api/header";
import { getRandomSixDigitString } from "@/services/subscription/subscriptionService";

export async function POST(req: Request) {
    console.log("Request Body:", req.body); // Log the incoming request body for debugging


    const { description, amount, orderNumber } = await req.json();

    try {
        const response = await fetch(`https://new.techpay.co.zm/api/v1/hc/gettoken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderNumber: orderNumber,
                description: description,
                amount: amount,
                merchantApiKey: apiKey,
                merchantApiID: apiID,
                returnURL: 'https://dashboard.inxource.com/payment'
            }),
        });

        const data = await response.json();

        console.log("TechPay Response:", data); // Log the response from TechPay for debugging

        if (data.responsecode == 100) {
            return new Response(JSON.stringify({ data: data.data, orderNumber: orderNumber }));
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: data.responsemessage,
            }), {
                status: 400
            });
        }

    } catch (error: any) {
        console.error("Error getting TechPay token:", error.message || error);
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to get TechPay token",
            error: error.message || error,
        }), {
            status: 500
        });
    }
}