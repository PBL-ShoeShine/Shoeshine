"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import StoreDetailCard, { StatusBadge } from "@/components/stores/StoreDetailCard";
import StoreOrdersTable from "@/components/stores/StoreOrdersTable";
import StoreServicesTable from "@/components/stores/StoreServicesTable";
import { getStoreDetail } from "@/services/store.service";

export default function StoreDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStoreDetail(id);
        setStore(response?.data || null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat detail toko.",
        );
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <button
        type="button"
        onClick={() => router.push("/stores")}
        className="mb-5 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        Kembali ke Daftar Toko
      </button>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-blue-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500 shadow-sm">
          Memuat detail toko...
        </div>
      ) : null}

      {!loading && !store && !error ? (
        <div className="rounded-xl border border-blue-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500 shadow-sm">
          Detail toko tidak ditemukan.
        </div>
      ) : null}

      {store ? (
        <div className="space-y-6">
          <header className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {store.nm_toko || "-"}
                </h1>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  {store.store_code}
                </p>
              </div>
              <StatusBadge status={store.status_verifikasi} />
            </div>
          </header>

          <StoreDetailCard store={store} />
          <StoreServicesTable services={store.services || []} />
          <StoreOrdersTable orders={store.orders || []} />
        </div>
      ) : null}
    </div>
  );
}
