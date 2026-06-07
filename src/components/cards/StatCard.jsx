import { cn } from "@/lib/utils";

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
  return (
    <article className="min-h-36 rounded-xl bg-[#3f83f8] p-5 text-white shadow-sm shadow-blue-200">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-blue-50">{title}</p>
        {badge ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
              badgeStyles[badgeVariant] || badgeStyles.info,
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-3xl font-bold tracking-normal">{value}</p>
      <p className="mt-2 text-sm font-medium text-blue-100">{subtitle}</p>
    </article>
  );
}
