import { Tooltip } from '@chakra-ui/react'
import type { Kpi } from '../data'
import Sparkline from './Sparkline'

type Props = {
  kpi: Kpi
  /** When true, an "up" trend is bad (e.g. error counts). Inverts the colour. */
  invert?: boolean
  index?: number
  loading?: boolean
  onClick?: () => void
}

function arrow(trend: 'up' | 'down' | 'flat'): string {
  if (trend === 'up') return '▲'
  if (trend === 'down') return '▼'
  return '◆'
}

export default function KpiCard({ kpi, invert = false, index = 0, loading = false, onClick }: Props) {
  const isBad = invert ? kpi.trend === 'up' : kpi.trend === 'down'
  const isGood = invert ? kpi.trend === 'down' : kpi.trend === 'up'
  const deltaCls = isBad
    ? 'dash-kpi__delta dash-kpi__delta--bad'
    : isGood
      ? 'dash-kpi__delta dash-kpi__delta--up'
      : 'dash-kpi__delta dash-kpi__delta--flat'

  const cardCls = [
    'dash-kpi',
    'dash-reveal',
    invert && isBad ? 'dash-kpi--flagged' : '',
    onClick ? 'dash-kpi--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  function handleKey(e: React.KeyboardEvent) {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <article
      className={cardCls}
      data-i={index}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKey : undefined}
      aria-busy={loading || undefined}
    >
      <div className="dash-kpi__top">
        <span className="dash-kpi__label">{kpi.label}</span>
        <Tooltip
          label={kpi.helpText}
          placement="top"
          hasArrow
          fontFamily="'Plus Jakarta Sans', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif"
          fontSize="12px"
          fontWeight={500}
          lineHeight="1.5"
          bg="var(--dash-popover-bg)"
          color="var(--dash-popover-fg)"
          px="10px"
          py="8px"
          borderRadius="6px"
          maxW="280px"
          boxShadow="var(--dash-shadow-2)"
        >
          <span className="dash-kpi__help" aria-label="指標の説明" onClick={(e) => e.stopPropagation()}>
            ?
          </span>
        </Tooltip>
      </div>
      {loading ? (
        <>
          <span className="dash-skel" style={{ display: 'block', width: '70%', height: 30, marginTop: 4 }} />
          <span className="dash-skel" style={{ display: 'block', width: '45%', height: 12, marginTop: 14 }} />
          <div className="dash-kpi__spark">
            <span className="dash-skel" style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
        </>
      ) : (
        <>
          <div className="dash-kpi__value">
            {kpi.value}
            {kpi.unit && <span className="dash-kpi__unit">{kpi.unit}</span>}
          </div>
          <div className={deltaCls}>
            <span className="dash-kpi__delta-arrow">{arrow(kpi.trend)}</span>
            <span>
              {kpi.delta > 0 ? '+' : ''}
              {kpi.delta.toFixed(1)}%
            </span>
            <span className="dash-kpi__delta-compare">vs 前週</span>
          </div>
          <div className="dash-kpi__spark">
            <Sparkline values={kpi.spark} trendBad={isBad} />
          </div>
        </>
      )}
    </article>
  )
}
