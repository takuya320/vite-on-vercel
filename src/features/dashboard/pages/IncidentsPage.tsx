import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import { incidents, type IncidentStatus } from '../data'
import { useOrg } from '../orgContext'

const STATUS_TABS: ReadonlyArray<{ id: 'all' | IncidentStatus; label: string }> = [
  { id: 'all', label: 'すべて' },
  { id: 'open', label: 'オープン' },
  { id: 'investigating', label: '調査中' },
  { id: 'mitigated', label: '緩和済' },
  { id: 'resolved', label: '解決済' },
]

export default function IncidentsPage() {
  const { activeOrg } = useOrg()
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]['id']>('all')

  const orgIncidents = useMemo(() => incidents.filter((i) => i.organizationId === activeOrg.id), [activeOrg.id])

  const stats = useMemo(() => {
    return {
      total: orgIncidents.length,
      open: orgIncidents.filter((i) => i.status === 'open').length,
      investigating: orgIncidents.filter((i) => i.status === 'investigating').length,
      mitigated: orgIncidents.filter((i) => i.status === 'mitigated').length,
      resolved: orgIncidents.filter((i) => i.status === 'resolved').length,
      p1: orgIncidents.filter((i) => i.severity === 'P1').length,
    }
  }, [orgIncidents])

  const filtered = tab === 'all' ? orgIncidents : orgIncidents.filter((i) => i.status === tab)

  return (
    <>
      <PageHeader
        eyebrow={`インシデント / ${activeOrg.name}`}
        title="インシデント管理"
        subtitle="検知された障害・劣化イベントを一覧。重要度・ステータス・担当者で絞り込めます。"
      />

      <div className="dash-stat-row dash-reveal" data-i={1}>
        <div className="dash-stat">
          <div className="dash-stat__label">合計</div>
          <div className="dash-stat__value">{stats.total}</div>
          <div className="dash-stat__sub">過去 24 時間</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">未解決</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-negative)' }}>
            {stats.open + stats.investigating}
          </div>
          <div className="dash-stat__sub">オープン + 調査中</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">P1 件数</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-accent)' }}>
            {stats.p1}
          </div>
          <div className="dash-stat__sub">最高重要度</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">解決済</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-positive)' }}>
            {stats.resolved}
          </div>
        </div>
      </div>

      <div className="dash-toolbar dash-reveal" data-i={2} style={{ justifyContent: 'flex-start' }}>
        <div className="dash-toolbar__group">
          <span className="dash-select__label">ステータス</span>
          <div className="dash-tabs">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`dash-tab${tab === t.id ? ' dash-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-toolbar__spacer" />
        <span className="dash-meta-pill">{filtered.length} 件</span>
      </div>

      <DataTable data={filtered} />
    </>
  )
}
