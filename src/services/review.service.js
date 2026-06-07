import api from "@/lib/axios";

export async function getReviewShops({ search = "", page = 1, limit = 10 } = {}) {
  const response = await api.get("/api/v1/superadmin/reviews/shops", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getReviewShopDetail(id) {
  const response = await api.get(`/api/v1/superadmin/reviews/shops/${id}`);
  return response.data;
}

export async function suspendReviewShop(id, alasan_penangguhan) {
  const response = await api.patch(`/api/v1/superadmin/reviews/shops/${id}/suspend`, {
    alasan_penangguhan,
  });

  return response.data;
}

export async function activateReviewShop(id) {
  const response = await api.patch(`/api/v1/superadmin/reviews/shops/${id}/activate`);
  return response.data;
}
