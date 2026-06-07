import api from "@/lib/axios";

export async function getUsers({ search = "", page = 1, limit = 10 } = {}) {
  const response = await api.get("/api/v1/admin/users", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
}

export async function createUser(payload) {
  const response = await api.post("/api/v1/admin/users", payload);
  return response.data;
}

export async function updateUser(id, payload) {
  const response = await api.put(`/api/v1/admin/users/${id}`, payload);
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/api/v1/admin/users/${id}`);
  return response.data;
}
