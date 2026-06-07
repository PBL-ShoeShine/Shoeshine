import api from "@/lib/axios";

export async function getProfile() {
  const response = await api.get("/api/v1/admin/profile");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put("/api/v1/admin/profile", payload);
  return response.data;
}

export async function updateProfilePicture(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/api/v1/admin/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
