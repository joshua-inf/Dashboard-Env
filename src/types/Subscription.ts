export type Subscription = {
    id: string;
    features?: string[];
    plan_name?: number | null;
    created_at?: string;
    yearlydiscount?: string | null;
    price?: number;
    duration_in_days: number;
    popular: boolean;
    period: string;
    isActive: boolean
    description: string
};
export type SubscriptionHistory = {
    subid: string
    id: string
    userid: string
    registeredBusinesses: string[]
    subscriptionTable: Subscription[]

}
export interface PayoutPopupProps {
    isOpen: boolean
    onClose: () => void
    plan: Subscription
    amountPayable: number | undefined
}


interface MobileMoneyPaymentRequestBody {
    mobileNumber: string; // 10-digit mobile money number
    token: string;        // Payment token from previous request
    merchantApiKey: string;
    merchantApiID: string;
}

interface MobileMoneyPaymentApiResponse {
    responsecode: number;
    responsemessage: string;
    data: null;
}

export type PaymentTokenResponse = {
    responsecode: number;
    responsemessage: string;
    data: {
        status: number;
        message: string;
        token: string;
        orderNumber: string;
        transactionReference: string;
        amount: string;
        currency: string;
    };
};


export type makepayresponse = {

    responsecode: number
    responsemessage: string
    data: null

}

export type configtype = {
    icon: React.JSX.Element;
    title: string;
    description: string;
    color: string;
}

export interface RedirectToPayment {
    (url: string | undefined): void;
}