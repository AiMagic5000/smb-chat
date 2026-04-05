import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/features(.*)',
  '/pricing(.*)',
  '/legal(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/widget/(.*)',
  '/api/billing/webhook',
  '/widget/(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', request.url).toString(),
    })
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
