'use client'
import "../css/style.css"
import React from "react"
import ReactQueryProvider from "@/components/ReactQueryProvider"
import { themeScript } from "./theme-script"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import ClientProviders from "./ClientProviders"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <html>
        <head>
          <script
            dangerouslySetInnerHTML={{ __html: themeScript() }}
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" />
          <title>Trybae Solutions</title>
        </head>
        <body suppressHydrationWarning>
          <ReactQueryProvider>
            {/* Load user data when app starts */}
            <ClientProviders>
              {children}
            </ClientProviders>
          </ReactQueryProvider>
        </body>
      </html>
    </Provider>
  )
}
