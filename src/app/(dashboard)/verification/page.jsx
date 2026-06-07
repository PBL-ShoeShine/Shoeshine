"use client";

import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getShopVerifications } from "@/services/registration.service";

const LIMIT = 10;
const statusOptions = ["pending", "approved", "rejected", "all"];

export default function VerificationPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const response = await getShopVerifications({
          status,
          search: debouncedSearch,
          page,
          limit: LIMIT,
        });
        const data = response?.data || {};

        if (!active) return;
        setShops(data.shops || []);
        setPagination(data.pagination || { page, limit: LIMIT, total: 0, totalPages: 1 });
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || "Gagal memuat data verifikasi.");
        setShops([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [debouncedSearch, page, status]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Verifikasi Pendaftaran</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Tinjau pendaftaran toko dari customer.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <label className="flex h-12 w-full items-center gap-3 rounded-lg bg-slate-100 px-4 md:max-w-md">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama toko atau spesialisasi..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none"
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-t border-slate-200 text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-bold">Toko</th>
                <th className="px-5 py-3 font-bold">Pemilik</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
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
                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      <p>{shop.owner?.nama || shop.owner?.username || "-"}</p>
                      <p className="mt-1 text-xs text-slate-400">{shop.owner?.email || "-"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                        {shop.status_verifikasi}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/verification/${shop.id_shops}`)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
                    Tidak ada data verifikasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm font-semibold text-slate-600">
          <span>
            {pagination.total} data
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="h-9 rounded-lg border border-slate-200 px-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="h-9 rounded-lg border border-slate-200 px-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
