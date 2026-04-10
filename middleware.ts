import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { createClient as createSupabaseClient } from '@/utils/supabase/middleware'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const isProtected = createRouteMatcher(['/dashboard(.*)', '/trip(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Always refresh Supabase session cookies
  const supabaseResponse = createSupabaseClient(req)

  // Protect dashboard and trip routes — everything else (incl. /sign-in, /sign-up) is public
  if (isProtected(req)) {
    await auth.protect()
  }

  return supabaseResponse
})

export const config = {
  matcher: [
    // Run on all routes except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
