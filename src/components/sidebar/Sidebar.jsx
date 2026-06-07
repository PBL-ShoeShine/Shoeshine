"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sidebarMenu } from "@/data/sidebarMenu";
import { getUser } from "@/lib/auth";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const items = role
    ? sidebarMenu.filter((item) => !item.roles || item.roles.includes(role))
    : [];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const user = getUser();
      setRole(user?.jenis_role || user?.role || null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] bg-[#3f83f8] md:flex md:flex-col">
      <SidebarHeader role={role} />
      <nav className="flex flex-1 flex-col gap-2 px-4">
        {items.map((item) => (
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
