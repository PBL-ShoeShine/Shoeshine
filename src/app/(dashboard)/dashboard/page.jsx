"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/cards/StatCard";
import OrderTrendChart from "@/components/charts/OrderTrendChart";
import RecentActivityTable from "@/components/tables/RecentActivityTable";
import { getDashboardSummary } from "@/services/dashboard.service";

const fallbackStats = [
  {
    title: "Manajemen Pembeli",
    value: "0",
    subtitle: "Total pembeli terdaftar",
  },
  {
    title: "Jumlah Toko Aktif",
    value: "0",
    subtitle: "Toko terverifikasi",
  },
  {
    title: "Pendaftaran Masuk",
    value: "0",
    subtitle: "Menunggu verifikasi",
    badge: "Pending",
    badgeVariant: "warning",
  },
  {
    title: "Total Pendapatan",
    value: "Rp 0",
    subtitle: "Akumulasi dari detail order",
  },
];

const normalizeDashboardData = (response) => {
  const data = response?.data || response || {};
  const stats = data.stats || {};

  return {
    stats: [
      stats.customers || fallbackStats[0],
      stats.activeShops || fallbackStats[1],
      {
        ...(stats.pendingRegistrations || fallbackStats[2]),
        badge: "Pending",
        badgeVariant: "warning",
      },
      stats.revenue || fallbackStats[3],
    ],
    orderTrend: data.orderTrend || [],
    recentActivities: data.recentActivities || [],
  };
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    stats: fallbackStats,
    orderTrend: [],
    recentActivities: undefined,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardSummary();

        if (active) {
          setDashboard(normalizeDashboardData(response));
        }
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Gagal memuat data dashboard.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {loading ? (
        <div className="rounded-xl border border-blue-100 bg-white px-5 py-4 text-sm font-semibold text-slate-500 shadow-sm">
          Memuat data dashboard...
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <OrderTrendChart data={dashboard.orderTrend} />
        <RecentActivityTable data={dashboard.recentActivities} />
      </div>
    </div>
  );
}
