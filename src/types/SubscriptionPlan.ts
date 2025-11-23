export type SubscriptionPlan = {
    plan_id: number;
    plan_name: string;
    features?: Record<string, any>;
    price: number;
    duration_in_days: number;
};


export type UserSubscriptionType = {
    subtype: 'premium' | 'enterprise' | 'trial' | 'free';
    start_date: string; // ISO date string
    is_active: boolean;
    subid?: string; // subscription id from payment gateway
}