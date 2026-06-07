import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({ open, user, loading, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4">
      <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 text-center shadow-xl shadow-blue-100/70">
        <button
          type="button"
          onClick={onClose}
          className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mx-auto mt-1 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#263238]">
          Yakin ingin menghapus pengguna ini?
        </h2>
        <p className="mt-2 text-sm font-medium text-[#6b7280]">
          {user?.nama || user?.email || "Pengguna"} akan dihapus dari sistem.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-11 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
