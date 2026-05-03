import LastUpdated from './LastUpdated'

type Props = {
  lastUpdatedAt: string
}

export default function PageHeader({ lastUpdatedAt }: Props) {
  return (
    <header className="dash-pageheader dash-reveal" data-i={0}>
      <div>
        <div className="dash-pageheader__eyebrow">業務概要 / 2026 Q2</div>
        <h1 className="dash-pageheader__title">業務ダッシュボード</h1>
        <p className="dash-pageheader__subtitle">
          売上・運用状況・インシデントを一画面で把握できます。各指標から詳細ページへ遷移できます。
        </p>
      </div>
      <div className="dash-pageheader__meta">
        <LastUpdated at={lastUpdatedAt} />
      </div>
    </header>
  )
}
