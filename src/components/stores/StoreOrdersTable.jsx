import { formatDate, StatusBadge } from "./StoreDetailCard";

export default function StoreOrdersTable({ orders }) {
  return (
    <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Order Terbaru</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Kode Order</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Status Order</th>
              <th className="px-4 py-3">Status Pembayaran</th>
              <th className="px-4 py-3">Metode Bayar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {orders.length ? orders.map((order) => (
              <tr key={order.id_orders}>
                <td className="px-4 py-4 font-bold text-slate-900">{order.kode_order || "-"}</td>
                <td className="px-4 py-4 font-semibold text-slate-600">{formatDate(order.tgl_order)}</td>
                <td className="px-4 py-4"><StatusBadge status={order.status_order} /></td>
                <td className="px-4 py-4"><StatusBadge status={order.status_pembayaran} /></td>
                <td className="px-4 py-4 font-semibold text-slate-600">{order.metode_bayar || "-"}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center font-semibold text-slate-500">
                  Belum ada order terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
