import { cn } from "@/lib/utils";

const fallbackActivities = [
  {
    store: "CleanStep Jakarta",
    date: "24 Okt 2023",
    service: "Premium Care",
    status: "Tertunda",
  },
  {
    store: "SoleMate Bandung",
    date: "23 Okt 2023",
    service: "Fast Clean",
    status: "Aktif",
  },
  {
    store: "HeelHero Surabaya",
    date: "22 Okt 2023",
    service: "Leather Expert",
    status: "Aktif",
  },
  {
    store: "SneakerSave Jogja",
    date: "21 Okt 2023",
    service: "Deep Cleaning",
    status: "Ditolak",
  },
];

const statusStyles = {
  tertunda: "bg-amber-100 text-amber-700",
  pending: "bg-amber-100 text-amber-700",
  aktif: "bg-emerald-100 text-emerald-700",
  selesai: "bg-emerald-100 text-emerald-700",
  paid: "bg-emerald-100 text-emerald-700",
  diproses: "bg-blue-100 text-blue-700",
  ditolak: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatStatus = (status) => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function RecentActivityTable({ data }) {
  const activities = Array.isArray(data) ? data : fallbackActivities;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h3>
        <p className="mt-1 text-sm text-slate-500">Update toko dan layanan terbaru</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="px-3 py-3 font-bold">Toko</th>
              <th className="px-3 py-3 font-bold">Tanggal</th>
              <th className="px-3 py-3 font-bold">Layanan</th>
              <th className="px-3 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.length ? activities.map((activity, index) => (
              <tr
                key={activity.id || `${activity.store}-${activity.date}-${activity.service}-${index}`}
                className="text-slate-700"
              >
                <td className="px-3 py-4 font-semibold text-slate-900">{activity.store}</td>
                <td className="px-3 py-4">{activity.date}</td>
                <td className="px-3 py-4">{activity.service}</td>
                <td className="px-3 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                      statusStyles[String(activity.status).toLowerCase()] ||
                        "bg-slate-100 text-slate-700",
                    )}
                  >
                    {formatStatus(activity.status)}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="px-3 py-8 text-center font-semibold text-slate-500" colSpan="4">
                  Belum ada aktivitas terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
