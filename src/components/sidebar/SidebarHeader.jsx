export default function SidebarHeader({ role }) {
  const headerText = (() => {
    if (role === "customer") {
      return "Di Pendaftaran Toko";
    }
    if (role === "shops_admin") {
      return "Di Toko Saya";
    }
    return "SuperAdmin Workspace";
  })();

  return (
    <div className="px-6 pb-8 pt-7 text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
        SELAMAT DATANG!
      </p>
      <h1 className="mt-2 text-2xl font-bold leading-tight">
        {headerText}
      </h1>
    </div>
  );
}
