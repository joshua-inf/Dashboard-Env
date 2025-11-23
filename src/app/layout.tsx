'use client'

import "../css/style.css"
import React from "react"
import ReactQueryProvider from "@/components/ReactQueryProvider"
import { themeScript } from "./theme-script"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import InitUserData from "./InitUserData"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{ __html: themeScript() }}
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" />
          <title>Trybae Solutions</title>
        </head>
        <body suppressHydrationWarning={true}>
          <ReactQueryProvider>
            {/* Load user data when app starts */}
            <div className="dark:bg-gray-800">
              <InitUserData>
                {children}
              </InitUserData>
            </div>
          </ReactQueryProvider>
        </body>
      </html>
    </Provider>
  )
}
