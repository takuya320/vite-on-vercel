import { useToast } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { metricDefs, type MetricDef } from '../data'
import { useOrg } from '../orgContext'

const CATEGORIES = [
  { id: 'all' as const, label: 'すべて' },
  { id: 'business' as const, label: 'ビジネス' },
  { id: 'operations' as const, label: '運用' },
  { id: 'quality' as const, label: '品質' },
  { id: 'cost' as const, label: 'コスト' },
]
type CatId = (typeof CATEGORIES)[number]['id']

const CATEGORY_LABEL: Record<MetricDef['category'], string> = {
  business: 'ビジネス',
  operations: '運用',
  quality: '品質',
  cost: 'コスト',
}

function arrow(t: MetricDef['trend']): string {
  return t === 'up' ? '▲' : t === 'down' ? '▼' : '◆'
}

export default function MetricsPage() {
  const toast = useToast()
  const { activeOrg } = useOrg()
  const [cat, setCat] = useState<CatId>('all')

  const orgMetrics = useMemo(() => metricDefs.filter((m) => m.organizationId === activeOrg.id), [activeOrg.id])
  const filtered = cat === 'all' ? orgMetrics : orgMetrics.filter((m) => m.category === cat)

  function open(m: MetricDef) {
    toast({
      title: `${m.name} の詳細`,
      description: `現在値 ${m.currentValue} · ${m.threshold}`,
      status: 'info',
      duration: 2000,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`指標 / ${activeOrg.name}`}
        title="指標カタログ"
        subtitle="この組織で監視している指標と、しきい値・現在値の一覧です。指標は組織ごとに独立しています。"
      />

      <div className="dash-toolbar dash-reveal" data-i={1} style={{ justifyContent: 'flex-start' }}>
        <div className="dash-toolbar__group">
          <span className="dash-select__label">カテゴリ</span>
          <div className="dash-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`dash-tab${cat === c.id ? ' dash-tab--active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-toolbar__spacer" />
        <span className="dash-meta-pill">
          {filtered.length} 件 / 全 {orgMetrics.length}
        </span>
      </div>

      <div className="dash-card dash-tablecard dash-reveal" data-i={2}>
        <div className="dash-card__head">
          <div>
            <h3 className="dash-card__title">指標一覧</h3>
            <div className="dash-card__sub">クリックで詳細</div>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>指標</th>
                <th>カテゴリ</th>
                <th>現在値</th>
                <th>前週比</th>
                <th>しきい値</th>
                <th>定義</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const isBad = m.category === 'quality' || m.category === 'cost' ? m.trend === 'up' : m.trend === 'down'
                const isGood = m.category === 'quality' || m.category === 'cost' ? m.trend === 'down' : m.trend === 'up'
                const cls = isBad ? 'dash-kpi__delta--bad' : isGood ? 'dash-kpi__delta--up' : 'dash-kpi__delta--flat'
                return (
                  <tr
                    key={m.id}
                    tabIndex={0}
                    onClick={() => open(m)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(m))}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div className="dash-table__id" style={{ marginTop: 2 }}>
                        {m.id}
                      </div>
                    </td>
                    <td>
                      <span className="dash-meta-pill">{CATEGORY_LABEL[m.category]}</span>
                    </td>
                    <td>
                      <span className="dash-table__service">{m.currentValue}</span>
                    </td>
                    <td>
                      <span className={cls} style={{ fontFamily: 'var(--dash-font-mono)', fontSize: 12 }}>
                        {arrow(m.trend)} {m.delta > 0 ? '+' : ''}
                        {m.delta.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className="dash-table__time">{m.threshold}</span>
                    </td>
                    <td>
                      <p className="dash-table__summary">{m.description}</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
