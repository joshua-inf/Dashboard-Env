export type Payment = {
    payment_id: number;
    user_id?: number;
    amount: number;
    payment_method?: string;
    payment_status: 'Pending' | 'Completed' | 'Failed';
    payment_date?: string;
};
