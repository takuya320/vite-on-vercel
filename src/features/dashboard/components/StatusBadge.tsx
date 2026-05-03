import type { IncidentStatus } from '../data'

type SeverityProps = { kind: 'severity'; value: 'P1' | 'P2' | 'P3' }
type StatusProps = { kind: 'status'; value: IncidentStatus }

type Props = SeverityProps | StatusProps

const STATUS_LABEL: Record<IncidentStatus, string> = {
  open: 'Open',
  investigating: 'Investigating',
  mitigated: 'Mitigated',
  resolved: 'Resolved',
}

export default function StatusBadge(props: Props) {
  if (props.kind === 'severity') {
    const cls = `dash-badge dash-badge--${props.value.toLowerCase()}`
    return (
      <span className={cls}>
        <span className="dash-badge__dot" aria-hidden />
        {props.value}
      </span>
    )
  }
  const cls = `dash-badge dash-badge--${props.value}`
  return (
    <span className={cls}>
      <span className="dash-badge__dot" aria-hidden />
      {STATUS_LABEL[props.value]}
    </span>
  )
}
