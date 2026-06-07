"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, FileImage, Store, Upload, XCircle } from "lucide-react";
import { getMyStoreRegistration, registerStore } from "@/services/registration.service";

const initialForm = {
  nm_toko: "",
  spesialisasi: "",
  desk_toko: "",
  foto_ktp: null,
  foto_toko: null,
};

const statusClass = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export default function StoreRegistrationPage() {
  const [registration, setRegistration] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRegistration = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyStoreRegistration();
      setRegistration(response?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memuat status pendaftaran.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadRegistration();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadRegistration]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await registerStore(form);
      setRegistration(response?.data || null);
      setForm(initialForm);
      setMessage("Pendaftaran toko berhasil dikirim.");
      await loadRegistration();
    } catch (err) {
      const responseData = err?.response?.data;
      setError(responseData?.message || err?.message || "Gagal mengirim pendaftaran toko.");
      if (responseData?.data) {
        setRegistration(responseData.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const status = String(registration?.status_verifikasi || "").toLowerCase();
  const hasRegistration = Boolean(registration);
  const canRegister = !hasRegistration;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[1fr_360px]">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-100 text-blue-700">
            <Store className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pendaftaran Toko</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Ajukan toko baru untuk diverifikasi SuperAdmin.
            </p>
          </div>
        </div>

        {message ? (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <XCircle className="h-5 w-5" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-slate-500">
            Memuat data pendaftaran...
          </div>
        ) : canRegister ? (
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Nama toko</span>
              <input
                value={form.nm_toko}
                onChange={(event) => handleChange("nm_toko", event.target.value)}
                className="h-12 rounded-lg border border-slate-200 px-4 text-sm font-medium outline-none focus:border-blue-400"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Spesialisasi layanan</span>
              <input
                value={form.spesialisasi}
                onChange={(event) => handleChange("spesialisasi", event.target.value)}
                className="h-12 rounded-lg border border-slate-200 px-4 text-sm font-medium outline-none focus:border-blue-400"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Deskripsi toko</span>
              <textarea
                value={form.desk_toko}
                onChange={(event) => handleChange("desk_toko", event.target.value)}
                className="min-h-32 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-blue-400"
                required
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <FileInput
                label="Upload KTP pemilik"
                file={form.foto_ktp}
                onChange={(file) => handleChange("foto_ktp", file)}
              />
              <FileInput
                label="Upload foto toko"
                file={form.foto_toko}
                onChange={(file) => handleChange("foto_toko", file)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#3f83f8] px-5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 md:w-fit"
            >
              <Upload className="h-5 w-5" aria-hidden="true" />
              {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
            </button>
          </form>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">
              Kamu sudah memiliki data pendaftaran toko. Pengajuan baru tidak tersedia untuk status saat ini.
            </p>
          </div>
        )}
      </section>

      <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Status Pendaftaran</h2>
        {registration ? (
          <div className="mt-5 space-y-4">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusClass[status] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
              {registration.status_verifikasi}
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">{registration.nm_toko}</p>
              <p className="mt-1 text-sm text-slate-500">{registration.spesialisasi}</p>
            </div>
            <div className="text-sm text-slate-600">
              <p className="leading-6">{registration.desk_toko}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm font-medium text-slate-500">
            Belum ada pendaftaran toko.
          </p>
        )}
      </aside>
    </div>
  );
}

function FileInput({ label, file, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="flex min-h-12 items-center gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600">
        <FileImage className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{file?.name || "Pilih file gambar"}</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
          required
        />
      </span>
    </label>
  );
}
