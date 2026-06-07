"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { clearAuth, getUser, isAuthenticated } from "@/lib/auth";

const shopRegistrationRoutes = ["/store-registration"];
const superadminRoutes = [
  "/dashboard",
  "/profile",
  "/users",
  "/stores",
  "/verification",
  "/reviews",
  "/superadmin/shop-appeals",
];

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const user = getUser();
    const role = user?.jenis_role || user?.role;
    const pathname = window.location.pathname;

    if (role === "staff") {
      clearAuth();
      router.replace("/login");
      return;
    }

    if (role === "shops_admin" && user?.shop?.status_verifikasi === "suspended") {
      router.replace("/suspended");
      return;
    }

    if (
      ["customer", "shops_admin"].includes(role) &&
      !shopRegistrationRoutes.some((route) => pathname.startsWith(route))
    ) {
      router.replace("/store-registration");
      return;
    }

    if (role === "superadmin" && !superadminRoutes.some((route) => pathname.startsWith(route))) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f3f7ff]">
      <Sidebar />
      <div className="min-h-screen md:pl-[280px]">
        <Navbar />
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
