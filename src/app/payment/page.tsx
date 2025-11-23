'use client'
import PayStatus from '@/components/PayStatus/PayStatus'
import { useParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayStatus />
    </Suspense>
  )
}

export default page