"use client";

import { useCallback, useEffect, useState } from "react";
import { EllipsisVertical, Eye, RotateCcw, Search, ShieldAlert, Star } from "lucide-react";
import {
  activateReviewShop,
  getReviewShopDetail,
  getReviewShops,
  suspendReviewShop,
} from "@/services/review.service";

const LIMIT = 10;

const statusLabels = {
  pending: "Pending",
  approved: "Aktif",
  rejected: "Ditolak",
  suspended: "Ditangguhkan",
};

export default function ReviewsPage() {
  const [shops, setShops] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [detailShop, setDetailShop] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getReviewShops({ search: debouncedSearch, page, limit: LIMIT });
      const data = response?.data || {};
      setShops(data.shops || []);
      setPagination(data.pagination || { page, limit: LIMIT, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memuat data review toko.");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadData]);

  const handleSuspend = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await suspendReviewShop(suspendTarget.id_shops, reason);
      setSuspendTarget(null);
      setReason("");
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal menangguhkan toko.");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (shop) => {
    setSaving(true);
    setError("");
    setOpenMenu(null);

    try {
      await activateReviewShop(shop.id_shops);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal mengaktifkan toko.");
    } finally {
      setSaving(false);
    }
  };

  const handleDetail = async (shop) => {
    setDetailLoading(true);
    setError("");
    setOpenMenu(null);

    try {
      const response = await getReviewShopDetail(shop.id_shops);
      setDetailShop(response?.data || shop);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memuat detail toko.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Manajemen Review Toko</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Pantau rating toko dan tangguhkan toko yang perlu ditinjau.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-5">
          <label className="flex h-12 w-full items-center gap-3 rounded-lg bg-slate-100 px-4 md:max-w-md">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari toko..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-t border-slate-200 text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-bold">Nama Toko</th>
                <th className="px-5 py-3 font-bold">Alamat</th>
                <th className="px-5 py-3 font-bold">Total Ulasan</th>
                <th className="px-5 py-3 font-bold">Rating</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : shops.length ? (
                shops.map((shop) => (
                  <tr key={shop.id_shops}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-900">{shop.nm_toko}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{shop.spesialisasi || "-"}</p>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-sm font-medium text-slate-600">
                      {shop.alamat_toko || "-"}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {shop.total_ulasan}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {shop.rata_rata_rating}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={shop.status_verifikasi} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === shop.id_shops ? null : shop.id_shops)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                          aria-label="Aksi toko"
                        >
                          <EllipsisVertical className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {openMenu === shop.id_shops ? (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-lg">
                            <ActionButton icon={Eye} label="Lihat Detail" onClick={() => handleDetail(shop)} />
                            {shop.status_verifikasi === "suspended" ? (
                              <ActionButton icon={RotateCcw} label="Aktifkan Kembali" onClick={() => handleActivate(shop)} />
                            ) : (
                              <ActionButton icon={ShieldAlert} label="Tangguhkan" onClick={() => {
                                setSuspendTarget(shop);
                                setReason("");
                                setOpenMenu(null);
                              }} />
                            )}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
                    Tidak ada toko.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm font-semibold text-slate-600">
          <span>{pagination.total} data</span>
          <div className="flex gap-2">
            <button type="button" disabled={pagination.page <= 1} onClick={() => setPage((current) => Math.max(current - 1, 1))} className="h-9 rounded-lg border border-slate-200 px-3 disabled:cursor-not-allowed disabled:opacity-50">
              Prev
            </button>
            <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)} className="h-9 rounded-lg border border-slate-200 px-3 disabled:cursor-not-allowed disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </section>

      {suspendTarget ? (
        <SuspendModal
          shop={suspendTarget}
          reason={reason}
          saving={saving}
          onReasonChange={setReason}
          onClose={() => setSuspendTarget(null)}
          onSubmit={handleSuspend}
        />
      ) : null}

      {detailLoading ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4">
          <div className="rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-xl">
            Memuat detail...
          </div>
        </div>
      ) : null}

      {detailShop ? (
        <DetailModal shop={detailShop} onClose={() => setDetailShop(null)} />
      ) : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();
  const classes = {
    suspended: "bg-red-50 text-red-700 border-red-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${classes[normalized] || classes.rejected}`}>
      {statusLabels[normalized] || status || "-"}
    </span>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function SuspendModal({ shop, reason, saving, onReasonChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">Tangguhkan Toko</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">{shop.nm_toko}</p>
        <label className="mt-5 grid gap-2">
          <span className="text-sm font-bold text-slate-700">Alasan penangguhan</span>
          <textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            className="min-h-32 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-blue-400"
            required
          />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700">
            Batal
          </button>
          <button type="submit" disabled={saving} className="h-10 rounded-lg bg-red-600 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DetailModal({ shop, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4">
      <section className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">{shop.nm_toko}</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <Info label="Alamat" value={shop.alamat_toko || "-"} />
          <Info label="Admin Toko" value={shop.admin_toko?.nama || shop.admin_toko?.username || "-"} />
          <Info label="Email Admin" value={shop.admin_toko?.email || "-"} />
          <Info label="Total Ulasan" value={shop.total_ulasan} />
          <Info label="Rata-rata Rating" value={shop.rata_rata_rating} />
          <Info label="Status" value={statusLabels[String(shop.status_verifikasi || "").toLowerCase()] || shop.status_verifikasi || "-"} />
          {shop.status_verifikasi === "suspended" ? (
            <Info label="Alasan Penangguhan" value={shop.alasan_penangguhan || "-"} />
          ) : null}
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="h-10 rounded-lg bg-[#3f83f8] px-4 text-sm font-bold text-white">
            Tutup
          </button>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
