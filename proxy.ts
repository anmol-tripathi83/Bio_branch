// It is middleware.ts file till nextJs version <= 15 but it got changed to proxy.ts for above version

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Add your username routes to public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  
  '/([^/]+)' // This matches any single segment path like /username    => kind of public url banana h koi aur bhi profile dekh ske evenif user is not logged in
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};