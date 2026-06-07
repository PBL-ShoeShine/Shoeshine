import { Pencil, Trash2 } from "lucide-react";

const roleLabels = {
  superadmin: "SuperAdmin",
  customer: "Customer",
  admin_toko: "Admin Toko",
  staff: "Staff",
};

export default function UserTable({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
        Memuat data pengguna...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
        Belum ada data pengguna
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
          <tr>
            <th className="px-6 py-4 font-bold">Nama Lengkap</th>
            <th className="px-6 py-4 font-bold">Email</th>
            <th className="px-6 py-4 font-bold">Nomor HP</th>
            <th className="px-6 py-4 font-bold">Role</th>
            <th className="px-6 py-4 text-right font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-50">
          {users.map((user) => (
            <tr key={user.id_user} className="text-sm text-[#263238]">
              <td className="px-6 py-5 font-bold">{user.nama || "-"}</td>
              <td className="px-6 py-5 font-medium text-slate-600">
                {user.email || "-"}
              </td>
              <td className="px-6 py-5 font-medium text-slate-600">
                {user.no_hp || "-"}
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#3b82f6]">
                  {roleLabels[user.jenis_role] || user.jenis_role || "-"}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label={`Edit ${user.nama || "pengguna"}`}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700"
                    aria-label={`Hapus ${user.nama || "pengguna"}`}
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
