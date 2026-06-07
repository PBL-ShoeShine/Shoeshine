"use client";

import { useMemo, useSyncExternalStore } from "react";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";

const pageTitles = {
  "/dashboard": "Dashboard Statistik",
  "/profile": "Profil Saya",
  "/users": "Data Pengguna",
  "/stores": "Daftar Toko",
  "/verification": "Verifikasi Pendaftaran",
  "/reviews": "Review",
};

const subscribeToStorage = (callback) => {
  window.addEventListener("storage", callback);

  return () => window.removeEventListener("storage", callback);
};

const getUserSnapshot = () => localStorage.getItem("user");
const getServerUserSnapshot = () => null;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToStorage,
    getUserSnapshot,
    getServerUserSnapshot,
  );
  const user = useMemo(() => {
    if (!userSnapshot) return null;

    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
          {pageTitles[pathname] || "Dashboard Statistik"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Ringkasan operasional SuperAdmin</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-slate-900">
            {user?.name || user?.username || "SuperAdmin"}
          </p>
          <p className="text-xs font-medium text-slate-500">
            {user?.email || "admin@shoeshine.id"}
          </p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#3f83f8] text-sm font-bold text-white shadow-sm">
          SA
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
