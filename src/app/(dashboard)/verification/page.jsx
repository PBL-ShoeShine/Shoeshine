"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldAlert, Sparkles, Scale } from "lucide-react";
import { getStores, verifyStore } from "@/services/store.service";

const parseAlasanPenangguhan = (text) => {
  if (!text) return { reasonText: "", proofUrl: null };
  const marker = " | Bukti: ";
  const index = text.indexOf(marker);
  if (index !== -1) {
    const reasonText = text.substring(0, index);
    const proofUrl = text.substring(index + marker.length).trim();
    return { reasonText, proofUrl };
  }
  return { reasonText: text, proofUrl: null };
};

export default function VerificationPage() {
  const [pendingStores, setPendingStores] = useState([]);
  const [appealedStores, setAppealedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "appealed"

  const [rejectModal, setRejectModal] = useState({
    open: false,
    storeId: null,
    storeName: "",
    reason: "",
    type: "registration" // "registration" or "appeal"
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      setError("");
      const [pendingRes, appealedRes] = await Promise.all([
        getStores({ status: "pending", limit: 100 }),
        getStores({ status: "appealed", limit: 100 })
      ]);
      setPendingStores(pendingRes?.data?.shops || []);
      setAppealedStores(appealedRes?.data?.shops || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationData();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      setSubmitting(true);
      await verifyStore(id, { status_verifikasi: "approved" });
      showSuccess(`Pendaftaran toko "${name}" telah disetujui.`);
      await loadVerificationData();
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || "Gagal menyetujui pendaftaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveAppeal = async (id, name) => {
    try {
      setSubmitting(true);
      await verifyStore(id, { status_verifikasi: "approved" });
      showSuccess(`Banding toko "${name}" diterima. Toko telah diaktifkan kembali.`);
      await loadVerificationData();
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || "Gagal menerima banding.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectClick = (id, name, type = "registration") => {
    setRejectModal({
      open: true,
      storeId: id,
      storeName: name,
      reason: "",
      type
    });
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModal.reason.trim()) {
      showError("Alasan penolakan wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      if (rejectModal.type === "registration") {
        await verifyStore(rejectModal.storeId, {
          status_verifikasi: "rejected",
          alasan_penangguhan: rejectModal.reason.trim()
        });
        showSuccess(`Pendaftaran toko "${rejectModal.storeName}" telah ditolak.`);
      } else {
        await verifyStore(rejectModal.storeId, {
          status_verifikasi: "suspended",
          alasan_penangguhan: rejectModal.reason.trim()
        });
        showSuccess(`Banding toko "${rejectModal.storeName}" ditolak. Toko tetap ditangguhkan.`);
      }
      setRejectModal({ open: false, storeId: null, storeName: "", reason: "", type: "registration" });
      await loadVerificationData();
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || "Gagal memproses penolakan.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStores = activeTab === "pending" ? pendingStores : appealedStores;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-[#3b82f6]" />
            Verifikasi Platform
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Tinjau pendaftaran toko baru dan permohonan banding dari outlet yang ditangguhkan.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === "pending"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Pendaftaran Baru ({pendingStores.length})
          </button>
          <button
            onClick={() => setActiveTab("appealed")}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === "appealed"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Banding Penangguhan ({appealedStores.length})
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {successMsg && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 flex items-center gap-2 animate-fade-in">
          <Check className="h-4 w-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 flex items-center gap-2 animate-fade-in">
          <X className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-blue-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500 shadow-sm">
          Memuat data verifikasi...
        </div>
      ) : currentStores.length === 0 ? (
        <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-5 py-12 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Semua Bersih!</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {activeTab === "pending"
              ? "Tidak ada pendaftaran toko baru yang menunggu persetujuan."
              : "Tidak ada permohonan banding penangguhan toko saat ini."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {currentStores.map((shop) => (
            <div key={shop.id_shops} className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{shop.nm_toko}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{shop.store_code}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      activeTab === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {activeTab === "pending" ? "Pending" : "Banding"}
                  </span>
                </div>

                <div className="space-y-3 my-4 text-sm text-slate-700">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Pemilik</span>
                    <span className="font-semibold text-slate-900">{shop.owner?.nama || "-"}</span>
                    <span className="text-xs text-slate-500 block">{shop.owner?.email || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Alamat</span>
                    <span className="font-semibold text-slate-800">{shop.alamat_toko || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Spesialisasi</span>
                    <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 mt-1">
                      {shop.spesialisasi || "-"}
                    </span>
                  </div>
                  {activeTab === "appealed" && shop.alasan_penangguhan && (() => {
                    const { reasonText, proofUrl } = parseAlasanPenangguhan(shop.alasan_penangguhan);
                    return (
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 mt-2 text-xs space-y-2">
                        <span className="font-bold text-red-600 block">Detail Penangguhan & Banding:</span>
                        <p className="font-semibold text-slate-700">{reasonText}</p>
                        {proofUrl && (
                          <div className="mt-2">
                            <span className="font-bold text-blue-600 block mb-1">Foto Bukti Banding:</span>
                            <img src={proofUrl} alt="Bukti Banding" className="max-h-48 w-full object-cover rounded-lg border border-slate-200" />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
                  {shop.foto_toko && (
                    <div className="text-center animate-fade-in">
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Foto Toko</span>
                      <img src={shop.foto_toko} alt="Foto Toko" className="h-28 w-full object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                  {shop.foto_ktp && (
                    <div className="text-center animate-fade-in">
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Foto KTP</span>
                      <img src={shop.foto_ktp} alt="Foto KTP" className="h-28 w-full object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                {activeTab === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRejectClick(shop.id_shops, shop.nm_toko, "registration")}
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-red-200 text-red-600 font-bold text-sm bg-red-50/20 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(shop.id_shops, shop.nm_toko)}
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Setujui
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRejectClick(shop.id_shops, shop.nm_toko, "appeal")}
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-red-200 text-red-600 font-bold text-sm bg-red-50/20 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Tolak Banding
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveAppeal(shop.id_shops, shop.nm_toko)}
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Terima Banding
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject/Suspension Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4">
          <form onSubmit={handleRejectSubmit} className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {rejectModal.type === "registration" ? "Tolak Pendaftaran" : "Tolak Banding Toko"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Toko: <span className="font-semibold text-slate-700">{rejectModal.storeName}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, storeId: null, storeName: "", reason: "", type: "registration" })}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="block mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alasan Penolakan</span>
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal(m => ({ ...m, reason: e.target.value }))}
                rows={4}
                required
                placeholder={
                  rejectModal.type === "registration"
                    ? "Tulis alasan pendaftaran toko ditolak..."
                    : "Tulis alasan mengapa permohonan banding ditolak..."
                }
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-red-400 focus:bg-white"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, storeId: null, storeName: "", reason: "", type: "registration" })}
                className="h-11 px-5 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-5 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition disabled:opacity-50"
              >
                {rejectModal.type === "registration" ? "Tolak Kemitraan" : "Tolak Permohonan Banding"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
