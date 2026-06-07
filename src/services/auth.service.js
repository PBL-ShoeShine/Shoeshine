import api from "@/lib/axios";

const LOGIN_ENDPOINTS = ["/api/v1/auth/login", "/api/v1/user/login"];

export async function login(payload) {
  let lastError;

  for (const endpoint of LOGIN_ENDPOINTS) {
    try {
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error) {
      lastError = error;

      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}
