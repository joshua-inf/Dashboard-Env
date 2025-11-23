import { hasSubscribers } from "node:diagnostics_channel";
import { supabase } from "../SupabaseConfig"
import { makepayresponse, PaymentTokenResponse, RedirectToPayment, Subscription, SubscriptionHistory } from "@/types/Subscription";
import axios from "axios";
import { apiID, apiKey } from "../api/header";


export const getAllSubs = async (): Promise<boolean | Subscription[] | undefined> => {
    try {
        const { data, error } = await supabase
            .from('subscriptionTable')
            .select('*')
            .eq('isActive', true)

        if (data) {
            console.log('subs collected')
            return data
        }

        if (error) {
            console.log('error fetching sub: ', error)
            return false
        }
    } catch (error) {
        console.log('error fetching sub: ', error)
        return false
    }
}

export const getAllSubHistoryById = async (userId: string | null | undefined): Promise<boolean | undefined | SubscriptionHistory[]> => {
    try {
        const { data, error } = await supabase
            .from('sunhistory')
            .select('*')
            .eq('userid', userId)
            .eq('paidfor', true)

        if (data) {
            // console.log('sub history collected')
            return data
        }

        if (error) {
            console.log("error fetching sub history: ", error)
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

function hasDurationExpired(created_at: Date, durationInDays: number) {
    // Convert to Date objects if not already
    const startDate = new Date(created_at);
    const currentDate = new Date();


    // Calculate the end date by adding the duration
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationInDays);

    // Compare
    return currentDate < endDate;
}


export const getActiveSubscription = async (userID: string | undefined | null) => {
    console.log('fetching active subscription for user: ', userID)
    try {
        //gets active subscriptions
        const { data, error } = await supabase
            .from("sunhistory")
            .select("*, subscriptionTable(*)")
            .eq("userid", userID)
            .eq('paidfor', true)

        // console.log(data)

        if (data) {
            // check for subs that are still active based on duration
            let filteredData = data.filter((sub) => {
                const duration = sub.subscriptionTable?.duration_in_days || 0;
                return isStillValid(sub.created_at, duration, sub.subscriptionTable.period);
            });

            console.log('filtered data: ', filteredData)

            let isValid = filteredData.length > 0;

            if (isValid) {
                return filteredData[0];
            } else {
                return null
            }

        } else if (error) {
            console.error("Error fetching user:", error.message);
            console.log(error);
            return null
        }

        return null

    } catch (err) {
        console.log("checkSub error:", err);
        console.log(err);
        return null
    }
}


export const deactivateExpiredSubscriptions = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from("sunhistory")
            .update({ isactive: false })
            .eq('id', id)

        if (data) {
            return data
        }
        if (error) {
            return null
        }
    } catch (err) {
        return null
    }
}



export function isStillValid(
    creationDate: string | Date,
    duration: number,
    period: "days" | "year"
): boolean {
    const created = new Date(creationDate);
    const now = new Date();

    if (isNaN(created.getTime())) return false; // invalid date safety check

    const expiry = new Date(created);

    if (period === "days") {
        expiry.setDate(expiry.getDate() + duration);
    } else if (period === "year") {
        expiry.setFullYear(expiry.getFullYear() + duration);
    }

    return now <= expiry;
}

export const checkSub = async (userId: string) => {
    console.log('checking subscription status...')
    let userdata = null
    let CheckitstillValid = false
    try {

        if (!userId) {
            // console.log("User ID not found in cookies");
            return userdata; // directly return the fetched data
        } {

            //gets active subscriptions
            const { data, error } = await supabase
                .from("sunhistory")
                .select("*, subscriptionTable(*)")
                .eq("userid", userId)
                .eq('paidfor', true)

            if (data) {
                // check for subs that are still active based on duration
                let filteredData = data.filter((sub) => {
                    const duration = sub.subscriptionTable?.duration_in_days || 0;

                    return isStillValid(sub.created_at, duration, sub.subscriptionTable.period);
                });

                CheckitstillValid = filteredData.length > 0;

                if (filteredData.length > 0) {
                    console.log('active subscription found')
                    try {
                        const { data, error } = await supabase
                            .from("sunhistory")
                            .update({ isactive: true })
                            .in('id', filteredData[0].id)
                            .select('*')
                        if (data) {
                            console.log('subscription marked active')
                        }
                        if (error) {
                            console.log('failed to mark subscription active')
                        }
                    } catch {
                        console.log('some error i guess')
                    }
                }

            } else if (error) {
                console.error("Error fetching user:", error.message);
                console.log(error);
            }

            // console.log("these are the details retrieved: ", data)

            try {

                const { data, error } = await supabase
                    .from('users')
                    .update({ hasSubscription: CheckitstillValid })
                    .eq('id', userId)
                    .select('*')
                    .single()

                if (data) {
                    userdata = data;
                }

                if (error) {

                }
            } catch (error) {

            }

            // console.log('subscription id: ', userdata)
        }

        // console.log(userdata)
        return userdata; // directly return the fetched data
    } catch (err) {
        console.log("checkSub error:", err);
        console.log(err);
    }
};


export const getSubscriptionsDetails = async (id: string | null | undefined) => {
    const subhistory = await getAllSubHistoryById(id);
    const subscriptions = await getAllSubs();


    return new Promise(async (resolve, reject) => {
        try {
            if (subscriptions && Array.isArray(subscriptions)) {
                if (subhistory && Array.isArray(subhistory)) {
                    if (subhistory.length >= 0) {
                        if (subhistory.filter((res) => res.subid == '9733dac2-2ff6-4182-b2dd-9153e9e4afd0').length > 0) {
                            resolve(subscriptions.filter((res) => res.id != '9733dac2-2ff6-4182-b2dd-9153e9e4afd0'))
                        } else {
                            resolve(subscriptions)
                        }
                    } else {
                        resolve(subscriptions)
                    }

                    // console.log("Length:", subhistory.length);

                } else {
                    // console.log("sub table: ", subscriptions)
                    resolve(subscriptions)
                }
            } else {
                reject(null)
            }


        } catch (err) {
            reject(err)
        }
    })
}

export const getSubDetails = async (userId: string) => {
    let subDetails = null
    try {
        if (!userId) {
            console.log("User ID not found in cookies");
            return subDetails; // directly return the fetched data
        } {
            const { data, error } = await supabase
                .from("subscriptions")
                .select(`*`)
                .eq("user_id", userId)

            if (error) {
                console.error("Error fetching subscription details:", error.message);
                console.log(error);
            }
            subDetails = data;
            // console.log("Subscription details fetched:", data);
        }

        return subDetails;
    } catch (err) {
        console.log("getSubDetails error:", err);
        console.log(err);
    }
}

export const getSubscription = async (subId: string, userID: string | undefined, amount: number, hasWallet: boolean, selectedBusinesses: string[], referral?: string) => {

    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('sunhistory')
                .insert([
                    {
                        subid: subId,
                        userid: userID,
                        types: 'normal',
                        amount: amount,
                        haveWallet: hasWallet,
                        isactive: false,      // default active
                        paidfor: false,      // default unpaid
                        registeredBusinesses: [selectedBusinesses],
                        ref_code: referral
                    },
                ])
                .select()
                .single()

            console.log(data)


            let subdata = data

            if (subdata) {

                axios.post('api/payment/getTechPayToken',
                    {
                        description: 'subscription payment',
                        amount: amount,
                        orderNumber: subdata.id
                    }
                )
                    .then(async (res) => {
                        // console.log(res)
                        if (res) {
                            console.log(res.data.data.token)
                            try {
                                const { data, error } = await supabase
                                    .from("sunhistory")                   // your table
                                    .update({ orderToken: res.data.data.token }) // field you’re updating
                                    .select("*")                           // return the updated row
                                    .eq("id", subdata.id)                  // match by id
                                    .single();

                                if (data) {
                                    console.log("updated the record", data)
                                }

                                if (error) {
                                    console.log("something went wrong when update the subhistory: ", error)
                                }
                            } catch (error) {
                                console.log("something went wrong when update the subhistory: ", error)
                            }
                            resolve(res.data)
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            reject(err)
                        }
                    })
            } else {
                reject('failed with no data retrieved')
            }
            if (error) {
                reject(error)
            }

        } catch (err) {
            reject(err)
        }
    })
}

export const redirectToPayment: RedirectToPayment = (url) => {
    if (!url) return;

    // 🔗 Redirects the current tab to the payment URL
    window.location.href = url;
};

// generates a random six-digit string, padded with leading zeros if necessary
export function getRandomSixDigitString(): string {
    const num = Math.floor(Math.random() * 1_000_000); // 0–999999
    return num.toString().padStart(6, "0"); // ensures 6 digits
}

export const checkPaymentStatus = async (req: Request, res: Response) => {

};

// Polling logic (unchanged, but typed)
export async function pollPaymentStatus(ordertoken: string): Promise<any> {
    let attempts = 0;
    const maxAttempts = 12;
    const interval = 5000;

    return new Promise((resolve, reject) => {
        const checkStatus = async () => {
            try {
                const response: Partial<PaymentTokenResponse> = await axios.post(`https://new.techpay.co.zm/api/v1/hc/statuscheck`,
                    {
                        merchantApiKey: apiKey,
                        merchantApiID: apiID,
                        token: ordertoken
                    }
                );

                // console.log(`attempt number ${attempts} for Payment status for ${ordertoken}`);

                if (response.data?.status == 100) {
                    return resolve(response);
                }

                if (response.data?.status == 101) {
                    console.log(`its still pending`);
                    attempts++;

                    if (attempts >= maxAttempts) {
                        return reject(new Error("Max attempts reached. Payment still pending."));
                    }
                }

                setTimeout(checkStatus, interval);

            } catch (error: any) {
                console.error("Error checking payment status:", error.response?.data || error.message);
                reject(error);
            }
        };
        checkStatus();
    });
}

export const updateSubscription = async (id: string | null) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from("sunhistory")
                .update({ paidfor: true, isactive: true })
                .eq('id', id)
                .select('*')
                .single()

            let historyData = data

            console.log(historyData)

            const response = await axios.post("/api/payment/checkPaymentStatus", {
                ordertoken: historyData.orderToken
            })
            let responseData = response.data
            if (responseData.paymentStatus.data.status == 100) {
                if (data) {
                    try {
                        const { data, error } = await supabase
                            .from("users")
                            .update({ hasSubscription: true })
                            .eq('id', historyData.userid)
                            .select('*')
                            .single()
                        if (data) {
                            resolve(true)
                        }
                        if (error) {
                            reject(error)
                        }
                    } catch (error) {

                        reject(error)
                    }
                }
            } else {
                reject(false)
            }
        } catch (err) {
            reject(err)
        }
    })
}

export const checkforreferal = async (code: string) => {
    try {
        const { data, error } = await supabase
            .from("referral_codes")
            .select("*")
            .ilike("ref_code", code)
            .single()


        if (data) {
            return data
        }

        if (error) {
            return false
        }

    } catch (error) {
        return false
    }
}


export const addbusinessToSubscription = async (subId: string, userID: string, amount: number, hasWallet: boolean, selectedBusinesses: string[]) => {

    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('sunhistory')
                .insert([
                    {
                        subid: subId,
                        userid: userID,
                        types: 'normal',
                        amount: amount,
                        haveWallet: hasWallet,
                        isactive: false,      // default active
                        paidfor: false,      // default unpaid
                        registeredBusinesses: [selectedBusinesses]
                    },
                ])
                .select()
                .single()

            if (data) {
                axios.post('api/payment/getTechPayToken',
                    {
                        description: 'subscription payment',
                        amount: amount,
                        orderNumber: data.id
                    }
                )
                    .then((res) => {
                        if (res) {
                            resolve(res.data)
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            reject(err)
                        }
                    })
            } else {
                reject('failed with no data retrieved')
            }
            if (error) {
                reject(error)
            }

        } catch (err) {
            reject(err)
        }
    })
}


export const AddAbusinessToSubscription = async (subId?: string, selectedBusinesses?: string[]) => {
    // console.log(subId, selectedBusinesses)
    let currentData = []
    let updatedData = []

    try {
        const { data: record, error } = await supabase
            .from("sunhistory")
            .select("*")
            .eq("userid", subId)
            .eq("isactive", true)
            .eq("paidfor", true)
            .single<SubscriptionHistory>();

        if (error) {
            console.error("Fetch error:", error);
            return false;
        }

        if (record) {
            let updatedData: any[] = [];

            if (!record.registeredBusinesses || record.registeredBusinesses.length === 0) {
                updatedData = selectedBusinesses || [];
                console.log("No registered businesses yet, setting new list");
            } else if (record.registeredBusinesses.length < 3) {
                updatedData = [...record.registeredBusinesses, ...selectedBusinesses || []];
                console.log("Existing list is less than 3, appending new businesses");
            } else {
                console.log("Already has 3 or more businesses, skipping update");
                return false;
            }

            console.log("The new list is this:", updatedData);

            const { error: updateError } = await supabase
                .from("sunhistory")
                .update({ registeredBusinesses: updatedData })
                .eq("userid", subId);

            if (updateError) {
                console.error("Update error:", updateError);
                return false;
            }

            return true;
        }

        return false;
    } catch (err) {
        console.error("Unexpected error:", err);
        return false;
    }
}
