import {
  LayoutDashboard,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Store,
  User,
  Users,
} from "lucide-react";

export const sidebarMenu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["superadmin"],
  },
  {
    label: "Profil Saya",
    href: "/profile",
    icon: User,
    roles: ["superadmin"],
  },
  {
    label: "Data Pengguna",
    href: "/users",
    icon: Users,
    roles: ["superadmin"],
  },
  {
    label: "Daftar Toko",
    href: "/stores",
    icon: Store,
    roles: ["superadmin"],
  },
  {
    label: "Verifikasi Pendaftaran",
    href: "/verification",
    icon: ShieldCheck,
    roles: ["superadmin"],
  },
  {
    label: "Pendaftaran Toko",
    href: "/store-registration",
    icon: Store,
    roles: ["customer", "shops_admin"],
  },
  {
    label: "Review",
    href: "/reviews",
    icon: MessageSquareText,
    roles: ["superadmin"],
  },
  {
    label: "Banding Toko",
    href: "/superadmin/shop-appeals",
    icon: RotateCcw,
    roles: ["superadmin"],
  },
];
