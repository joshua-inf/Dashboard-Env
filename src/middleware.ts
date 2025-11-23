import { NextRequest, NextResponse } from 'next/server'
import { checkSub } from './services/subscription/subscriptionService'

export async function middleware(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  let localToken = req.cookies.get('userToken')?.value
  // const path = req.nextUrl.pathname;

  // cookies for visit count
  const firstTime = req.cookies.get('didVisit')?.value
  // const showAdd = req.cookies.get('showAdd')?.value

  const res = NextResponse.next()

  // 🔹 Step 1: Handle token from query
  if (token) {
    console.log('Token exists')
    res.cookies.set('userToken', token, {
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    localToken = token
  }

  // 🔹 Step 2: Redirect if no token found
  if (!localToken && !token) {
    console.log('Token does not exist')
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // 🔹 Step 3: Check subscription

  // const userData = await checkSub(userId)

  // console.log(userData)



  // checkeverywhere else but not on root

  // ✅ Skip check for home route "/"
  // Show ad logic
  if (!firstTime) {
    console.log('Not first time visit')
    res.cookies.set('showAdd', 'show', {
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
  }
  }

  // ✅ Apply middleware to these routes
  export const config = {
    matcher: [
      '/',
      '/customer-analytics/:path*',
      '/sales-analytics/:path*',
      '/orders/:path*',
      '/lennyAi/:path*',
      '/products_and_services/:path*',
      '/overview/:path*',
      '/inventory/:path*',
    ],
  }
