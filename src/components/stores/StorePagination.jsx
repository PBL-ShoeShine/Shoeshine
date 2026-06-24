import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StorePagination({ page, total, totalPages, limit, onPageChange }) {
  const getPageNumbers = () => {
    const totalNumbers = 7;
    
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPageNumbers();
  const shownCount = total === 0 ? 0 : Math.min(page * limit, total);
  const startCount = total === 0 ? 0 : (page - 1) * limit + 1;

  return (
    <div className="flex flex-col gap-4 border-t border-blue-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-500">
        Menampilkan {startCount}-{shownCount} dari {Number(total || 0).toLocaleString("id-ID")} toko
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 transition"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((pageNumber, idx) => (
          pageNumber === '...' ? (
            <span
              key={`dots-${idx}`}
              className="grid h-9 w-9 place-items-center text-sm font-bold text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "h-9 min-w-9 rounded-lg px-3 text-sm font-bold transition",
                page === pageNumber
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {pageNumber}
            </button>
          )
        ))}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 transition"
          aria-label="Halaman Selanjutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
