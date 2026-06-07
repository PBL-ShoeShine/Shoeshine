export default function StoreStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <article className="rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Total Toko
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {Number(stats?.total_toko || 0).toLocaleString("id-ID")}
        </p>
      </article>
      <article className="rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Toko Aktif
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {Number(stats?.toko_aktif || 0).toLocaleString("id-ID")}
        </p>
      </article>
    </div>
  );
}
