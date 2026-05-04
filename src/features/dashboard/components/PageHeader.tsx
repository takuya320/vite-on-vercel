import LastUpdated from './LastUpdated'

type Props = {
  eyebrow: string
  title: string
  subtitle?: string
  lastUpdatedAt?: string
  rightSlot?: React.ReactNode
}

export default function PageHeader({ eyebrow, title, subtitle, lastUpdatedAt, rightSlot }: Props) {
  return (
    <header className="dash-pageheader dash-reveal" data-i={0}>
      <div>
        <div className="dash-pageheader__eyebrow">{eyebrow}</div>
        <h1 className="dash-pageheader__title">{title}</h1>
        {subtitle && <p className="dash-pageheader__subtitle">{subtitle}</p>}
      </div>
      <div className="dash-pageheader__meta">
        {rightSlot}
        {lastUpdatedAt && <LastUpdated at={lastUpdatedAt} />}
      </div>
    </header>
  )
}
