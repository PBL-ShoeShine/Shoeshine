"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Loader2,
  Search,
  ShieldAlert,
  Store,
  User,
  X,
  XCircle,
} from "lucide-react";
import {
  approveShopAppeal,
  getSuperadminShopAppealDetail,
  getSuperadminShopAppeals,
  rejectShopAppeal,
} from "@/services/shopAppeal.service";

const FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Disetujui", value: "approved" },
  { label: "Ditolak", value: "rejected" },
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function ShopAppealsPage() {
  const [appeals, setAppeals] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadAppeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSuperadminShopAppeals({
        status,
        search: debouncedSearch,
      });
      setAppeals(response?.data || []);
    } catch (error) {
      setToast({
        type: "error",
        message: error?.response?.data?.message || "Gagal memuat pengajuan banding.",
      });
      setAppeals([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAppeals();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadAppeals]);

  const openDetail = async (appealId) => {
    try {
      setDetailLoading(true);
      setRejecting(false);
      setConfirmApprove(false);
      setRejectionReason("");
      const response = await getSuperadminShopAppealDetail(appealId);
      setSelectedAppeal(response?.data || null);
    } catch (error) {
      setToast({
        type: "error",
        message: error?.response?.data?.message || "Gagal memuat detail banding.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshDetail = async (id) => {
    const response = await getSuperadminShopAppealDetail(id);
    setSelectedAppeal(response?.data || null);
  };

  const handleApprove = async () => {
    if (!selectedAppeal) return;

    try {
      setProcessing(true);
      await approveShopAppeal(selectedAppeal.id_appeal);
      await refreshDetail(selectedAppeal.id_appeal);
      await loadAppeals();
      setToast({ type: "success", message: "Banding disetujui dan toko sudah dipulihkan." });
      setConfirmApprove(false);
    } catch (error) {
      setToast({
        type: "error",
        message: error?.response?.data?.message || "Gagal menyetujui banding.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAppeal) return;

    if (rejectionReason.trim().length < 10) {
      setToast({ type: "error", message: "Alasan penolakan minimal 10 karakter." });
      return;
    }

    try {
      setProcessing(true);
      await rejectShopAppeal(selectedAppeal.id_appeal, rejectionReason.trim());
      await refreshDetail(selectedAppeal.id_appeal);
      await loadAppeals();
      setRejecting(false);
      setRejectionReason("");
      setToast({ type: "success", message: "Banding berhasil ditolak." });
    } catch (error) {
      setToast({
        type: "error",
        message: error?.response?.data?.message || "Gagal menolak banding.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const currentRows = useMemo(() => appeals || [], [appeals]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
     
      </div>

      {toast ? (
        <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {toast.message}
        </div>
      ) : null}

      <section className="rounded-xl border-4 border-blue-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`h-10 rounded-lg border px-4 text-sm font-bold transition ${status === filter.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className="flex h-12 w-full items-center gap-3 rounded-lg bg-slate-100 px-4 lg:max-w-md">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama toko atau email admin"
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-t border-slate-100 text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Nama Toko</th>
                <th className="px-5 py-4">Email Admin</th>
                <th className="px-5 py-4">Status Banding</th>
                <th className="px-5 py-4">Tanggal Pengajuan</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="px-5 py-3">
                      <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : currentRows.length ? (
                currentRows.map((appeal) => (
                  <tr key={appeal.id_appeal} className="text-sm">
                    <td className="px-5 py-4 font-bold text-slate-800">{appeal.shop?.nm_toko || "-"}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{appeal.admin_toko?.email || "-"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[appeal.status] || statusStyles.pending}`}>
                        {statusLabels[appeal.status] || appeal.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{formatDate(appeal.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(appeal.id_appeal)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#3f83f8] px-3 text-xs font-bold text-white transition hover:bg-blue-600"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">
                    Tidak ada pengajuan banding.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {(selectedAppeal || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 px-4 py-8">
          <section className="w-full max-w-5xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Detail Banding</h2>
              <button
                type="button"
                onClick={() => setSelectedAppeal(null)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Tutup detail"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {detailLoading ? (
              <div className="grid min-h-80 place-items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-hidden="true" />
              </div>
            ) : selectedAppeal ? (
              <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.25fr]">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {selectedAppeal.shop?.foto_toko ? (
                      <img src={selectedAppeal.shop.foto_toko} alt={selectedAppeal.shop?.nm_toko || "Foto toko"} className="h-56 w-full object-cover" />
                    ) : (
                      <div className="grid h-56 place-items-center text-slate-400">
                        <Store className="h-12 w-12" aria-hidden="true" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-900">{selectedAppeal.shop?.nm_toko || "-"}</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{selectedAppeal.shop?.alamat_toko || "-"}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <User className="h-4 w-4 text-blue-500" aria-hidden="true" />
                      Admin Toko
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{selectedAppeal.admin_toko?.nama || "-"}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{selectedAppeal.admin_toko?.email || "-"}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{selectedAppeal.admin_toko?.no_hp || "-"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-red-700">
                      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                      Penangguhan awal
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-6 text-red-800">
                      {selectedAppeal.shop?.alasan_penangguhan || "Tidak ada alasan penangguhan aktif."}
                    </p>
                    <p className="mt-2 text-xs font-bold text-red-600">
                      Status toko: {selectedAppeal.shop?.status_verifikasi || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[selectedAppeal.status] || statusStyles.pending}`}>
                        {statusLabels[selectedAppeal.status] || selectedAppeal.status}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{formatDate(selectedAppeal.created_at)}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium leading-6 text-slate-700">{selectedAppeal.description}</p>
                  </div>

                  {selectedAppeal.evidence_images?.length ? (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-sm font-bold text-slate-800">Bukti gambar</p>
                      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {selectedAppeal.evidence_images.map((image) => (
                          <button
                            key={image}
                            type="button"
                            onClick={() => setPreviewImage(image)}
                            className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                          >
                            <img src={image} alt="Bukti banding" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedAppeal.rejection_reason ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                      Alasan penolakan: {selectedAppeal.rejection_reason}
                    </div>
                  ) : null}

                  {selectedAppeal.status === "pending" ? (
                    <div className="rounded-xl border border-slate-200 p-4">
                      {confirmApprove ? (
                        <div className="space-y-3">
                          <p className="text-sm font-bold text-slate-800">
                            Setujui banding dan aktifkan kembali toko ini?
                          </p>
                          <p className="text-sm font-medium leading-6 text-slate-500">
                            Status toko akan dipulihkan, alasan penangguhan dikosongkan, dan admin toko mendapat notifikasi.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleApprove}
                              disabled={processing}
                              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                              {processing ? "Memproses..." : "Ya, Setujui"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmApprove(false)}
                              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : rejecting ? (
                        <div className="space-y-3">
                          <label className="block">
                            <span className="text-sm font-bold text-slate-700">Alasan penolakan</span>
                            <textarea
                              value={rejectionReason}
                              onChange={(event) => setRejectionReason(event.target.value)}
                              rows={4}
                              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                              placeholder="Tuliskan alasan penolakan banding."
                            />
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleReject}
                              disabled={processing}
                              className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                              <XCircle className="h-4 w-4" aria-hidden="true" />
                              {processing ? "Memproses..." : "Kirim Penolakan"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejecting(false)}
                              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setRejecting(false);
                              setConfirmApprove(true);
                            }}
                            disabled={processing}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            {processing ? "Memproses..." : "Setujui Banding"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejecting(true)}
                            disabled={processing}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                            Tolak Banding
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      )}

      {previewImage ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/80 p-4" onClick={() => setPreviewImage("")}>
          <img src={previewImage} alt="Preview bukti banding" className="max-h-[88vh] max-w-full rounded-lg object-contain" />
        </div>
      ) : null}
    </div>
  );
}
