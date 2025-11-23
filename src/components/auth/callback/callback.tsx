'use client'
import { useEffect, useState } from "react"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { authenticateUser, upsertUserData } from "@/services/auth/Auth"
import { createCookie, storeData } from "@/lib/createCookie"
import { useDispatch } from "react-redux"
import { setUserDetails } from "@/store/features/userDetailsSlice"

export default function AuthCallback() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Signing you in...")
    const dispatch = useDispatch()

    useEffect(() => {
        async function handleAuth() {
            try {
                authenticateUser()
                    .then((result) => {
                        if (!result) {
                            setStatus("error")
                            setMessage("Authentication failed. Please try again.")

                        } else {
                            upsertUserData(result)
                                .then((response) => {
                                    console.log("Auth Callback response: ", response)

                                    createCookie(response?.Token);
                                    dispatch(setUserDetails(response?.user || {}))

                                    setStatus("success")
                                    setMessage("Welcome back! Redirecting...")

                                    setTimeout(() => {
                                        window.location.href = "/"
                                    }, 1500)
                                })
                        }
                    })
                    .finally(() => {
                        // Any final steps if needed
                    })

                // Save user to your users table

            } catch (err) {
                console.error("Auth callback error:", err)
                setStatus("error")
                setMessage("Something went wrong. Please try again.")
            }
        }

        handleAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 text-center w-[320px]">
                {status === "loading" && (
                    <>
                        <Loader2 className="animate-spin mx-auto text-blue-500 w-10 h-10 mb-3" />
                        <p className="text-gray-700 dark:text-gray-300">{message}</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <CheckCircle className="text-green-500 mx-auto w-10 h-10 mb-3" />
                        <p className="text-gray-700 dark:text-gray-300">{message}</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="text-red-500 mx-auto w-10 h-10 mb-3" />
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
                        <button
                            onClick={() => (window.location.href = "/login")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Go Back
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
