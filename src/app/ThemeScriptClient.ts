'use client'
import { useEffect } from "react"
import { themeScript } from "./theme-script"

export default function ThemeScriptClient() {
    useEffect(() => {
        themeScript()
    }, [])

    return null
}
