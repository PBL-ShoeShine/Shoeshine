import {
  LayoutDashboard,
  MessageSquareText,
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
  },
  {
    label: "Profil Saya",
    href: "/profile",
    icon: User,
  },
  {
    label: "Data Pengguna",
    href: "/users",
    icon: Users,
  },
  {
    label: "Daftar Toko",
    href: "/stores",
    icon: Store,
  },
  {
    label: "Verifikasi Pendaftaran",
    href: "/verification",
    icon: ShieldCheck,
  },
  {
    label: "Review",
    href: "/reviews",
    icon: MessageSquareText,
  },
];
