import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const status = session?.user?.status;

  // 1. Run next-intl middleware first to check for locale redirects
  const response = intlMiddleware(req);
  if (response.status >= 300) {
    return response;
  }

  // 2. Normalize pathname by stripping locale prefix for auth routing checks
  const segments = pathname.split("/");
  const hasLocale = segments[1] === "en" || segments[1] === "ru";
  const normalizedPathname = hasLocale ? "/" + segments.slice(2).join("/") : pathname;

  // Rejected users can only see public pages and the rejected page
  if (status === "REJECTED" && !normalizedPathname.startsWith("/auth/rejected")) {
    return NextResponse.redirect(new URL("/auth/rejected", req.url));
  }

  const protectedRoutes = ["/mentor/register", "/mentor/profile"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some((r) => normalizedPathname.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => normalizedPathname.startsWith(r));

  if ((isProtectedRoute || isAdminRoute) && !session) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Pending users cannot access restricted routes
  if (status === "PENDING" && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/auth/pending", req.url));
  }

  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return response;
});

export const config = {
  // Match only internationalized pathnames and auth/admin routes
  matcher: [
    "/",
    "/(ru|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/mentor/register",
    "/mentor/profile",
    "/admin/:path*",
    "/auth/rejected",
  ],
};
