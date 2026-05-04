import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import {
  INTERVENTION_TYPE_LABEL,
  interventions,
  type InterventionStatus,
  type InterventionType,
} from '../data'
import { useOrg } from '../orgContext'

const STATUS_TABS: ReadonlyArray<{ id: 'all' | InterventionStatus; label: string }> = [
  { id: 'all', label: 'すべて' },
  { id: 'requested', label: '依頼受付' },
  { id: 'in_progress', label: '実施中' },
  { id: 'completed', label: '完了' },
  { id: 'rolled_back', label: 'ロールバック' },
]

const TYPE_OPTIONS: ReadonlyArray<{ id: 'all' | InterventionType; label: string }> = [
  { id: 'all', label: 'すべての種別' },
  ...(Object.entries(INTERVENTION_TYPE_LABEL) as [InterventionType, string][]).map(([id, label]) => ({ id, label })),
]

export default function InterventionsPage() {
  const { activeOrg } = useOrg()
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]['id']>('all')
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]['id']>('all')

  const orgInterventions = useMemo(
    () => interventions.filter((i) => i.organizationId === activeOrg.id),
    [activeOrg.id],
  )

  const stats = useMemo(() => {
    return {
      total: orgInterventions.length,
      inProgress: orgInterventions.filter((i) => i.status === 'in_progress').length,
      completed: orgInterventions.filter((i) => i.status === 'completed').length,
      highImpact: orgInterventions.filter((i) => i.impact === 'high').length,
    }
  }, [orgInterventions])

  const filtered = orgInterventions.filter((i) => {
    if (tab !== 'all' && i.status !== tab) return false
    if (type !== 'all' && i.type !== type) return false
    return true
  })

  return (
    <>
      <PageHeader
        eyebrow={`介入履歴 / ${activeOrg.name}`}
        title="サービスへの介入"
        subtitle="Admin が顧客サービスに対して実施したアクションの一覧。impersonate・データ修正・プラン変更・フィーチャーフラグ・顧客連絡などを記録します。"
      />

      <div className="dash-stat-row dash-reveal" data-i={1}>
        <div className="dash-stat">
          <div className="dash-stat__label">合計件数</div>
          <div className="dash-stat__value">{stats.total}</div>
          <div className="dash-stat__sub">直近 7 日</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">実施中</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-warn)' }}>
            {stats.inProgress}
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">影響大</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-accent)' }}>
            {stats.highImpact}
          </div>
          <div className="dash-stat__sub">プラン変更・FF展開など</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">完了</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-positive)' }}>
            {stats.completed}
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
        <div className="dash-toolbar__group">
          <span className="dash-select__label">種別</span>
          <select
            className="dash-select"
            value={type}
            onChange={(e) => setType(e.target.value as (typeof TYPE_OPTIONS)[number]['id'])}
            aria-label="種別"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="dash-toolbar__spacer" />
        <span className="dash-meta-pill">{filtered.length} 件</span>
      </div>

      <DataTable data={filtered} />
    </>
  )
}
