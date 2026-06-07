import api from "@/lib/axios";

export async function getMyShopAppeals() {
  const response = await api.get("/api/v1/shop/appeals/my");
  return response.data;
}

export async function createShopAppeal(formData) {
  const response = await api.post("/api/v1/shop/appeals", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getSuperadminShopAppeals(params = {}) {
  const response = await api.get("/api/v1/superadmin/shop-appeals", { params });
  return response.data;
}

export async function getSuperadminShopAppealDetail(id) {
  const response = await api.get(`/api/v1/superadmin/shop-appeals/${id}`);
  return response.data;
}

export async function approveShopAppeal(id) {
  const response = await api.patch(`/api/v1/superadmin/shop-appeals/${id}/approve`);
  return response.data;
}

export async function rejectShopAppeal(id, rejectionReason) {
  const response = await api.patch(`/api/v1/superadmin/shop-appeals/${id}/reject`, {
    rejection_reason: rejectionReason,
  });
  return response.data;
}
