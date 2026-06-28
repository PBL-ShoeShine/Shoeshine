import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/users",
  "/stores",
  "/verification",
  "/reviews",
  "/daftar-toko",
  "/toko-saya",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && role?.toLowerCase() === "staff") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && token && role?.toLowerCase() !== "staff") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/users/:path*",
    "/stores/:path*",
    "/verification/:path*",
    "/reviews/:path*",
    "/daftar-toko/:path*",
    "/toko-saya/:path*",
    "/login"
  ],
};
