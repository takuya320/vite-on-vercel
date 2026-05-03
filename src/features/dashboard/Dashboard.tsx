import { ChakraProvider, extendTheme, useToast } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import Chart from './components/Chart'
import DataTable from './components/DataTable'
import Header from './components/Header'
import KpiCard from './components/KpiCard'
import PageHeader from './components/PageHeader'
import RankingList from './components/RankingList'
import Sidebar from './components/Sidebar'
import { EmptyState } from './components/States'
import Toolbar, { PresetId, Range } from './components/Toolbar'
import { chartSeries, incidents, kpis, ranking, type Kpi } from './data'
import './dashboard.css'

const theme = extendTheme({
  fonts: {
    body: "'Plus Jakarta Sans', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif",
    heading: "'Plus Jakarta Sans', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif",
    mono: "'JetBrains Mono', Menlo, monospace",
  },
  styles: {
    global: {
      body: {
        bg: 'transparent',
      },
    },
  },
})

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function formatTimestamp(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} JST`
}

function initialRange(): Range {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 29)
  return { start, end }
}

function DashboardContent() {
  const toast = useToast()
  const [range, setRange] = useState<Range>(() => initialRange())
  const [presetId, setPresetId] = useState<PresetId>('month')
  const [org, setOrg] = useState('全社')
  const [segment, setSegment] = useState('全プラン')
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    document.body.classList.add('dash-active')
    return () => {
      document.body.classList.remove('dash-active')
    }
  }, [])

  function handleRefresh() {
    if (isRefreshing) return
    setIsRefreshing(true)
    window.setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated(new Date())
      toast({
        title: '最新データを取得しました',
        status: 'success',
        duration: 1600,
        position: 'top-right',
      })
    }, 700)
  }

  function openKpi(kpi: Kpi) {
    toast({
      title: `${kpi.label} の詳細`,
      description: `現在値 ${kpi.value}${kpi.unit ?? ''} / ${kpi.delta > 0 ? '+' : ''}${kpi.delta.toFixed(1)}% (前週比)`,
      status: 'info',
      duration: 2000,
      position: 'top-right',
    })
  }

  const hasFilter = org !== '全社' || segment !== '全プラン'
  const lastUpdatedStr = useMemo(() => formatTimestamp(lastUpdated), [lastUpdated])

  return (
    <div className="dash-root">
      <Sidebar />
      <Header />
      <main className="dash-main">
        <PageHeader lastUpdatedAt={lastUpdatedStr} />
        <Toolbar
          range={range}
          onRangeChange={setRange}
          presetId={presetId}
          onPresetChange={setPresetId}
          org={org}
          onOrgChange={setOrg}
          segment={segment}
          onSegmentChange={setSegment}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {hasFilter && (
          <div className="dash-filter-bar" aria-label="適用中のフィルタ">
            <span className="dash-filter-bar__label">適用中:</span>
            {org !== '全社' && (
              <span className="dash-filter-chip">
                組織: {org}
                <button
                  type="button"
                  className="dash-filter-chip__close"
                  onClick={() => setOrg('全社')}
                  aria-label="組織フィルタを解除"
                >
                  ×
                </button>
              </span>
            )}
            {segment !== '全プラン' && (
              <span className="dash-filter-chip">
                プラン: {segment}
                <button
                  type="button"
                  className="dash-filter-chip__close"
                  onClick={() => setSegment('全プラン')}
                  aria-label="プランフィルタを解除"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        <section className="dash-kpi-grid" aria-label="主要指標">
          {kpis.map((kpi, i) => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
              invert={kpi.id === 'errors'}
              index={i}
              loading={isRefreshing}
              onClick={() => openKpi(kpi)}
            />
          ))}
        </section>

        <section className="dash-section">
          <Chart data={chartSeries} />
          <RankingList items={ranking} />
        </section>

        <DataTable data={incidents} />

        <section className="dash-card dash-reveal" data-i={6} aria-label="アラート">
          <div className="dash-card__head">
            <div>
              <h3 className="dash-card__title">しきい値アラート</h3>
              <div className="dash-card__sub">直近6時間</div>
            </div>
          </div>
          <EmptyState
            title="アラートはありません"
            description="設定済みの全しきい値が正常範囲内で推移中です。SLO・コスト・レイテンシのいずれも許容範囲内です。"
          />
        </section>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <DashboardContent />
    </ChakraProvider>
  )
}
