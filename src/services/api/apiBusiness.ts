import { businessOnwersType, BusinessType, businessType } from '@/types/businesses';
import { supabase } from './../SupabaseConfig';
import { rejects } from 'assert';
import { ImagePreview } from './products';
import { isStillValid } from '../subscription/subscriptionService';


// Get all businesses
export async function getBusinesses(): Promise<BusinessType[] | null> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('is_deleted', false)

        if (error) {
            console.error("Error fetching businesses:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching businesses:", err);
        return null;
    }
}

// Get a specific business by ID
export async function getBusinessById(id: string): Promise<BusinessType | null> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error("Error fetching business:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching business:", err);
        return null;
    }
}

// Create a new business
export async function createBusiness(newData: Partial<BusinessType>, userData: any, imageData: ImagePreview | null): Promise<any | null> {
    let dataFromBusiness: Partial<BusinessType> = {};

    try {
        const { data, error } = await supabase
            .from('businesses')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating business:", error.message);
            return null;
        }

        dataFromBusiness = data;


        // Upload image if provided
        if (imageData) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('uploaded-files')
                .upload(
                    `business/${dataFromBusiness.id}/${imageData.name}`,
                    imageData.file
                )

            if (uploadError) {
                console.error("Image upload failed:", uploadError);
                return null;
            }

            console.log("Image uploaded:", uploadData);
        }


    } catch (err) {
        console.error("Unexpected error creating business:", err);
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('business_owners')
            .insert({
                user_id: userData.id, // Assuming userData contains the user ID
                int_user_id: userData.user_id,
                owner_id: userData.user_id, // Assuming userData contains the owner ID
                business_id: dataFromBusiness.id,
                int_business_id: dataFromBusiness.business_id,
            })
            .select()
            .single();

        if (data) {
            return data;
        }
    } catch (err) {
        console.error("Unexpected error creating business owner:", err);
        return null;
    }
}

// Update a business by ID


// Soft-delete a business (update deleted_at timestamp)
export async function softDeleteBusiness(id: string | undefined): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('businesses')
            .update({ deleted_date: new Date().toISOString(), is_deleted: true })
            .eq('id', id);

        if (error) {
            console.error("Error deleting business:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting business:", err);
        return false;
    }
}

export async function uploadBusinessLogo(file: File, businessId: string): Promise<string | null> {
    const filePath = `${businessId}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
        .from('business-logos')
        .upload(filePath, file);

    if (error) {
        console.error('Upload error:', error.message);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from('business-logos')
        .getPublicUrl(filePath);

    return urlData.publicUrl || null;
}

// custom functions
export const getBusinessByOwnerID = (id: string): Promise<null | any[]> => {
    let businessess = [];

    return new Promise(async (resolve, reject) => {
        console.log("Fetching business owner with ID:", id);
        try {
            const { data, error } = await supabase
                .from('business_owners')
                .select('businesses(*)')
                .eq('user_id', id)
                .eq('businesses.is_deleted', false)

            if (error) {
                console.error("Error fetching business owner:", error.message);
            }

            for (let i = 0; i < (data?.length || 0); i++) {
                if (data && data[i] && data[i].businesses) {
                    businessess.push(data[i].businesses);
                }
            }

        } catch (err) {
            console.error("Unexpected error fetching business owner:", err);
            reject(null);
        }

        try {
            const { data, error } = await supabase
                .from('teams')
                .select('businesses(*)')
                .eq('member', id)
                .eq('businesses.is_deleted', false)

            if (data) {
                // console.log("member business:", data)
                for (let i = 0; i < (data?.length || 0); i++) {
                    if (data && data[i] && data[i].businesses) {
                        businessess.push(data[i].businesses);
                    }
                }
            }

            if (error) {
                console.error("Error fetching business owner:", error.message);
            }

        } catch (error) {

        }

        resolve(businessess)
    })
}

export const updateBusiness = async (
    product: Partial<BusinessType>,
    id: string,
    imageData?: ImagePreview | null
): Promise<any> => {

    return new Promise(async (resolve, reject) => {
        try {
            // Update product data
            if (product) {
                const { data, error: updateError } = await supabase
                    .from("businesses")
                    .update(product)
                    .eq("id", id);

                if (updateError) {
                    console.error("Update failed:", updateError);
                    reject(updateError);
                }

                console.log("Updated record:", data);
            }

            // Upload image if provided
            if (imageData) {

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('uploaded-files')
                    .upload(
                        `business/${id}/${imageData.name}`,
                        imageData.file
                    )

                if (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    reject(uploadError);
                }

                // console.log("Image uploaded:", uploadData);
            }

            resolve("success");
        } catch (error) {
            console.error("Error updating product and image:", error);
            resolve(error);
        }
    })
};

export const getProductImages = async (
    productId: string | undefined,
    fileName: string
): Promise<string | null> => {
    try {
        const filePath = `business/${productId}/${fileName}`;

        const { data } = supabase.storage
            .from("uploaded-files")
            .getPublicUrl(filePath);

        if (!data) {
            console.error("Error fetching product images:");
            return null;
        }
        return data.publicUrl ?? null;

    } catch (error) {
        console.error("Unexpected error fetching product images:", error);
        return null;
    }
};

export const isBusinessOnActiveSubscription = async (business_id?: string, userID?: string) => {

    let response = await checkNormal(business_id, userID)
    let checkteams = await checkifPartofTeamSub(business_id, userID)

    return response || checkteams;
}


const checkifPartofTeamSub = async (business_id?: string, userID?: string) => {
    try {
        const { data, error } = await supabase
            .from("sunhistory")
            .select("*")
            .eq("paidfor", true)
            .contains("registeredBusinesses", [business_id])

        if (data) {
             let filteredData = data.filter((sub) => {
                const duration = sub.subscriptionTable?.duration_in_days || 0;

                return isStillValid(sub.created_at, duration, sub.subscriptionTable.period);
            });

            if(filteredData.length > 0){
                return true
            }

        }
        if (error) {
            return false
        }

    } catch (err) {
        return false
    }
}


const checkNormal = async (business_id?: string, userID?: string) => {
    try {
        const { data, error } = await supabase
            .from("sunhistory")
            .select("*, subscriptionTable(*)")
            .eq("paidfor", true)
            .eq("userid", userID)

        if (data) {
            let filteredData = data.filter((sub) => {
                const duration = sub.subscriptionTable?.duration_in_days || 0;

                return isStillValid(sub.created_at, duration, sub.subscriptionTable.period);
            });

            if (filteredData[0].registeredBusinesses.includes(business_id)) {
                return true
            } else {
                return false
            }
        }

        if (error) {
            return false
        }


    } catch (err) {
        return false
    }
}