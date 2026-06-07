import { formatRupiah, StatusBadge } from "./StoreDetailCard";

export default function StoreServicesTable({ services }) {
  return (
    <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Layanan</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama Layanan</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Estimasi</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {services.length ? services.map((service) => (
              <tr key={service.id_services}>
                <td className="px-4 py-4 font-bold text-slate-900">{service.nama_layanan || "-"}</td>
                <td className="px-4 py-4 font-semibold text-slate-600">{formatRupiah(service.harga)}</td>
                <td className="px-4 py-4 font-semibold text-slate-600">{service.estimasi_waktu || "-"}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={service.is_active ? "aktif" : "nonaktif"} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center font-semibold text-slate-500">
                  Belum ada layanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
