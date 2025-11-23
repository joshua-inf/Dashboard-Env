import { UsersType } from "@/types/Customers"
import { getUserById } from "../api/apiUser"
import { supabase } from "../SupabaseConfig"
import { permission } from "process"

export const checkifhasbusinesses = async (user_id: string | undefined | null) => {
    try {
        const { data, error } = await supabase
            .from("sunhistory")
            .select("registeredBusinesses, id, userid")
            .eq("userid", user_id)
            .eq("isactive", true)
            .single()

        if (error) {
            return false
        }

        if (data) {
            return data
        }
    } catch (error) {
        return false
    }
}

export const getBusinessMembers = async (user_id: string | undefined | null, businessId?: string | null) => {
    try {
        const { data, error } = await supabase
            .from("teams")
            .select("member")
            .neq("member", user_id)
            .eq("business", businessId)
        if (error) {
            return false
        }
        if (data) {
            let userData = []
            if (data.length >= 1) {
                for (let i = 0; i < data.length; i++) {
                    let collecteddata = await getUserById(data[i].member)
                    if (collecteddata) {
                        userData.push(collecteddata)
                    }
                }
            }

            return userData
        }
    } catch (error) {
        console.log("error fetching business members: ", error)
        return false
    }
}


export const addToTeamSingle = async (user: UsersType, role: string, businessId?: string) => {
    try {
        const { data, error } = await supabase
            .from("teams")
            .insert({ member: user.id, business: businessId, permissions: [role] })
            .select("*")
            .single()

        if (data) {
            return true
        }
        if (error) {
            console.log("error adding team member: ", user.name, error)
            return false
        }
    }
    catch (error) {
        console.log("unknown error occured: ", error)
        return false
    }
}


export const addToTeamMultiple = async (user: UsersType[], role: string, businessId?: string) => {
    let userCount = 0
    try {
        for (let i = 0; i < user.length; i++) {
            let response = await addToTeamSingle(user[i], role, businessId)

            if (response) {
                userCount++
            }
        }

        return userCount;
    } catch (error) {
        console.log("error while adding users", error)
        return userCount
    }
}


export const chechAccess = async (business?: string, user?: string) => {

    try {
        const { data, error } = await supabase
            .from("business_owners")
            .select("*")
            .eq("business_id", business)
            .eq("user_id", user)
            .single()

            console.log("access data: ", data, error)
        if (data) {
            return true
        }

        if (error) {
            return false
        }
    } catch (error) {
        return false
    }

}