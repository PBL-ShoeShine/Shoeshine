"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  nama: "",
  username: "",
  email: "",
  no_hp: "",
  jenis_role: "customer",
  password: "",
};

const roles = ["customer", "admin_toko", "staff"];

export default function UserFormModal({ open, mode, user, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!open) return;

      setError("");
      setForm(
        user
          ? {
              nama: user.nama || "",
              username: user.username || "",
              email: user.email || "",
              no_hp: user.no_hp || "",
              jenis_role: user.jenis_role || "customer",
              password: "",
            }
          : emptyForm,
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open, user]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!form.username.trim()) {
      setError("Username wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!form.jenis_role) {
      setError("Role wajib dipilih.");
      return;
    }

    if (mode === "create" && !form.password.trim()) {
      setError("Password wajib diisi saat tambah pengguna.");
      return;
    }

    const payload = {
      nama: form.nama.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      no_hp: form.no_hp.trim(),
      jenis_role: form.jenis_role,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    onSubmit(payload);
  };

  const selectableRoles = mode === "create" ? ["customer"] : roles;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/70"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#263238]">
              {mode === "create" ? "Tambah Pembeli" : "Edit Pengguna"}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#6b7280]">
              Lengkapi informasi akun pengguna ShoeShine.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Nama Lengkap
            </span>
            <input
              value={form.nama}
              onChange={(event) => handleChange("nama", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Username
            </span>
            <input
              value={form.username}
              onChange={(event) => handleChange("username", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Nomor HP
            </span>
            <input
              value={form.no_hp}
              onChange={(event) => handleChange("no_hp", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Role
            </span>
            <select
              value={form.jenis_role}
              onChange={(event) => handleChange("jenis_role", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
            >
              {selectableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Password
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder={mode === "create" ? "Wajib diisi" : "Opsional"}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-lg bg-[#0f172a] px-5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
