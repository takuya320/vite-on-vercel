import type { InterventionImpact, InterventionStatus } from '../data'

type ImpactProps = { kind: 'impact'; value: InterventionImpact }
type StatusProps = { kind: 'status'; value: InterventionStatus }

type Props = ImpactProps | StatusProps

const IMPACT_CSS: Record<InterventionImpact, string> = {
  high: 'dash-badge dash-badge--p1',
  medium: 'dash-badge dash-badge--p2',
  low: 'dash-badge dash-badge--p3',
}

const IMPACT_LABEL: Record<InterventionImpact, string> = {
  high: '影響大',
  medium: '影響中',
  low: '影響小',
}

const STATUS_CSS: Record<InterventionStatus, string> = {
  requested: 'dash-badge dash-badge--p3',
  in_progress: 'dash-badge dash-badge--investigating',
  completed: 'dash-badge dash-badge--resolved',
  rolled_back: 'dash-badge dash-badge--mitigated',
}

const STATUS_LABEL: Record<InterventionStatus, string> = {
  requested: '依頼受付',
  in_progress: '実施中',
  completed: '完了',
  rolled_back: 'ロールバック',
}

export default function StatusBadge(props: Props) {
  if (props.kind === 'impact') {
    return (
      <span className={IMPACT_CSS[props.value]}>
        <span className="dash-badge__dot" aria-hidden />
        {IMPACT_LABEL[props.value]}
      </span>
    )
  }
  return (
    <span className={STATUS_CSS[props.value]}>
      <span className="dash-badge__dot" aria-hidden />
      {STATUS_LABEL[props.value]}
    </span>
  )
}
