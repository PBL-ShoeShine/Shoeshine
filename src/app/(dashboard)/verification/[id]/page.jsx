"use client";

import { use, useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getShopVerificationDetail,
  updateShopVerificationStatus,
} from "@/services/registration.service";

export default function VerificationDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getShopVerificationDetail(id);
      setShop(response?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memuat detail verifikasi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadDetail();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDetail]);

  const handleStatus = async (status) => {
    try {
      setSaving(status);
      setError("");
      setMessage("");
      const response = await updateShopVerificationStatus(id, status);
      setShop(response?.data || null);
      setMessage(status === "approved" ? "Toko disetujui dan role customer diperbarui." : "Pendaftaran toko ditolak.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memperbarui status.");
    } finally {
      setSaving("");
    }
  };

  const isPending = String(shop?.status_verifikasi || "").toLowerCase() === "pending";

  return (
    <div className="mx-auto w-full max-w-5xl">
      <button
        type="button"
        onClick={() => router.push("/verification")}
        className="mb-5 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali
      </button>

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-slate-500">
            Memuat detail...
          </div>
        ) : shop ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-5">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                  {shop.status_verifikasi}
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900">{shop.nm_toko}</h1>
                <p className="mt-2 text-sm font-semibold text-slate-500">{shop.spesialisasi}</p>
              </div>

              <div className="grid gap-4 text-sm md:grid-cols-2">
                <InfoBlock label="Pemilik" value={shop.owner?.nama || shop.owner?.username || "-"} />
                <InfoBlock label="Email" value={shop.owner?.email || "-"} />
                <InfoBlock label="No HP" value={shop.owner?.no_hp || "-"} />
              </div>

              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">Deskripsi toko</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{shop.desk_toko || "-"}</p>
              </div>

              {isPending ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={Boolean(saving)}
                    onClick={() => handleStatus("approved")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    {saving === "approved" ? "Menyetujui..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(saving)}
                    onClick={() => handleStatus("rejected")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                    {saving === "rejected" ? "Menolak..." : "Reject"}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <ImagePreview label="Foto toko" src={shop.foto_toko} />
              <ImagePreview label="KTP pemilik" src={shop.foto_ktp} />
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-sm font-semibold text-slate-500">
            Data verifikasi tidak ditemukan.
          </div>
        )}
      </section>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ImagePreview({ label, src }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="mb-3 text-sm font-bold text-slate-700">{label}</p>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="h-48 w-full rounded-lg object-cover" />
      ) : (
        <div className="grid h-48 place-items-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">
          Tidak ada gambar
        </div>
      )}
    </div>
  );
}
