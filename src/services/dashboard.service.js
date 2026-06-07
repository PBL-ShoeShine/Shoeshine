import api from "@/lib/axios";

export async function getDashboardSummary() {
  const response = await api.get("/api/v1/superadmin/dashboard");
  return response.data;
}
