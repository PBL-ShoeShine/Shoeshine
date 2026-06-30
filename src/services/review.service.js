import api from "@/lib/axios";

export async function getReviews({ page = 1, limit = 10 } = {}) {
  const response = await api.get("/api/v1/admin/reviews", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}
