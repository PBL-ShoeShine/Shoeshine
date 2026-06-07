const fallbackTrend = [
  { label: "JAN", value: 0 },
  { label: "FEB", value: 0 },
  { label: "MAR", value: 0 },
  { label: "APR", value: 0 },
  { label: "MEI", value: 0 },
  { label: "JUN", value: 0 },
];

export default function OrderTrendChart({ data = fallbackTrend }) {
  const trend = data.length ? data : fallbackTrend;
  const maxValue = Math.max(...trend.map((item) => Number(item.value || 0)), 1);
  const points = trend.map((item, index) => {
    const x = 45 + index * (595 / Math.max(trend.length - 1, 1));
    const y = 190 - (Number(item.value || 0) / maxValue) * 135;

    return { ...item, x, y };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Tren Pesanan Bulanan</h3>
          <p className="mt-1 text-sm text-slate-500">Performa pesanan 6 bulan terakhir</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          2026
        </span>
      </div>

      <div className="mt-6 overflow-hidden">
        <svg
          viewBox="0 0 680 260"
          className="h-[260px] w-full"
          role="img"
          aria-label="Grafik tren pesanan bulanan"
        >
          {[40, 90, 140, 190].map((y) => (
            <line
              key={y}
              x1="20"
              x2="660"
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}
          <path d={path} fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
          <path d={path} fill="none" stroke="#475569" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5" fill="#3f83f8" />
              <text
                x={point.x}
                y={point.y - 16}
                textAnchor="middle"
                className="fill-slate-500 text-[12px] font-bold"
              >
                {point.value}
              </text>
            </g>
          ))}
          {trend.map((month, index) => (
            <text
              key={month.label}
              x={55 + index * 116}
              y="238"
              textAnchor="middle"
              className="fill-slate-500 text-[13px] font-bold"
            >
              {month.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
