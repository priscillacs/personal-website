// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /admin
  const isAdminPath = pathname.startsWith("/admin");
  // Exclude the login path from protection
  const isLoginPath = pathname === "/admin/login";

  // Only protect admin paths that aren't the login page
  if (isAdminPath && !isLoginPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If there's no token, redirect to login
    if (!token) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure Middleware to run on specific paths
export const config = {
  matcher: ["/admin/:path*"],
};
