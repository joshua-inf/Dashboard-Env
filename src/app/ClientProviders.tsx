'use client';

import { Provider } from "react-redux";
import { store } from "@/store/store";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import InitUserData from "./InitUserData";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ReactQueryProvider>
                <InitUserData>
                    {children}
                </InitUserData>
            </ReactQueryProvider>
        </Provider>
    );
}
