// Small SVG charts for the admin Reporting page. Server rendered, no chart
// library: each chart scales to its container and carries a text summary for
// screen readers.

export const chartColors = ["#2e7d74", "#61b9ad", "#014c69", "#5e008d", "#8fcfc6", "#a678c0"];

type Series = { name: string; color: string; values: number[] };

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

export function Legend({ items }: { items: { name: string; color: string; line?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-body">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-2">
          {i.line ? (
            <span className="h-0.5 w-5" style={{ background: i.color }} />
          ) : (
            <span className="h-3 w-3 rounded-[2px]" style={{ background: i.color }} />
          )}
          {i.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * Columns per label (grouped side by side, or stacked), with an optional
 * percentage line on a second axis.
 */
export function ColumnChart({
  labels,
  series,
  stacked = false,
  line,
  format = (n) => String(n),
  summary,
}: {
  labels: string[];
  series: Series[];
  stacked?: boolean;
  line?: { name: string; color: string; values: (number | null)[] };
  format?: (n: number) => string;
  summary: string;
}) {
  const W = 720, H = 260, L = 52, R = line ? 44 : 12, T = 14, B = 28;
  const cw = (W - L - R) / labels.length;
  const totals = labels.map((_, i) => (stacked ? series.reduce((s, x) => s + x.values[i], 0) : Math.max(...series.map((x) => x.values[i]))));
  const max = niceMax(Math.max(...totals) / 4) * 4;
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const yp = (v: number) => T + (H - T - B) * (1 - v / 100);
  const pts = line?.values.map((v, i) => (v === null ? null : `${L + cw * i + cw / 2},${yp(v)}`)).filter(Boolean);

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={summary}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#ececec" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b6e72">
              {format(t)}
            </text>
          </g>
        ))}
        {line &&
          [0, 50, 100].map((p) => (
            <text key={p} x={W - R + 8} y={yp(p) + 4} fontSize="11" fill={line.color}>
              {p}%
            </text>
          ))}
        {labels.map((label, i) => {
          const x0 = L + cw * i;
          const inner = cw * 0.7;
          let acc = 0;
          return (
            <g key={label + i}>
              {series.map((s, si) => {
                const v = s.values[i];
                if (stacked) {
                  const top = y(acc + v);
                  const h = y(acc) - top;
                  acc += v;
                  return (
                    <rect key={s.name} x={x0 + (cw - inner) / 2} y={top} width={inner} height={Math.max(0, h)} fill={s.color}>
                      <title>{`${label}, ${s.name}: ${format(v)}`}</title>
                    </rect>
                  );
                }
                const bw = inner / series.length;
                return (
                  <rect key={s.name} x={x0 + (cw - inner) / 2 + bw * si} y={y(v)} width={bw - 2} height={Math.max(0, y(0) - y(v))} fill={s.color}>
                    <title>{`${label}, ${s.name}: ${format(v)}`}</title>
                  </rect>
                );
              })}
              <text x={x0 + cw / 2} y={H - 9} textAnchor="middle" fontSize="11" fill="#6b6e72">
                {label}
              </text>
            </g>
          );
        })}
        {line && pts && pts.length > 1 && <polyline points={pts.join(" ")} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinejoin="round" />}
        {line?.values.map((v, i) =>
          v === null ? null : (
            <circle key={i} cx={L + cw * i + cw / 2} cy={yp(v)} r="3.5" fill="#fff" stroke={line.color} strokeWidth="2">
              <title>{`${labels[i]}, ${line.name}: ${Math.round(v)}%`}</title>
            </circle>
          ),
        )}
      </svg>
      <figcaption className="mt-3">
        <Legend items={[...series.map((s) => ({ name: s.name, color: s.color })), ...(line ? [{ name: line.name, color: line.color, line: true }] : [])]} />
      </figcaption>
    </figure>
  );
}

/** Horizontal bars with a label and a value at the end. */
export function BarList({ rows, color = chartColors[1] }: { rows: { label: string; value: number; display: string; sub?: string; color?: string }[]; color?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)_96px]">
          <span className="truncate text-[14px] text-charcoal">
            {r.label}
            {r.sub && <span className="text-[12px] text-body"> {r.sub}</span>}
          </span>
          <span className="order-3 col-span-2 h-3 rounded-sm bg-[#efefef] sm:order-none sm:col-span-1">
            <span className="block h-3 rounded-sm" style={{ width: `${(r.value / max) * 100}%`, background: r.color ?? color }} />
          </span>
          <span className="text-right text-[14px] font-semibold text-charcoal">{r.display}</span>
        </li>
      ))}
    </ul>
  );
}

/** A ring split into segments, with the total in the middle. */
export function Donut({ segments, centre, centreLabel, summary }: { segments: { label: string; value: number; color: string }[]; centre: string; centreLabel: string; summary: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 70, c = 2 * Math.PI * r;
  const lengths = segments.map((s) => (s.value / total) * c);
  const offsets = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-auto w-full max-w-[220px]" role="img" aria-label={summary}>
      <circle cx="100" cy="100" r={r} fill="none" stroke="#efefef" strokeWidth="26" />
      {segments.map((s, i) => (
          <circle
            key={s.label}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="26"
            strokeDasharray={`${lengths[i]} ${c - lengths[i]}`}
            strokeDashoffset={-offsets[i]}
            transform="rotate(-90 100 100)"
          >
            <title>{`${s.label}: ${Math.round((s.value / total) * 100)}%`}</title>
          </circle>
      ))}
      <text x="100" y="98" textAnchor="middle" fontSize="20" fontWeight="700" fill="#303133">
        {centre}
      </text>
      <text x="100" y="118" textAnchor="middle" fontSize="11" fill="#6b6e72">
        {centreLabel}
      </text>
    </svg>
  );
}
