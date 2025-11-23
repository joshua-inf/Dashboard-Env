import { apiID, apiKey } from "@/services/api/header";
import { pollPaymentStatus } from "@/services/subscription/subscriptionService";
import { makepayresponse } from "@/types/Subscription";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phoneNumber, order_id, orderToken } = await req.json();

    const response: Partial<makepayresponse> = await axios.post(
      "https://new.techpay.co.zm/api/v1/ic/pay/mobilemoney",
      {
        mobileNumber: phoneNumber, // 10-digit mobile money number
        token: orderToken,         // Payment token from previous request
        merchantApiKey: apiKey,
        merchantApiID: apiID,
      }
    );

    if (response.responsecode === 100) {
      const paymentStatus = await pollPaymentStatus(orderToken);

      return new Response(
        JSON.stringify({
          success: true,
          paymentStatus,
          data: order_id,
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment initiation failed",
        }),
        { status: 422 }
      );
    }
  } catch (error: any) {
    console.error("Error initiating payment with TechPay:", error.response?.data || error.message);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to initiate payment. Contact support.",
        error: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}
