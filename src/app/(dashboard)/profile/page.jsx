"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";

const adminProfile = {
  name: "Nama Superadmin",
  email: "superadmin@shoeshine.com",
  role: "Master Access",
  joinedAt: "Okt 2023",
  avatar: "/images/avatar.jpg",
};

const PROFILE_STORAGE_KEY = "adminProfile";

export default function ProfilePage() {
  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "Profil berhasil diperbarui",
    description: "Perubahan informasi profil SuperAdmin sudah tersimpan.",
    type: "success",
  });
  const [avatar, setAvatar] = useState({
    src: adminProfile.avatar,
    fileName: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedProfile = JSON.parse(
          localStorage.getItem(PROFILE_STORAGE_KEY) || "null",
        );

        if (!savedProfile) return;

        setName(savedProfile.name || adminProfile.name);
        setEmail(savedProfile.email || adminProfile.email);
        setAvatar({
          src: savedProfile.avatar || adminProfile.avatar,
          fileName: savedProfile.avatarFileName || "",
        });
      } catch {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const profile = {
    ...adminProfile,
    name,
    email,
    avatar: avatar.src,
  };

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

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      setAvatar({
        src: reader.result,
        fileName: file.name,
      });
    };

    reader.readAsDataURL(file);
  };

  const persistNavbarUser = (nextName, nextEmail, nextAvatar) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          nama: nextName,
          name: nextName,
          username: nextName,
          email: nextEmail,
          path_gambar: nextAvatar,
        }),
      );
    } catch {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: nextName,
          username: nextName,
          email: nextEmail,
          path_gambar: nextAvatar,
        }),
      );
    }

    window.dispatchEvent(new Event("storage"));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        name,
        email,
        role: adminProfile.role,
        joinedAt: adminProfile.joinedAt,
        avatar: avatar.src,
        avatarFileName: avatar.fileName,
      }),
    );
    persistNavbarUser(name, email, avatar.src);
    setPassword("");

    openPopup({
      title: "Profil berhasil diperbarui",
      description: "Perubahan informasi profil SuperAdmin sudah tersimpan.",
      type: "success",
    });
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
    popupMessage.type === "error"
      ? "shadow-red-100/70"
      : "shadow-blue-100/60";

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Kelola informasi akun dan preferensi keamanan Anda.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <ProfileCard profile={profile} />
        <ProfileForm
          name={name}
          email={email}
          password={password}
          avatar={avatar}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onAvatarChange={handleAvatarChange}
          onSubmit={handleSubmit}
        />
      </div>

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
