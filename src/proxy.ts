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
  const hasLocale = (routing.locales as readonly string[]).includes(segments[1]);
  const locale = hasLocale ? segments[1] : routing.defaultLocale;
  const normalizedPathname = hasLocale ? "/" + segments.slice(2).join("/") : pathname;

  // Build a redirect URL that preserves the visitor's current locale
  // (the default locale has no prefix under localePrefix: 'as-needed')
  const localizedUrl = (path: string) => {
    if (locale === routing.defaultLocale) {
      return new URL(path, req.url);
    }
    return new URL(path === "/" ? `/${locale}` : `/${locale}${path}`, req.url);
  };

  // Rejected users can only see public pages and the rejected page
  if (status === "REJECTED" && !normalizedPathname.startsWith("/auth/rejected")) {
    return NextResponse.redirect(localizedUrl("/auth/rejected"));
  }

  const protectedRoutes = ["/mentor/register", "/mentor/profile"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some((r) => normalizedPathname.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => normalizedPathname.startsWith(r));

  if ((isProtectedRoute || isAdminRoute) && !session) {
    const signInUrl = localizedUrl("/auth/signin");
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Pending users cannot access restricted routes
  if (status === "PENDING" && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(localizedUrl("/auth/pending"));
  }

  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(localizedUrl("/"));
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
