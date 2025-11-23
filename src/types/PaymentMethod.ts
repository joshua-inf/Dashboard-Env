export type PaymentMethod = {
    method_id: number;
    user_id?: number;
    method_name: string;
    is_default?: boolean;
};
