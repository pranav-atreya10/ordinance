type Point = { day: string; count: number };

export function QuestionsChart({ data }: { data: Point[] }) {
  const W = 640, H = 220, padL = 28, padB = 26, padT = 12;
  const max = Math.max(5, ...data.map((d) => d.count));
  const nice = Math.ceil(max / 10) * 10;
  const bw = (W - padL) / data.length;
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / nice);
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Questions per day for the last 14 days">
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={padL} x2={W} y1={y(nice * t)} y2={y(nice * t)} stroke="var(--color-line)" strokeDasharray={t === 0 ? "" : "3 4"} />
          <text x={padL - 8} y={y(nice * t) + 4} textAnchor="end" fontSize="10.5" fill="var(--color-faint)">{Math.round(nice * t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = padL + i * bw + bw * 0.18;
        const last = i === data.length - 1;
        return (
          <g key={d.day}>
            <rect x={x} y={y(d.count)} width={bw * 0.64} height={Math.max(0, y(0) - y(d.count))} rx={4}
              fill={last ? "var(--color-forest)" : "var(--color-moss)"} opacity={last ? 1 : 0.55}>
              <title>{`${fmt(d.day)}: ${d.count} questions`}</title>
            </rect>
            {(i % 3 === 0 || last) && (
              <text x={x + bw * 0.32} y={H - 8} textAnchor="middle" fontSize="10.5" fill="var(--color-faint)">{fmt(d.day)}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
