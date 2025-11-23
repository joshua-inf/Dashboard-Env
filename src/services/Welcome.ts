import { supabase } from "./SupabaseConfig"

export const checkForFirstTimeUser = async (id?: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from("onBoarding")
            .select("*")
            .eq('userid', id)
            .select()

        if (error) {
            return false
        }

        // If data is an array with entries, the user has been onboarded before
        if (data.length > 0) {
            if (data[0].hasViewd) {
                return true
            } else {
                return false
            }
        } else {
            try {
                const { data, error } = await supabase
                    .from("onBoarding")
                    .insert([{ userid: id }])
                    .select()

                if (data) {
                    console.log('added visit record')
                }
                if (error) {
                    console.log("error adding visit record")
                }

            } catch (error) {
                console.log("error adding visit record")
            }

            return false
        }
    } catch (err) {
        return false
    }
}

export const updateFirstTimeStatus = async (id: string | undefined): Promise<Boolean> => {
    try {
        const { data, error } = await supabase
            .from("onBoarding")
            .update({ hasViewd: true })
            .eq('userid', id)
            .select()
            
        if (data && data?.length > 0) {
            return true
        } else {
            return false
        }

        if (error) {
            return false
        }
    } catch (error) {
        return false
    }
}