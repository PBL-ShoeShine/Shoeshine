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
    const y = 180 - (Number(item.value || 0) / maxValue) * 125;

    return { ...item, x, y };
  });
  
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = points.length 
    ? `${path} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`
    : "";

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
          className="h-auto w-full"
          role="img"
          aria-label="Grafik tren pesanan bulanan"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f83f8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3f83f8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[40, 90, 140, 190].map((y) => (
            <line
              key={y}
              x1="20"
              x2="660"
              y1={y}
              y2={y}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {areaPath && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          <path 
            d={path} 
            fill="none" 
            stroke="#3f83f8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
          />

          {points.map((point) => (
            <g key={point.label}>
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="6" 
                fill="#ffffff" 
                stroke="#3f83f8" 
                strokeWidth="3" 
              />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="fill-slate-700 text-[11px] font-extrabold"
              >
                {point.value}
              </text>
            </g>
          ))}

          {points.map((point) => (
            <text
              key={point.label}
              x={point.x}
              y="225"
              textAnchor="middle"
              className="fill-slate-400 text-[12px] font-bold"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
