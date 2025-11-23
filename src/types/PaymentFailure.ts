export type PaymentFailure = {
    failure_id: number;
    user_id?: number;
    failure_reason: string;
    retry_count?: number;
    failure_date?: string;
};
