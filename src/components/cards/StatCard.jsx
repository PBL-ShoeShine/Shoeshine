import { cn } from "@/lib/utils";
import { Users, Store, FileText, DollarSign, TrendingUp } from "lucide-react";

const iconMap = {
  "Manajemen Pembeli": Users,
  "Jumlah Toko Aktif": Store,
  "Pendaftaran Masuk": FileText,
  "Total Pendapatan": DollarSign,
};

const iconColors = {
  "Manajemen Pembeli": "bg-blue-50 text-[#3f83f8]",
  "Jumlah Toko Aktif": "bg-emerald-50 text-[#10b981]",
  "Pendaftaran Masuk": "bg-amber-50 text-[#f59e0b]",
  "Total Pendapatan": "bg-indigo-50 text-[#6366f1]",
};

const badgeStyles = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
};

export default function StatCard({
  title,
  value,
  subtitle,
  badge,
  badgeVariant = "success",
}) {
  const Icon = iconMap[title] || TrendingUp;
  const iconColorClass = iconColors[title] || "bg-slate-50 text-slate-600";

  return (
    <article className="flex min-h-[144px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", iconColorClass)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-bold text-slate-500">{title}</p>
      </div>
      
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          <p className="mt-1 text-xs font-medium text-slate-400 truncate">{subtitle}</p>
        </div>
        {badge ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold mb-1",
              badgeStyles[badgeVariant] || badgeStyles.info,
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>
    </article>
  );
}
