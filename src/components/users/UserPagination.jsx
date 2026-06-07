import { cn } from "@/lib/utils";

export default function UserPagination({ page, total, totalPages, limit, onPageChange }) {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1);
  const shownCount = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 border-t border-blue-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-500">
        Menampilkan {shownCount} dari {total.toLocaleString("id-ID")} pengguna
      </p>
      <div className="flex gap-2">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "h-9 min-w-9 rounded-lg px-3 text-sm font-bold transition",
              page === pageNumber
                ? "bg-slate-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
