import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/test-login"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // API routes that don't need auth
  const publicApiRoutes = [
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/simple-login",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/health",
  ]
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Allow public routes and public API routes
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value

  // For dashboard routes, check authentication
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify token
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || "fallback-secret"
      )
      const { payload } = await jwtVerify(token, secret)
      
      // Check if token has expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        loginUrl.searchParams.set("expired", "true")
        return NextResponse.redirect(loginUrl)
      }
      
      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
