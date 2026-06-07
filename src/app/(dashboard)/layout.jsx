"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
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
