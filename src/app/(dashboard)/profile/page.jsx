"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import { getProfile, updateProfile, updateProfilePicture } from "@/services/profile.service";

const roleLabels = {
  superadmin: "SuperAdmin",
  shops_admin: "Admin Toko",
  customer: "Customer",
  staff: "Staff",
};

const formatJoinedAt = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [avatar, setAvatar] = useState({ src: "", file: null, fileName: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "Profil berhasil diperbarui",
    description: "Perubahan informasi profil sudah tersimpan di database.",
    type: "success",
  });

  const syncNavbarUser = useCallback((user) => {
    if (!user) return;

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...user,
          role: user.jenis_role || currentUser.role,
        }),
      );
      window.dispatchEvent(new Event("storage"));
    } catch {
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
    }
  }, []);

  const applyProfile = useCallback((data) => {
    const user = data?.user || data || null;
    setProfileData(user);
    setName(user?.nama || "");
    setEmail(user?.email || "");
    setNoHp(user?.no_hp || "");
    setAvatar({
      src: user?.path_gambar || "",
      file: null,
      fileName: "",
    });
    syncNavbarUser(user);
  }, [syncNavbarUser]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProfile();
      applyProfile(response?.data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal memuat profil dari database.");
    } finally {
      setLoading(false);
    }
  }, [applyProfile]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProfile();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProfile]);

  const openPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleAvatarChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      openPopup({
        title: "File tidak valid",
        description: "Gunakan file gambar dengan format JPG, PNG, atau WEBP.",
        type: "error",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar({ src: previewUrl, file, fileName: file.name });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let uploadedAvatarUrl = profileData?.path_gambar || "";

      if (avatar.file) {
        const uploadResponse = await updateProfilePicture(avatar.file);
        uploadedAvatarUrl = uploadResponse?.url || uploadedAvatarUrl;
      }

      await updateProfile({
        nama: name.trim(),
        email: email.trim(),
        no_hp: noHp.trim(),
      });

      const refreshed = await getProfile();
      const nextUser = {
        ...(refreshed?.data?.user || refreshed?.data || {}),
        path_gambar: uploadedAvatarUrl || (refreshed?.data?.user || refreshed?.data)?.path_gambar,
      };
      applyProfile(nextUser);

      openPopup({
        title: "Profil berhasil diperbarui",
        description: "Data profil sudah tersimpan dan dimuat ulang dari database.",
        type: "success",
      });
    } catch (err) {
      openPopup({
        title: "Gagal memperbarui profil",
        description: err?.response?.data?.message || err?.message || "Terjadi kesalahan saat menyimpan profil.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const profile = {
    name: profileData?.nama || profileData?.username || "-",
    email: profileData?.email || "-",
    role: roleLabels[profileData?.jenis_role] || profileData?.jenis_role || "-",
    joinedAt: formatJoinedAt(profileData?.created_at),
    avatar: avatar.src,
  };

  const popupIconClass =
    popupMessage.type === "error"
      ? "bg-red-50 text-red-600"
      : "bg-blue-50 text-[#3b82f6]";
  const popupButtonClass =
    popupMessage.type === "error"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-[#0f172a] hover:bg-slate-700";
  const popupShadowClass =
    popupMessage.type === "error" ? "shadow-red-100/70" : "shadow-blue-100/60";

  return (
    <div className="mx-auto w-full max-w-6xl">
     

      {error ? (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <XCircle className="h-5 w-5" aria-hidden="true" />
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-sm font-semibold text-slate-500 shadow-sm">
          Memuat profil dari database...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
          <ProfileCard profile={profile} />
          <ProfileForm
            name={name}
            email={email}
            noHp={noHp}
            avatar={avatar}
            saving={saving}
            onNameChange={setName}
            onEmailChange={setEmail}
            onNoHpChange={setNoHp}
            onAvatarChange={handleAvatarChange}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {showPopup ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4">
          <div
            className={`w-full max-w-sm rounded-xl border border-blue-100 bg-white p-6 text-center shadow-xl ${popupShadowClass}`}
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tutup popup"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div
              className={`mx-auto mt-1 grid h-14 w-14 place-items-center rounded-2xl ${popupIconClass}`}
            >
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {popupMessage.title}
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {popupMessage.description}
            </p>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className={`mt-6 h-11 w-full rounded-md px-5 text-sm font-bold text-white transition ${popupButtonClass}`}
            >
              Selesai
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
