type Props = {
  values: number[]
  trendBad?: boolean
  height?: number
}

const W = 200
const PAD_X = 2
const PAD_Y = 6

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  const n = pts.length
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n - 1, i + 2)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

export default function Sparkline({ values, trendBad = false, height = 56 }: Props) {
  if (values.length === 0) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const innerH = height - PAD_Y * 2
  const innerW = W - PAD_X * 2
  const pts = values.map((v, i) => ({
    x: PAD_X + (i / (values.length - 1)) * innerW,
    y: PAD_Y + (1 - (v - min) / range) * innerH,
  }))
  const path = smoothPath(pts)
  const last = pts[pts.length - 1]
  const baselineY = height - PAD_Y
  const areaPath = `${path} L ${last.x} ${baselineY} L ${pts[0].x} ${baselineY} Z`
  const stroke = trendBad ? 'var(--dash-negative)' : 'var(--dash-accent)'
  const gradId = `dash-spark-grad-${trendBad ? 'bad' : 'ok'}`
  return (
    <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r={2.4} fill={stroke} />
    </svg>
  )
}
