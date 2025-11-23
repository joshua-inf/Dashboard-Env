import { supabase } from './SupabaseConfig';
import { Promotion } from '@/types/Promotion';

// ✅ Create Promotion
export async function createPromotion(newPromotion: Omit<Promotion, 'promotion_id'>): Promise<Promotion | null> {
    try {
        const { data, error } = await supabase
            .from('promotions')
            .insert([newPromotion])
            .single();

        if (error) {
            console.error("Error creating promotion:", error.message);
            return null;
        }

        console.log("Promotion created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating promotion:", err);
        return null;
    }
}

// ✅ Get All Promotions
export async function getAllPromotions(): Promise<Promotion[] | null> {
    try {
        const { data, error } = await supabase
            .from('promotions')
            .select('*');

        if (error) {
            console.error("Error fetching promotions:", error.message);
            return null;
        }

        console.log("Promotions fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching promotions:", err);
        return null;
    }
}

// ✅ Get Promotions by Product ID
export async function getPromotionsByProductId(productId: number): Promise<Promotion[] | null> {
    try {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('product_id', productId);

        if (error) {
            console.error("Error fetching promotions:", error.message);
            return null;
        }

        console.log("Promotions fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching promotions:", err);
        return null;
    }
}

// ✅ Update Promotion
export async function updatePromotion(promotionId: number, updatedPromotion: Partial<Omit<Promotion, 'promotion_id'>>): Promise<Promotion | null> {
    try {
        const { data, error } = await supabase
            .from('promotions')
            .update(updatedPromotion)
            .eq('promotion_id', promotionId)
            .single();

        if (error) {
            console.error("Error updating promotion:", error.message);
            return null;
        }

        console.log("Promotion updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating promotion:", err);
        return null;
    }
}

// ✅ Delete Promotion
export async function deletePromotion(promotionId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('promotions')
            .delete()
            .eq('promotion_id', promotionId);

        if (error) {
            console.error("Error deleting promotion:", error.message);
            return false;
        }

        console.log("Promotion deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting promotion:", err);
        return false;
    }
}
