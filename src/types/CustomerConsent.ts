export type CustomerConsent = {
    consent_id: number;
    customer_id?: number | null;
    consent_type?: string | null;
    consent_status: boolean;
    granted_at?: string | null;
};
