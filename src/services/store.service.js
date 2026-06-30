import api from "@/lib/axios";

export async function getStores({ search = "", page = 1, limit = 10, status = "" } = {}) {
  const response = await api.get("/api/v1/admin/shops", {
    params: {
      search,
      page,
      limit,
      status,
    },
  });

  return response.data;
}

export async function getStoreDetail(id) {
  const response = await api.get(`/api/v1/admin/shops/${id}`);
  return response.data;
}

export async function verifyStore(id, { status_verifikasi, alasan_penangguhan }) {
  const response = await api.put(`/api/v1/admin/shops/${id}/verify`, {
    status_verifikasi,
    alasan_penangguhan,
  });
  return response.data;
}
