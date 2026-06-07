import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/users",
  "/stores",
  "/store-registration",
  "/verification",
  "/reviews",
  "/superadmin/shop-appeals",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const shopStatus = request.cookies.get("shop_status")?.value;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && token) {
    if (role === "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (role === "customer" || role === "shops_admin") {
      return NextResponse.redirect(new URL("/store-registration", request.url));
    }
  }

  if (
    token &&
    role === "shops_admin" &&
    shopStatus === "suspended" &&
    pathname !== "/suspended"
  ) {
    return NextResponse.redirect(new URL("/suspended", request.url));
  }

  if (
    token &&
    (role === "customer" || role === "shops_admin") &&
    isProtected &&
    pathname !== "/store-registration"
  ) {
    return NextResponse.redirect(new URL("/store-registration", request.url));
  }

  if (token && role === "staff" && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/users/:path*", "/stores/:path*", "/store-registration/:path*", "/verification/:path*", "/reviews/:path*", "/superadmin/shop-appeals/:path*", "/login"],
};
