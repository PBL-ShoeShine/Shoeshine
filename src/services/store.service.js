import api from "@/lib/axios";

export async function getStores({ search = "", page = 1, limit = 10 } = {}) {
  const response = await api.get("/api/v1/admin/shops", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getStoreDetail(id) {
  const response = await api.get(`/api/v1/admin/shops/${id}`);
  return response.data;
}
