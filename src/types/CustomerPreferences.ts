export type CustomerPreferences = {
    preference_id: number;
    customer_id?: number | null;
    preferred_products?: any | null;
    preferred_contact_method?: string | null;
};
