import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const status = session?.user?.status;

  // Rejected users can only see public pages and the rejected page
  if (status === "REJECTED" && !pathname.startsWith("/auth/rejected")) {
    return NextResponse.redirect(new URL("/auth/rejected", req.url));
  }

  const protectedRoutes = ["/mentor/register", "/mentor/profile"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));

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

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/mentor/register",
    "/mentor/profile",
    "/admin/:path*",
    "/auth/rejected",
  ],
};
