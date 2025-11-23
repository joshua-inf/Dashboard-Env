import { apiID, apiKey } from "@/services/api/header";
import axios from "axios";

export async function POST(req: Request) {
    const { ordertoken } = await req.json();
    console.log("Checking payment status for token:", ordertoken);

    if (!ordertoken) {
        return new Response(JSON.stringify({
            success: false,
            message: "Missing order token",
        }), {
            status: 400
        });
    }

    try {
        const response = await axios.post("https://new.techpay.co.zm/api/v1/hc/statuscheck", {
            token: ordertoken,
            merchantApiKey: apiKey,
            merchantApiID: apiID,
        });

        // return only useful data
        return new Response(JSON.stringify({
            success: true,
            paymentStatus: response.data,
        }), {
            status: 200
        });
    } catch (error: any) {
        console.error("Error checking payment status:", error?.response?.data || error.message);
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to check payment status",
            error: error?.response?.data || error.message,
        }), {
            status: 500
        });
    }
}