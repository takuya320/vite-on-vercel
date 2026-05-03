import { useToast } from '@chakra-ui/react'
import DateRangePicker from './DateRangePicker'
import { kpis } from '../data'

export type Range = { start: Date; end: Date }

export type PresetId = 'today' | 'week' | 'month' | 'quarter' | 'ytd' | 'custom'

const PRESETS: ReadonlyArray<{ id: PresetId; label: string; days: number }> = [
  { id: 'today', label: '今日', days: 1 },
  { id: 'week', label: '7日間', days: 7 },
  { id: 'month', label: '30日間', days: 30 },
  { id: 'quarter', label: '90日間', days: 90 },
  { id: 'ytd', label: 'YTD', days: -1 },
]

const ORGS = ['全社', 'Aoyama Holdings', 'Kitazawa Foods', 'Hanazono Logistics']
const SEGMENTS = ['全プラン', 'Enterprise', 'Standard', 'Lite']

type Props = {
  range: Range
  onRangeChange: (r: Range) => void
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  org: string
  onOrgChange: (v: string) => void
  segment: string
  onSegmentChange: (v: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

function ymd(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

export default function Toolbar({
  range,
  onRangeChange,
  presetId,
  onPresetChange,
  org,
  onOrgChange,
  segment,
  onSegmentChange,
  onRefresh,
  isRefreshing,
}: Props) {
  const toast = useToast()

  function handlePreset(p: (typeof PRESETS)[number]) {
    onPresetChange(p.id)
    if (p.days === -1) {
      const now = new Date()
      onRangeChange({ start: new Date(now.getFullYear(), 0, 1), end: now })
    } else {
      const today = new Date()
      const start = new Date()
      start.setDate(today.getDate() - (p.days - 1))
      onRangeChange({ start, end: today })
    }
  }

  function handleCustomRange(r: Range) {
    onPresetChange('custom')
    onRangeChange(r)
  }

  function exportCsv() {
    const rows: string[][] = [
      ['指標', '値', '前週比'],
      ...kpis.map((k) => [k.label, k.value + (k.unit ?? ''), `${k.delta > 0 ? '+' : ''}${k.delta.toFixed(1)}%`]),
    ]
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-kpi-${ymd(range.start)}-${ymd(range.end)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: 'CSVをエクスポートしました',
      description: `${ymd(range.start)} – ${ymd(range.end)} の主要指標を出力`,
      status: 'success',
      duration: 2400,
      isClosable: true,
      position: 'top-right',
    })
  }

  async function shareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: '共有リンクをコピーしました',
        description: 'クリップボードに現在のフィルタ付き URL を保存しました。',
        status: 'info',
        duration: 2400,
        isClosable: true,
        position: 'top-right',
      })
    } catch {
      toast({ title: 'コピーに失敗しました', status: 'error', duration: 2400, position: 'top-right' })
    }
  }

  return (
    <div className="dash-toolbar dash-reveal" data-i={1}>
      <div className="dash-toolbar__group">
        <span className="dash-select__label">期間</span>
        <DateRangePicker value={range} onChange={handleCustomRange} />
      </div>

      <div className="dash-toolbar__group" role="group" aria-label="期間プリセット">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`dash-cal__preset${presetId === p.id ? ' dash-daterange__preset--active' : ''}`}
            onClick={() => handlePreset(p)}
            aria-pressed={presetId === p.id}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="dash-toolbar__group">
        <span className="dash-select__label">対象組織</span>
        <select className="dash-select" value={org} onChange={(e) => onOrgChange(e.target.value)} aria-label="対象組織">
          {ORGS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="dash-toolbar__group">
        <span className="dash-select__label">プラン</span>
        <select
          className="dash-select"
          value={segment}
          onChange={(e) => onSegmentChange(e.target.value)}
          aria-label="プラン"
        >
          {SEGMENTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="dash-toolbar__spacer" />

      <div className="dash-toolbar__group">
        <button
          className={`dash-iconbtn${isRefreshing ? ' dash-iconbtn--spin' : ''}`}
          type="button"
          aria-label="再読み込み"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="再読み込み"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8a5 5 0 0 1 9-3M13 8a5 5 0 0 1-9 3M12 2v3h-3M4 14v-3h3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="dash-btn" type="button" onClick={exportCsv}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1v9M5 7l3 3 3-3M2 13h12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          CSV 出力
        </button>
        <button className="dash-btn dash-btn--primary" type="button" onClick={shareLink}>
          ダッシュボード共有
        </button>
      </div>
    </div>
  )
}
