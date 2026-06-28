"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Sparkles, Clock, FileText, Camera, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";
import { getUser, getToken, saveAuth } from "@/lib/auth";

export default function DaftarTokoPage() {
  const router = useRouter();
  const [nm_toko, setNmToko] = useState("");
  const [desk_toko, setDeskToko] = useState("");
  const [alamat_toko, setAlamatToko] = useState("");
  const [spesialisasi, setSpesialisasi] = useState("");

  const [fotoToko, setFotoToko] = useState(null);
  const [fotoKtp, setFotoKtp] = useState(null);
  const [fotoTokoPreview, setFotoTokoPreview] = useState(null);
  const [fotoKtpPreview, setFotoKtpPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user && (user.jenis_role === "shops_admin" || user.has_pending_shop)) {
      router.replace("/toko-saya");
    }
  }, [router]);

  const compressImage = (file, maxSizeInMB = 2) => {
    return new Promise((resolve, reject) => {
      if (file.size <= maxSizeInMB * 1024 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Downscale dimension if extremely large
          const maxDimension = 1600;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.7;
          const getBlob = (q) => {
            return new Promise((res) => {
              canvas.toBlob((blob) => res(blob), "image/jpeg", q);
            });
          };

          const tryCompress = async () => {
            let blob = await getBlob(quality);
            while (blob.size > maxSizeInMB * 1024 * 1024 && quality > 0.1) {
              quality -= 0.15;
              blob = await getBlob(quality);
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          };

          tryCompress().catch(reject);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e, setFile, setPreview, label) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        setError(`Format ${label} harus berupa gambar (JPG, JPEG, PNG, atau WEBP).`);
        e.target.value = "";
        setFile(null);
        setPreview(null);
        return;
      }
      setError("");

      try {
        let fileToProcess = file;
        if (file.size > 2 * 1024 * 1024) {
          setError(`Mengompresi ${label} (asli ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB)...`);
          fileToProcess = await compressImage(file, 2);
          setError(""); // Clear compression loading text
        }
        setFile(fileToProcess);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(fileToProcess);
      } catch (err) {
        console.error("Gagal mengompresi gambar:", err);
        setError(`Gagal memproses gambar ${label}.`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input form
    if (!nm_toko.trim()) {
      setError("Nama Toko wajib diisi.");
      return;
    }
    if (nm_toko.trim().length < 3) {
      setError("Nama Toko minimal terdiri dari 3 karakter.");
      return;
    }

    if (!spesialisasi.trim()) {
      setError("Spesialisasi wajib diisi.");
      return;
    }
    if (spesialisasi.trim().length < 3) {
      setError("Spesialisasi minimal terdiri dari 3 karakter (contoh: Sneakers, Leather, dll).");
      return;
    }

    if (!alamat_toko.trim()) {
      setError("Alamat Lengkap Toko wajib diisi.");
      return;
    }
    if (alamat_toko.trim().length < 10) {
      setError("Alamat Lengkap Toko minimal terdiri dari 10 karakter.");
      return;
    }



    if (!desk_toko.trim()) {
      setError("Deskripsi Toko wajib diisi.");
      return;
    }
    if (desk_toko.trim().length < 10) {
      setError("Deskripsi Toko minimal terdiri dari 10 karakter.");
      return;
    }

    if (!fotoToko) {
      setError("Foto Toko wajib diunggah.");
      return;
    }

    if (!fotoKtp) {
      setError("Foto KTP Pemilik wajib diunggah.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("nm_toko", nm_toko);
      formData.append("desk_toko", desk_toko);
      formData.append("alamat_toko", alamat_toko);
      formData.append("spesialisasi", spesialisasi);
      formData.append("jam_buka", "08:00:00");
      formData.append("jam_tutup", "20:00:00");
      formData.append("foto_toko", fotoToko);
      formData.append("foto_ktp", fotoKtp);

      const response = await api.post("/api/v1/customer/shops/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { data } = response;
      if (data && data.success) {
        setSuccess("Pendaftaran toko berhasil diajukan! Menunggu persetujuan SuperAdmin.");
        
        // Update user state locally - keep role as customer but mark pending shop
        const currentUser = getUser();
        const updatedUser = {
          ...currentUser,
          id_shops_admin: data.data.id_shops_admin,
          id_shops: data.data.shop.id_shops,
          shop: data.data.shop,
          has_pending_shop: true,
        };
        saveAuth(getToken(), updatedUser);

        // Notify storage listeners to update Sidebar/Navbar
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          router.replace("/toko-saya");
        }, 1500);
      } else {
        throw new Error(data.message || "Gagal mendaftarkan toko");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Store className="h-8 w-8 text-[#3b82f6]" />
          Daftar Toko Baru
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Mulai kemitraan Anda dengan bergabung sebagai Outlet CareKicks. Lengkapi formulir dan unggah dokumen persyaratan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 animate-pulse">
            {success}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Nama Toko */}
          <label className="block col-span-2">
            <span className="text-sm font-bold text-slate-700">Nama Toko</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <Store className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={nm_toko}
                onChange={(e) => setNmToko(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Masukkan nama toko Anda"
              />
            </span>
          </label>

          {/* Spesialisasi */}
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Spesialisasi</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <Sparkles className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={spesialisasi}
                onChange={(e) => setSpesialisasi(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 font-semibold"
                placeholder="Contoh: Sneakers, Leather, dll"
              />
            </span>
          </label>

          {/* Alamat Toko */}
          <label className="block col-span-2">
            <span className="text-sm font-bold text-slate-700">Alamat Lengkap Toko</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <MapPin className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={alamat_toko}
                onChange={(e) => setAlamatToko(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Jl. Raya Utama No. 123, Kota"
              />
            </span>
          </label>



          {/* Deskripsi */}
          <label className="block col-span-2">
            <span className="text-sm font-bold text-slate-700">Deskripsi Toko</span>
            <span className="mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <FileText className="h-5 w-5 text-slate-400 mt-1" />
              <textarea
                value={desk_toko}
                onChange={(e) => setDeskToko(e.target.value)}
                rows={3}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 resize-none"
                placeholder="Deskripsikan kelebihan, layanan, atau info tambahan outlet Anda"
              />
            </span>
          </label>

          {/* FOTO TOKO UPLOAD */}
          <div className="block">
            <span className="text-sm font-bold text-slate-700">Foto Toko (Wajib)</span>
            <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-4 hover:bg-slate-100/50 transition relative overflow-hidden min-h-36">
              {fotoTokoPreview ? (
                <>
                  <img src={fotoTokoPreview} alt="Preview Foto Toko" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 grid place-items-center opacity-0 hover:opacity-100 transition duration-200">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
                      <Camera className="h-4 w-4" /> Ubah Foto
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Camera className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Klik untuk upload foto toko</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                required={!fotoToko}
                onChange={(e) => handleFileChange(e, setFotoToko, setFotoTokoPreview, "Foto Toko")}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          {/* FOTO KTP UPLOAD */}
          <div className="block">
            <span className="text-sm font-bold text-slate-700">Foto KTP Pemilik (Wajib)</span>
            <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-4 hover:bg-slate-100/50 transition relative overflow-hidden min-h-36">
              {fotoKtpPreview ? (
                <>
                  <img src={fotoKtpPreview} alt="Preview Foto KTP" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 grid place-items-center opacity-0 hover:opacity-100 transition duration-200">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
                      <ShieldCheck className="h-4 w-4" /> Ubah Foto
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ShieldCheck className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Klik untuk upload foto KTP</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                required={!fotoKtp}
                onChange={(e) => handleFileChange(e, setFotoKtp, setFotoKtpPreview, "Foto KTP Pemilik")}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#3f83f8] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Mengajukan Pendaftaran..." : "Daftarkan Toko Saya"}
        </button>
      </form>
    </div>
  );
}
