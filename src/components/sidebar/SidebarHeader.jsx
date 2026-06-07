export default function SidebarHeader({ role }) {
  const title = role === "customer" ? "Pendaftaran Toko" : "SuperAdmin Workspace";

  return (
    <div className="px-6 pb-8 pt-7 text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
        SELAMAT DATANG!
      </p>
      <h1 className="mt-2 text-2xl font-bold leading-tight">
        {title}
      </h1>
    </div>
  );
}
