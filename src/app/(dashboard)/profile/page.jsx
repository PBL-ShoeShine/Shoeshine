"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import {
  getAdminProfile,
  updateAdminProfile,
  updateAdminProfilePicture,
  changePasswordDirect,
} from "@/services/profile.service";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [role, setRole] = useState("SuperAdmin");
  const [joinedAt, setJoinedAt] = useState("Okt 2023");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "Profil berhasil diperbarui",
    description: "Perubahan informasi profil sudah tersimpan.",
    type: "success",
  });
  const [avatar, setAvatar] = useState({
    src: "",
    fileName: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getAdminProfile();
        if (response.success && response.data) {
          const user = response.data;
          setName(user.nama || user.name || "");
          setEmail(user.email || "");
          
          let roleName = "SuperAdmin";
          if (user.jenis_role === "superadmin" || user.role === "superadmin") {
            roleName = "SuperAdmin";
          } else if (user.jenis_role || user.role) {
            roleName = user.jenis_role || user.role;
          }
          setRole(roleName);

          if (user.created_at) {
            const date = new Date(user.created_at);
            const months = [
              "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
              "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
            ];
            setJoinedAt(`${months[date.getMonth()]} ${date.getFullYear()}`);
          }
          
          setAvatar({
            src: user.path_gambar || "",
            fileName: "",
          });
        }
      } catch (err) {
        console.error("Gagal memuat profil dari backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const profile = {
    name,
    email,
    role,
    joinedAt,
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
      setAvatarFile(file);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // 1. Update text data if name or email changed
      let emailChanged = false;
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const currentEmail = storedUser.email || "";
      
      const textPayload = { nama: name };
      if (email.trim() !== currentEmail.trim()) {
        textPayload.email = email.trim();
        emailChanged = true;
      }

      await updateAdminProfile(textPayload);

      // 2. Update avatar picture if file was uploaded
      let avatarUrl = avatar.src;
      if (avatarFile) {
        const photoResponse = await updateAdminProfilePicture(avatarFile);
        if (photoResponse.success) {
          avatarUrl = photoResponse.url;
        }
      }

      // 3. Update password if password field is filled
      if (password) {
        if (!oldPassword) {
          throw new Error("Password lama wajib diisi untuk mengubah password.");
        }
        await changePasswordDirect({
          oldPassword,
          newPassword: password,
        });
      }

      // 4. Update Navbar / localStorage context
      persistNavbarUser(name, emailChanged ? currentEmail : email, avatarUrl);

      // Reset fields
      setPassword("");
      setOldPassword("");
      setAvatarFile(null);

      openPopup({
        title: "Profil diperbarui",
        description: emailChanged
          ? "Informasi berhasil diperbarui. Silakan verifikasi email baru Anda melalui tautan yang dikirim."
          : "Perubahan informasi profil berhasil disimpan.",
        type: "success",
      });
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menyimpan perubahan profil.";
      openPopup({
        title: "Perubahan gagal",
        description: message,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3f83f8] border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <ProfileCard profile={profile} />
        <ProfileForm
          name={name}
          email={email}
          password={password}
          oldPassword={oldPassword}
          avatar={avatar}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onOldPasswordChange={setOldPassword}
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
