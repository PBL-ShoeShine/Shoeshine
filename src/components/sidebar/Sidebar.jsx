"use client";

import { usePathname } from "next/navigation";
import { sidebarMenu } from "@/data/sidebarMenu";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] bg-[#3f83f8] md:flex md:flex-col">
      <SidebarHeader />
      <nav className="flex flex-1 flex-col gap-2 px-4">
        {sidebarMenu.map((item) => (
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
