import { useMemo, useState } from 'react'
import type { ChartPoint } from '../data'

type Props = {
  data: ChartPoint[]
}

const VIEW_W = 820
const VIEW_H = 300
const PAD = { top: 24, right: 56, bottom: 30, left: 12 }

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

export default function Chart({ data }: Props) {
  const [hover, setHover] = useState<number | null>(null)

  const computed = useMemo(() => {
    const innerW = VIEW_W - PAD.left - PAD.right
    const innerH = VIEW_H - PAD.top - PAD.bottom

    const allValues = data.flatMap((d) => [d.current, d.previous])
    const rawMin = Math.min(...allValues)
    const rawMax = Math.max(...allValues)
    const span = rawMax - rawMin || 1
    const min = Math.max(0, rawMin - span * 0.18)
    const max = rawMax + span * 0.1
    const range = max - min || 1

    const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW
    const y = (v: number) => PAD.top + (1 - (v - min) / range) * innerH

    const cur = data.map((d, i) => ({ x: x(i), y: y(d.current) }))
    const prev = data.map((d, i) => ({ x: x(i), y: y(d.previous) }))
    const linePath = smoothPath(cur)
    const prevPath = smoothPath(prev)
    const last = cur[cur.length - 1]
    const baseline = PAD.top + innerH
    const areaPath = `${linePath} L ${last.x} ${baseline} L ${cur[0].x} ${baseline} Z`

    const yTicks = 4
    const ticks = Array.from({ length: yTicks + 1 }).map((_, k) => {
      const v = min + (range * k) / yTicks
      return { v, y: y(v) }
    })

    return { cur, prev, linePath, prevPath, areaPath, ticks, last }
  }, [data])

  const totalCurrent = data.reduce((sum, d) => sum + d.current, 0)
  const totalPrevious = data.reduce((sum, d) => sum + d.previous, 0)
  const deltaPct = ((totalCurrent - totalPrevious) / totalPrevious) * 100
  const lastDate = data[data.length - 1]?.label ?? ''

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * VIEW_W
    const ratio = (px - PAD.left) / (VIEW_W - PAD.left - PAD.right)
    const idx = Math.round(ratio * (data.length - 1))
    if (idx >= 0 && idx < data.length) setHover(idx)
  }

  const xLabelEvery = Math.max(1, Math.floor(data.length / 7))
  const hoverPoint = hover != null ? computed.cur[hover] : null
  const hoverPrev = hover != null ? computed.prev[hover] : null

  return (
    <div className="dash-card dash-chart dash-reveal" data-i={4}>
      <div className="dash-chart__head">
        <div>
          <h3 className="dash-card__title">売上推移</h3>
          <div className="dash-card__sub">日次 / 前期との比較</div>
          <div className="dash-chart__big-num">
            ¥{totalCurrent.toFixed(1)}M
            <span className="dash-chart__big-unit">
              前期比 {deltaPct >= 0 ? '+' : ''}
              {deltaPct.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="dash-chart__legend">
          <span className="dash-chart__legend-item">
            <span className="dash-chart__legend-swatch" /> 当期
          </span>
          <span className="dash-chart__legend-item">
            <span className="dash-chart__legend-swatch dash-chart__legend-swatch--prev" /> 前期
          </span>
        </div>
      </div>

      <div className="dash-chart__svg-wrap">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="dash-chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--dash-accent)" stopOpacity="0.28" />
              <stop offset="60%" stopColor="var(--dash-accent)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--dash-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* y grid */}
          <g className="dash-chart__grid">
            {computed.ticks.map((t, i) => (
              <line key={i} x1={PAD.left} x2={VIEW_W - PAD.right} y1={t.y} y2={t.y} />
            ))}
          </g>

          {/* y axis labels (right side, mono) */}
          <g className="dash-chart__axis">
            {computed.ticks.map((t, i) => (
              <text key={i} x={VIEW_W - PAD.right + 8} y={t.y + 3} textAnchor="start">
                ¥{t.v.toFixed(1)}M
              </text>
            ))}
          </g>

          {/* previous period (dashed) */}
          <path d={computed.prevPath} className="dash-chart__line-prev" />

          {/* current area + line */}
          <path d={computed.areaPath} className="dash-chart__area" />
          <path d={computed.linePath} className="dash-chart__line" />

          {/* end dot + floating label */}
          <circle cx={computed.last.x} cy={computed.last.y} r={5} className="dash-chart__end-dot" />
          <text x={computed.last.x - 6} y={computed.last.y - 12} textAnchor="end" className="dash-chart__end-label">
            {lastDate}
          </text>

          {/* x axis labels */}
          <g className="dash-chart__axis">
            {data.map((d, i) =>
              i % xLabelEvery === 0 || i === data.length - 1 ? (
                <text key={i} x={computed.cur[i].x} y={VIEW_H - PAD.bottom + 18} textAnchor="middle">
                  {d.label}
                </text>
              ) : null,
            )}
          </g>

          {/* hover crosshair */}
          {hoverPoint && (
            <g pointerEvents="none">
              <line
                x1={hoverPoint.x}
                x2={hoverPoint.x}
                y1={PAD.top}
                y2={VIEW_H - PAD.bottom}
                stroke="var(--dash-ink)"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.4"
              />
              <circle
                cx={hoverPoint.x}
                cy={hoverPoint.y}
                r={5}
                fill="var(--dash-accent)"
                stroke="var(--dash-surface-2)"
                strokeWidth="2.5"
              />
              {hoverPrev && (
                <circle
                  cx={hoverPrev.x}
                  cy={hoverPrev.y}
                  r={3.5}
                  fill="var(--dash-surface-2)"
                  stroke="var(--dash-ink-3)"
                  strokeWidth="1.4"
                />
              )}
            </g>
          )}

          {/* hover hit area */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={VIEW_W - PAD.left - PAD.right}
            height={VIEW_H - PAD.top - PAD.bottom}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHover(null)}
          />
        </svg>

        {hover != null && (
          <div
            style={{
              position: 'absolute',
              left: `${(computed.cur[hover].x / VIEW_W) * 100}%`,
              top: 4,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              background: 'var(--dash-popover-bg)',
              color: 'var(--dash-popover-fg)',
              borderRadius: 6,
              padding: '8px 12px',
              fontFamily: 'var(--dash-font-mono)',
              fontSize: 11,
              letterSpacing: '0.02em',
              boxShadow: 'var(--dash-shadow-2)',
              whiteSpace: 'nowrap',
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, letterSpacing: '0.1em' }}>
              {data[hover].label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
              <span>当期</span>
              <b>¥{data[hover].current.toFixed(2)}M</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, opacity: 0.7 }}>
              <span>前期</span>
              <span>¥{data[hover].previous.toFixed(2)}M</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
