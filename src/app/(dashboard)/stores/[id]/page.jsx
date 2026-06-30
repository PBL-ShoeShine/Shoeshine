"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, ShieldAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";
import StoreDetailCard, { StatusBadge } from "@/components/stores/StoreDetailCard";
import StoreOrdersTable from "@/components/stores/StoreOrdersTable";
import StoreServicesTable from "@/components/stores/StoreServicesTable";
import { getStoreDetail, verifyStore } from "@/services/store.service";

export default function StoreDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [suspendModal, setSuspendModal] = useState({
    open: false,
    reason: ""
  });

  const fetchDetail = async () => {
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
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleSuspendSubmit = async (e) => {
    e.preventDefault();
    if (!suspendModal.reason.trim()) {
      alert("Alasan penangguhan wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      await verifyStore(id, {
        status_verifikasi: "suspended",
        alasan_penangguhan: suspendModal.reason.trim()
      });

      setSuspendModal({ open: false, reason: "" });
      await fetchDetail();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Gagal menangguhkan toko.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSuspendable = store && (store.status_verifikasi === "approved" || store.status_verifikasi === "verified");

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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {store.nm_toko || "-"}
                </h1>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  {store.store_code}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={store.status_verifikasi} />
                {isSuspendable && (
                  <button
                    type="button"
                    onClick={() => setSuspendModal({ open: true, reason: "" })}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Suspend Toko
                  </button>
                )}
              </div>
            </div>
          </header>

          <StoreDetailCard store={store} />
          <StoreServicesTable services={store.services || []} />
          <StoreOrdersTable orders={store.orders || []} />
        </div>
      ) : null}

      {/* Suspend Reason Modal */}
      {suspendModal.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4">
          <form onSubmit={handleSuspendSubmit} className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Suspend Toko</h3>
                <p className="text-sm text-slate-500 mt-1">Toko: <span className="font-semibold text-slate-700">{store?.nm_toko}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setSuspendModal({ open: false, reason: "" })}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="block mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alasan Penangguhan</span>
              <textarea
                value={suspendModal.reason}
                onChange={(e) => setSuspendModal(m => ({ ...m, reason: e.target.value }))}
                rows={4}
                required
                placeholder="Tulis alasan mengapa toko ini ditangguhkan..."
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-red-400 focus:bg-white"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSuspendModal({ open: false, reason: "" })}
                className="h-11 px-5 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-5 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition disabled:opacity-50"
              >
                Suspend Toko
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
