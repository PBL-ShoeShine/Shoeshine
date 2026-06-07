"use client";

import { useRouter } from "next/navigation";

export default function StoreTable({ shops, loading }) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
        Memuat data toko...
      </div>
    );
  }

  if (!shops.length) {
    return (
      <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
        Belum ada toko terdaftar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
          <tr>
            <th className="px-6 py-4 font-bold">Nama Toko</th>
            <th className="px-6 py-4 font-bold">Pemilik</th>
            <th className="px-6 py-4 font-bold">Lokasi</th>
            <th className="px-6 py-4 font-bold">Spesialisasi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-50">
          {shops.map((shop) => (
            <tr
              key={shop.id_shops}
              onClick={() => router.push(`/stores/${shop.id_shops}`)}
              className="cursor-pointer text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <td className="px-6 py-5">
                <p className="font-bold text-slate-900">{shop.nm_toko || "-"}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {shop.store_code}
                </p>
              </td>
              <td className="px-6 py-5">
                <p className="font-bold text-slate-900">{shop.owner?.nama || "-"}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {shop.owner?.email || "-"}
                </p>
              </td>
              <td className="max-w-xs px-6 py-5">
                <p className="truncate font-semibold text-slate-800">
                  {shop.alamat_toko || "-"}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Area toko terdaftar
                </p>
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#3b82f6]">
                  {shop.spesialisasi || "-"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
