import api from "@/lib/axios";

export async function getAdminProfile() {
  const response = await api.get("/api/v1/admin/profile");
  return response.data;
}

export async function updateAdminProfile(payload) {
  const response = await api.put("/api/v1/admin/profile", payload);
  return response.data;
}

export async function updateAdminProfilePicture(file) {
  const formData = new FormData();
  formData.append("image", file);
  
  const response = await api.post("/api/v1/admin/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function changePasswordDirect(payload) {
  const response = await api.put("/api/v1/admin/profile/change-password-direct", payload);
  return response.data;
}
