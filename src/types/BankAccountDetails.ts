export type BankAccountDetails = {
    account_id: number;
    user_id?: number | null;
    bank_name: string;
    account_number: string;
    account_type?: string | null;
};
