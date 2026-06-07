"use client";

import { useEffect, useState } from "react";
import { LogOut, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuth, getSuspendedShop } from "@/lib/auth";

export default function SuspendedPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShop(getSuspendedShop());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f7ff] px-4 py-10">
      <section className="w-full max-w-lg rounded-xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/60">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-red-50 text-red-600">
          <ShieldAlert className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Toko Ditangguhkan</h1>
        <p className="mt-3 text-lg font-bold text-slate-700">{shop?.nm_toko || "-"}</p>
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-4 text-left">
          <p className="text-xs font-bold uppercase text-red-500">Alasan penangguhan</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-red-800">
            {shop?.alasan_penangguhan || "Toko Anda sedang ditinjau oleh SuperAdmin."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3f83f8] px-5 text-sm font-bold text-white transition hover:bg-blue-600"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Logout
        </button>
      </section>
    </main>
  );
}
