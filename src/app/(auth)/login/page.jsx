"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { isAuthenticated, saveAuth, clearAuth, getUser } from "@/lib/auth";

function normalizeLoginResponse(data) {
  const token = data?.token || data?.accessToken || data?.data?.token || data?.data?.accessToken;
  const user = data?.user || data?.data?.user || data?.data || {};

  return { token, user };
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStaffBlocked, setIsStaffBlocked] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      const role = user?.jenis_role || user?.role || user?.role_name || user?.user?.role;
      if (role?.toLowerCase() === "staff") {
        setIsStaffBlocked(true);
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email: identifier,
        username: identifier,
        password,
      };
      const response = await login(payload);
      const { token, user } = normalizeLoginResponse(response);
      const role = user?.jenis_role || user?.role || user?.role_name || user?.user?.role;

      if (!token) {
        throw new Error("Token login tidak ditemukan dari response backend.");
      }

      saveAuth(token, user);

      if (role?.toLowerCase() === "staff") {
        setIsStaffBlocked(true);
        return;
      }

      if (role === "customer" && user?.has_pending_shop) {
        window.location.replace("/toko-saya");
      } else if (role === "customer") {
        window.location.replace("/daftar-toko");
      } else if (role === "shops_admin") {
        window.location.replace("/toko-saya");
      } else {
        window.location.replace("/dashboard");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login gagal. Periksa email/username dan password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setIsStaffBlocked(false);
    setIdentifier("");
    setPassword("");
    setError("");
  };

  if (isStaffBlocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f7ff] px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-xl shadow-red-100/70 text-center">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-sm animate-bounce">
              <LockKeyhole className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Akses Ditolak</h1>
            <p className="mt-4 text-base font-semibold text-red-600 bg-red-50 py-3 px-4 rounded-xl border border-red-200">
              Web ini tidak bisa diakses oleh Anda
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 h-12 w-full rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            Logout
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f7ff] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#3f83f8] text-white shadow-sm">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-900">ShoeShine Admin</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Masuk ke workspace SuperAdmin CareKicks
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Email atau Username</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="admin@shoeshine.id"
                autoComplete="username"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Password</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <LockKeyhole className="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
            </span>
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#3f83f8] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
