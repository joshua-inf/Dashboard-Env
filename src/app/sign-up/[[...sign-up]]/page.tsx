"use client";

import { useEffect } from "react";
import { supabase } from "@/services/SupabaseConfig";

export default function Page() {
    // const { user, isSignedIn } = useUser();

    // useEffect(() => {
    //     if (isSignedIn && user) {
    //         saveUserToSupabase(user);
    //     }
    // }, [isSignedIn, user]);

    const saveUserToSupabase = async (user: any) => {
        const { id, emailAddresses, firstName, lastName } = user;

        const { error } = await supabase.from("users").upsert([
            {
                id,
                email: emailAddresses[0]?.emailAddress || null,
                first_name: firstName || null,
                last_name: lastName || null,
            },
        ]);

        if (error) {
            console.error("Error saving user:", error);
        } else {
            console.log("User saved to Supabase successfully!");
        }
    };
    return (
        <div className="flex h-screen items-center justify-center">
            {/* <SignUp /> */}
        </div>
    );
}
