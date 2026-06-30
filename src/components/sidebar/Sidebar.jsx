"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { sidebarMenu } from "@/data/sidebarMenu";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import { Store, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("superadmin");
  const [hasPendingShop, setHasPendingShop] = useState(false);

  const updateUserState = () => {
    const user = getUser();
    const userRole = user?.jenis_role || user?.role;
    if (userRole) {
      setRole(userRole);
    }
    setHasPendingShop(!!user?.has_pending_shop);
  };

  useEffect(() => {
    updateUserState();

    // Listen for storage events to detect role/shop changes
    const handleStorage = () => updateUserState();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const menuItems = (() => {
    if (role === "customer" && hasPendingShop) {
      return [
        {
          label: "Toko Saya",
          href: "/toko-saya",
          icon: Store,
        },
        {
          label: "Profil Saya",
          href: "/profile",
          icon: User,
        },
      ];
    }
    if (role === "customer") {
      return [
        {
          label: "Daftar Toko Baru",
          href: "/daftar-toko",
          icon: Store,
        },
        {
          label: "Profil Saya",
          href: "/profile",
          icon: User,
        },
      ];
    }
    if (role === "shops_admin") {
      return [
        {
          label: "Toko Saya",
          href: "/toko-saya",
          icon: Store,
        },
        {
          label: "Profil Saya",
          href: "/profile",
          icon: User,
        },
      ];
    }
    return sidebarMenu;
  })();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] bg-[#3f83f8] md:flex md:flex-col">
      <SidebarHeader role={role} />
      <nav className="flex flex-1 flex-col gap-2 px-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          />
        ))}
      </nav>
      <div className="px-6 py-6 text-xs font-medium text-blue-100">
        ShoeShine / CareKicks
      </div>
    </aside>
  );
}
