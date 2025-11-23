export type UserRole = {
    role_id: number;
    user_id?: number | null;
    role_name: string;
    permissions: Record<string, any>; // JSONB field
};