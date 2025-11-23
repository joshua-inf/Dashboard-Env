import { UsersType } from "@/types/Customers"
import { getUserById } from "./api/apiUser"
import { supabase } from "./SupabaseConfig"

export const checkuserexists = async (id: string | null | undefined) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check is user exists in db
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single()
            if (data) {
                resolve(true)
            }
            if (error) {
                reject(false)
            }
        } catch (error) {
            reject(false)
        }
    })
}

export const SignUpwithGoogle = async () => {
    let redirectUrl = "https://dashboard.inxource.com/auth/callback"
    console.log("clicked: ", redirectUrl)
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: redirectUrl,
        },
    })

    if (error) console.error("Google Auth error:", error)
    return data
}

export const getUserByEmail = async (email: string): Promise<null | UsersType[]> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            

        if (data) {
            return data
        }

        if (error) {
            return null
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}