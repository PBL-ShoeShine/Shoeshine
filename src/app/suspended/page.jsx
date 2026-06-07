"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ImagePlus,
  LogOut,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  clearAuth,
  getSuspendedShop,
  getUser,
  isAuthenticated,
  updateAuthShop,
} from "@/lib/auth";
import {
  createShopAppeal,
  getMyShopAppeals,
} from "@/services/shopAppeal.service";

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

export default function SuspendedPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const loadAppeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyShopAppeals();
      const nextShop = response?.data?.shop || getSuspendedShop();
      setShop(nextShop);
      setAppeals(response?.data?.appeals || []);
      if (nextShop) {
        updateAuthShop(nextShop);
      }
    } catch (error) {
      setShop(getSuspendedShop());
      setToast({
        type: "error",
        message:
          error?.response?.data?.message || "Gagal memuat riwayat banding.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const user = getUser();
    if ((user?.jenis_role || user?.role) !== "shops_admin") {
      router.replace("/dashboard");
      return;
    }

    const timer = window.setTimeout(() => {
      loadAppeals();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadAppeals, router]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    setFiles((current) => [...current, ...selected]);
    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setToast(null);

    if (description.trim().length < 20) {
      setToast({ type: "error", message: "Deskripsi minimal 20 karakter." });
      return;
    }

    if (!files.length) {
      setToast({ type: "error", message: "Minimal unggah 1 gambar bukti." });
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 2 * 1024 * 1024,
    );

    if (invalidFile) {
      setToast({
        type: "error",
        message:
          "Bukti harus JPG, PNG, atau WebP dengan ukuran maksimal 2MB per gambar.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("description", description.trim());
    files.forEach((file) => formData.append("evidence_images", file));

    try {
      setSubmitting(true);
      await createShopAppeal(formData);
      setDescription("");
      setFiles([]);
      setToast({
        type: "success",
        message: "Pengajuan banding berhasil dikirim.",
      });
      await loadAppeals();
    } catch (error) {
      setToast({
        type: "error",
        message:
          error?.response?.data?.message || "Gagal mengirim pengajuan banding.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasPending = appeals.some((appeal) => appeal.status === "pending");
  const isRestored =
    Boolean(shop) &&
    String(shop?.status_verifikasi || "").toLowerCase() !== "suspended";

  return (
    <main className="min-h-screen bg-[#f3f7ff] px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <section className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Toko Ditangguhkan
          </h1>
          <p className="mt-2 text-lg font-bold text-slate-700">
            {shop?.nm_toko || "-"}
          </p>

          <div className="mt-5 space-y-4 rounded-lg border border-red-100 bg-red-50 px-4 py-4">
            <div>
              <p className="text-xs font-bold uppercase text-red-500">
                Alasan penangguhan
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-red-800">
                {shop?.alasan_penangguhan ||
                  "Toko Anda sedang ditinjau oleh SuperAdmin."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {formatDate(shop?.suspended_at)}
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Deskripsi permohonan banding
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                placeholder="Jelaskan alasan permohonan pemulihan toko secara lengkap."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </label>

            {!previews.length ? (
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-5 text-center transition hover:bg-blue-50">
                <ImagePlus
                  className="h-7 w-7 text-blue-500"
                  aria-hidden="true"
                />
                <span className="mt-2 text-sm font-bold text-slate-700">
                  Upload bukti gambar
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  JPG, PNG, WebP. Maksimal 2MB per gambar.
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFiles}
                  className="hidden"
                />
              </label>
            ) : null}

            {previews.length ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-700">
                    {previews.length} gambar dipilih
                  </p>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    Tambah gambar
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFiles}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((preview, index) => (
                    <div
                      key={`${preview.file.name}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={preview.url}
                        alt={preview.file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-slate-700 shadow-sm"
                        aria-label="Hapus gambar"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {isRestored ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                Toko sudah dipulihkan. Anda dapat kembali ke dashboard.
              </div>
            ) : null}

            {toast ? (
              <div
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
              >
                {toast.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting || hasPending || isRestored}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#3f83f8] px-5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {submitting
                ? "Mengirim..."
                : hasPending
                  ? "Banding Pending Sedang Diproses"
                  : "Ajukan Banding"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Riwayat Banding
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Status pengajuan terakhir dari Supabase.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-xl bg-slate-100"
                />
              ))
            ) : appeals.length ? (
              appeals.map((appeal) => (
                <article
                  key={appeal.id_appeal}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[appeal.status] || statusStyles.pending}`}
                    >
                      {statusLabels[appeal.status] || appeal.status}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {formatDate(appeal.created_at)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                    {appeal.description}
                  </p>

                  {appeal.evidence_images?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {appeal.evidence_images.map((image) => (
                        <a
                          key={image}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="relative h-18 w-18 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                        >
                          <img
                            src={image}
                            alt="Bukti banding"
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {appeal.status === "rejected" && appeal.rejection_reason ? (
                    <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      Alasan penolakan: {appeal.rejection_reason}
                    </div>
                  ) : null}

                  {appeal.status === "approved" ? (
                    <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      Banding disetujui. Toko sudah dipulihkan.
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
                Belum ada pengajuan banding.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
