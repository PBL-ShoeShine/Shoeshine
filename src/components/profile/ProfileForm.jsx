export default function ProfileForm({
  name,
  email,
  password,
  avatar,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onAvatarChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Informasi Personal
        </p>

        <div className="mt-6 grid gap-5">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Foto Profil
            </span>
            <div className="mt-2 flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <p className="font-semibold text-slate-800">
                  {avatar?.fileName || "Pilih gambar profil baru"}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Format JPG, PNG, atau WEBP.
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => onAvatarChange(event.target.files?.[0])}
                className="block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[#0f172a] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-slate-700 sm:w-auto"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Nama Lengkap
            </span>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Alamat Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </label>
        </div>
      </section>

      <section className="mt-8 border-t border-slate-100 pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Keamanan
        </p>

        <label className="mt-6 block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Password Baru
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Masukkan password baru"
            className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </label>

        <p className="mt-2 text-xs font-medium text-slate-500">
          Biarkan kosong jika tidak ingin mengubah password.
        </p>
      </section>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="h-11 rounded-md bg-[#0f172a] px-5 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
