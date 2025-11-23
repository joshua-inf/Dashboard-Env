import { supabase } from './SupabaseConfig';
import { UserRole } from '@/types/userRoles';

// ✅ Create User Role
export async function createUserRole(newRole: Omit<UserRole, 'role_id'>): Promise<UserRole | null> {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .insert([{
                user_id: newRole.user_id ?? null,
                role_name: newRole.role_name,
                permissions: newRole.permissions,
            }])
            .single();

        if (error) {
            console.error("Error creating user role:", error.message);
            return null;
        }

        // console.log("User role created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating user role:", err);
        return null;
    }
}

// ✅ Get All User Roles
export async function getAllUserRoles(): Promise<UserRole[] | null> {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('*');

        if (error) {
            console.error("Error fetching user roles:", error.message);
            return null;
        }

        // console.log("User roles fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching user roles:", err);
        return null;
    }
}

// ✅ Get User Roles by User ID
export async function getUserRolesByUserId(userId: number): Promise<UserRole[] | null> {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching user roles:", error.message);
            return null;
        }

        console.log("User roles fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching user roles:", err);
        return null;
    }
}

// ✅ Update User Role
export async function updateUserRole(roleId: number, updatedRole: Partial<Omit<UserRole, 'role_id'>>): Promise<UserRole | null> {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .update(updatedRole)
            .eq('role_id', roleId)
            .single();

        if (error) {
            console.error("Error updating user role:", error.message);
            return null;
        }

        console.log("User role updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating user role:", err);
        return null;
    }
}

// ✅ Delete User Role
export async function deleteUserRole(roleId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_roles')
            .delete()
            .eq('role_id', roleId);

        if (error) {
            console.error("Error deleting user role:", error.message);
            return false;
        }

        console.log("User role deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting user role:", err);
        return false;
    }
}
