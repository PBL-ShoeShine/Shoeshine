"use client";

import { useEffect, useState } from "react";
import { MessageSquare, User, Calendar, Store, Tag } from "lucide-react";
import { getReviews } from "@/services/review.service";

const LIMIT = 6;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");
        const res = await getReviews({ page, limit: LIMIT });
        const data = res?.data || {};
        setReviews(data.reviews || []);
        setPagination(data.pagination || {
          page,
          limit: LIMIT,
          total: 0,
          totalPages: 1
        });
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Gagal memuat data review.");
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [page]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-[#3b82f6]" />
            Ulasan Pelanggan
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Tinjau semua feedback dan ulasan yang diberikan oleh pelanggan kepada mitra toko.
          </p>
        </div>

        <div className="w-full rounded-xl border border-blue-100 bg-white px-6 py-4 shadow-sm lg:w-60">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Total Ulasan
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pagination.total.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-blue-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500 shadow-sm">
          Memuat ulasan...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-blue-200 bg-slate-50/50 px-5 py-12 text-center shadow-sm">
          <p className="font-semibold text-slate-500">Belum ada ulasan dari pelanggan saat ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item) => (
              <div key={item.id_detail_orders} className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {item.customer_foto ? (
                      <img src={item.customer_foto} alt={item.customer_name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.customer_name}</h4>
                      <p className="text-xs font-semibold text-[#3b82f6] flex items-center gap-1 mt-0.5">
                        <Store className="h-3 w-3" />
                        {item.shop_name}
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-slate-700 text-sm font-medium italic border-l-2 border-slate-200 pl-3 my-3">
                    "{item.review}"
                  </blockquote>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Tag className="h-3.5 w-3.5 text-slate-400" />
                      {item.merk} - {item.jenis_sepatu}
                    </span>
                    <span className="font-bold text-slate-800">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0
                      }).format(item.total_harga)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.order_date ? new Intl.DateTimeFormat("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }).format(new Date(item.order_date)) : "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-10 px-4 rounded-lg bg-white border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-slate-600 px-3">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="h-10 px-4 rounded-lg bg-white border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
