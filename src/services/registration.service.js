import api from "@/lib/axios";

export async function getMyStoreRegistration() {
  const response = await api.get("/api/v1/customer/stores/my-registration");
  return response.data;
}

export async function registerStore(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  const response = await api.post("/api/v1/customer/stores/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getShopVerifications({ status = "pending", search = "", page = 1, limit = 10 } = {}) {
  const response = await api.get("/api/v1/superadmin/verifications/shops", {
    params: {
      status,
      search,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getShopVerificationDetail(id) {
  const response = await api.get(`/api/v1/superadmin/verifications/shops/${id}`);
  return response.data;
}

export async function updateShopVerificationStatus(id, status) {
  const response = await api.patch(`/api/v1/superadmin/verifications/shops/${id}/status`, {
    status,
  });

  return response.data;
}
