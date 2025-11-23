import { getData, getOrgData } from '@/lib/createCookie';
import { chechAccess } from '@/services/businesses/Businesses';
import React, { useEffect } from 'react'

const businessId = getOrgData();
const userData = getData()

export const HasAccess = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    useEffect(() => {

    }, [])
    return (
        <div>

        </div>
    )
}


export const hasAccesse = async (): Promise<boolean | undefined> => { return await chechAccess(businessId?.id, userData?.id) }