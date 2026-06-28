import { cn } from "@/lib/utils";

export const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const statusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (["approved", "aktif", "paid", "selesai"].includes(value)) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (["pending", "unpaid", "diproses"].includes(value)) {
    return "bg-amber-100 text-amber-700";
  }

  if (["rejected", "ditolak", "cancelled"].includes(value)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

export function StatusBadge({ status }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", statusClass(status))}>
      {status || "-"}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-900">{value || "-"}</p>
    </div>
  );
}

function ImageBox({ title, src }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-bold text-slate-900">{title}</p>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          className="h-48 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="grid h-48 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-400">
          Belum ada gambar
        </div>
      )}
    </div>
  );
}

export default function StoreDetailCard({ store }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <InfoItem label="Pemilik" value={store.owner?.nama} />
        </div>
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <InfoItem label="Email" value={store.owner?.email} />
        </div>
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <InfoItem label="Nomor HP" value={store.owner?.no_hp} />
        </div>
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <InfoItem label="Saldo Toko" value={formatRupiah(store.saldo_toko)} />
        </div>
      </section>

      <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Informasi Toko</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <InfoItem label="Nama Toko" value={store.nm_toko} />
          <InfoItem label="Spesialisasi" value={store.spesialisasi} />
          <InfoItem label="Jam Buka" value={store.jam_buka} />
          <InfoItem label="Jam Tutup" value={store.jam_tutup} />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Status Verifikasi
            </p>
            <div className="mt-2">
              <StatusBadge status={store.status_verifikasi} />
            </div>
          </div>
          <div className="md:col-span-2">
            <InfoItem label="Alamat Toko" value={store.alamat_toko} />
          </div>
          <div className="md:col-span-2">
            <InfoItem label="Deskripsi Toko" value={store.desk_toko} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ImageBox title="Foto Toko" src={store.foto_toko} />
        <ImageBox title="Foto KTP" src={store.foto_ktp} />
        <ImageBox title="QRIS" src={store.upload_qris} />
      </section>
    </div>
  );
}
