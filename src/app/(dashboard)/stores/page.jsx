"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import StorePagination from "@/components/stores/StorePagination";
import StoreStats from "@/components/stores/StoreStats";
import StoreTable from "@/components/stores/StoreTable";
import { getStores } from "@/services/store.service";

const LIMIT = 10;

export default function StoresPage() {
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({ total_toko: 0, toko_aktif: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStores({
          search: debouncedSearch,
          page,
          limit: LIMIT,
        });
        const data = response?.data || {};

        setShops(data.shops || []);
        setStats(data.stats || { total_toko: 0, toko_aktif: 0 });
        setPagination(
          data.pagination || {
            page,
            limit: LIMIT,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat data toko.",
        );
        setShops([]);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [debouncedSearch, page]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daftar Toko</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Kelola dan monitor semua mitra toko ShoeShine yang terdaftar.
          </p>
        </div>
        <StoreStats stats={stats} />
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border-4 border-blue-100 bg-white shadow-sm">
        <div className="px-5 py-5">
          <label className="flex h-12 w-full items-center gap-3 rounded-lg bg-slate-100 px-4 md:max-w-md">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari aplikasi pendaftaran..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <StoreTable shops={shops} loading={loading} />

        <StorePagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
