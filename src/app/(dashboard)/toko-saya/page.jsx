"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle2, Clock, MapPin, Sparkles, Send, HelpCircle, FileText, Camera } from "lucide-react";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";

export default function TokoSayaPage() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [fotoBukti, setFotoBukti] = useState(null);
  const [fotoBuktiPreview, setFotoBuktiPreview] = useState(null);
  const [submittingAppeal, setSubmittingAppeal] = useState(false);
  const [appealSuccess, setAppealSuccess] = useState("");

  const fetchShopProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/v1/admin/toko/profil");
      setShop(response.data?.data || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Gagal memuat profil toko Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoBukti(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBuktiPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealReason.trim()) {
      alert("Alasan banding wajib diisi");
      return;
    }

    setSubmittingAppeal(true);
    setError("");
    setAppealSuccess("");

    try {
      const formData = new FormData();
      formData.append("alasan_banding", appealReason.trim());
      if (fotoBukti) {
        formData.append("foto_bukti", fotoBukti);
      }

      const response = await api.post("/api/v1/admin/toko/appeal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setAppealSuccess("Pengajuan banding Anda berhasil dikirim!");
        setAppealReason("");
        setFotoBukti(null);
        setFotoBuktiPreview(null);
        // Reload shop profile to reflect appealed status
        await fetchShopProfile();
      } else {
        throw new Error(response.data?.message || "Gagal mengajukan banding.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal mengajukan banding.");
    } finally {
      setSubmittingAppeal(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-blue-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500 shadow-sm">
        Memuat profil toko Anda...
      </div>
    );
  }

  if (error && !shop) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {error}
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-5 py-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Toko tidak ditemukan</h3>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Akun Anda belum terdaftar dengan toko manapun. Hubungi SuperAdmin.
        </p>
      </div>
    );
  }

  const { status_verifikasi, nm_toko, desk_toko, alamat_toko, spesialisasi, jam_buka, jam_tutup, alasan_penangguhan } = shop;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Toko Saya</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Pantau status operasional dan detail informasi toko CareKicks Anda.
        </p>
      </div>

      {/* STATUS BADGE/ALERT COMPONENT */}
      {status_verifikasi === "pending" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
          <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-amber-900">Pendaftaran Menunggu Verifikasi</h3>
            <p className="text-sm font-medium text-amber-700 mt-1">
              Toko <strong>{nm_toko}</strong> sedang ditinjau oleh SuperAdmin. Proses verifikasi biasanya memakan waktu 1-2 hari kerja.
            </p>
          </div>
        </div>
      )}

      {status_verifikasi === "appealed" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 flex items-start gap-4 animate-pulse">
          <HelpCircle className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-blue-900">Banding Sedang Ditinjau</h3>
            <p className="text-sm font-medium text-blue-700 mt-1">
              Anda telah mengajukan banding atas penangguhan toko ini. SuperAdmin sedang meninjau alasan banding Anda.
            </p>
            {alasan_penangguhan && (
              <div className="mt-3 rounded-lg bg-white/70 p-3 border border-blue-100 text-xs font-semibold text-slate-700 space-y-2">
                <span className="font-bold text-slate-600 block">Status Banding Anda:</span>
                <p className="text-slate-800">{alasan_penangguhan}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {status_verifikasi === "suspended" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-900">Toko Ditangguhkan (Suspended)</h3>
              <p className="text-sm font-medium text-red-700 mt-1">
                Toko Anda dinonaktifkan sementara karena pelanggaran aturan atau kebijakan platform.
              </p>
              {alasan_penangguhan && (
                <div className="mt-3 rounded-lg bg-white p-4 border border-red-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500">Alasan Penangguhan</p>
                  <p className="text-sm font-semibold text-red-950 mt-1">{alasan_penangguhan}</p>
                </div>
              )}
            </div>
          </div>

          {/* APPEAL FORM */}
          <form onSubmit={handleAppealSubmit} className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ajukan Banding Toko</h3>
              <p className="text-xs text-slate-500 mt-1">
                Jika Anda merasa ini adalah kesalahan, atau Anda telah memperbaiki masalah yang menyebabkan penangguhan, silakan kirim permohonan banding beserta bukti pendukung.
              </p>
            </div>

            {appealSuccess && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
                {appealSuccess}
              </div>
            )}

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alasan Banding</span>
              <textarea
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                required
                rows={4}
                placeholder="Tulis alasan mengapa toko Anda layak diaktifkan kembali. Lampirkan perbaikan jika ada..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white resize-none"
              />
            </label>

            {/* Foto Bukti */}
            <div className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Foto Bukti / Perbaikan (Opsional)</span>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-4 hover:bg-slate-100/50 transition relative overflow-hidden min-h-70">
                {fotoBuktiPreview ? (
                  <>
                    <img src={fotoBuktiPreview} alt="Preview Foto Bukti" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 grid place-items-center opacity-0 hover:opacity-100 transition duration-200">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
                        <Camera className="h-4 w-4" /> Ubah Foto Bukti
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">Klik untuk upload foto bukti</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingAppeal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3f83f8] px-6 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submittingAppeal ? "Mengirim Banding..." : "Kirim Pengajuan Banding"}
            </button>
          </form>
        </div>
      )}

      {/* ACTIVE / APPROVED STATUS */}
      {(status_verifikasi === "approved" || status_verifikasi === "verified") && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Toko Aktif & Berjalan</h3>
            <p className="text-sm font-medium text-emerald-700 mt-1">
              Toko Anda dalam kondisi baik dan dapat menerima pesanan dari customer CareKicks.
            </p>
          </div>
        </div>
      )}

      {/* STORE DETAILS CARD */}
      <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">{nm_toko}</h2>
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#3b82f6]">
            {spesialisasi}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-700">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Deskripsi Toko</span>
            <span className="font-semibold text-slate-900 mt-1 block">{desk_toko || "-"}</span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Jam Operasional</span>
            <span className="font-semibold text-slate-900 mt-1 block flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              {jam_buka} - {jam_tutup}
            </span>
          </div>

          <div className="md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Alamat Toko</span>
            <span className="font-semibold text-slate-900 mt-1 block flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {alamat_toko || "-"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
