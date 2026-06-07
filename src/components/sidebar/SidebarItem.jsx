"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SidebarItem({ item, active }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-blue-50 hover:bg-white/15 hover:text-white",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
