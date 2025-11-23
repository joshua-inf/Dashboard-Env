export type Promotion = {
    promotion_id: number;
    product_id?: number | null;
    discount_type: string;
    discount_value?: number | null;
    start_date: string;
    end_date: string;
};
