import { useToast } from '@chakra-ui/react'
import { useState } from 'react'

type NavItem = {
  id: string
  label: string
  badge?: string
  icon: JSX.Element
}

const G = (path: string) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d={path} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PRIMARY: NavItem[] = [
  { id: 'overview', label: '概要', icon: G('M2 9l6-5 6 5v5H2V9zM7 14V11h2v3') },
  { id: 'metrics', label: '指標', icon: G('M2 13V3M2 13h11M5 10V7M8 10V5M11 10V8') },
  {
    id: 'org',
    label: '組織別',
    badge: 'NEW',
    icon: G('M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 14a5 5 0 0 1 10 0'),
  },
  { id: 'segment', label: 'セグメント', icon: G('M8 1v14M1 8h14M3 3l10 10M13 3L3 13') },
]

const OPS: NavItem[] = [
  {
    id: 'incidents',
    label: 'インシデント',
    badge: '3',
    icon: G('M8 1v6M8 11v.01M8 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z'),
  },
  { id: 'jobs', label: 'バックグラウンド', icon: G('M3 8a5 5 0 0 1 9-3M13 8a5 5 0 0 1-9 3M12 2v3h-3M4 14v-3h3') },
  { id: 'audit', label: '監査ログ', icon: G('M3 2h7l3 3v9H3V2zM10 2v3h3') },
]

const SETTINGS: NavItem[] = [
  {
    id: 'team',
    label: 'メンバー',
    icon: G(
      'M5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM11 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1 14a4 4 0 0 1 8 0M9 14a4 4 0 0 1 6 0',
    ),
  },
  {
    id: 'settings',
    label: '設定',
    icon: G(
      'M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 1v2M8 13v2M2 8h2M12 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5L5 11M11 5l1.5-1.5',
    ),
  },
]

type SectionProps = {
  title: string
  items: NavItem[]
  active: string
  onSelect: (item: NavItem) => void
}

function Section({ title, items, active, onSelect }: SectionProps) {
  return (
    <div>
      <div className="dash-side__group-title">{title}</div>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`dash-side__item${active === item.id ? ' dash-side__item--active' : ''}`}
          onClick={() => onSelect(item)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="dash-side__item-glyph">{item.icon}</span>
          <span className="dash-side__item-label">{item.label}</span>
          {item.badge && <span className="dash-side__item-badge">{item.badge}</span>}
        </button>
      ))}
    </div>
  )
}

export default function Sidebar() {
  const toast = useToast()
  const [active, setActive] = useState('overview')

  function handleSelect(item: NavItem) {
    setActive(item.id)
    if (item.id !== 'overview') {
      toast({
        title: `${item.label} に切り替えました`,
        description: '実装はモックです（このセッションでは概要のみレンダリングされます）',
        status: 'info',
        duration: 1600,
        position: 'top-right',
      })
    }
  }

  return (
    <aside className="dash-side" aria-label="主要ナビゲーション">
      <div className="dash-side__brand">
        <div className="dash-side__brand-mark">M</div>
        <div className="dash-side__brand-name">Meridian Ops</div>
      </div>
      <nav className="dash-side__nav">
        <Section title="概要" items={PRIMARY} active={active} onSelect={handleSelect} />
        <Section title="運用" items={OPS} active={active} onSelect={handleSelect} />
        <Section title="組織" items={SETTINGS} active={active} onSelect={handleSelect} />
      </nav>
      <div className="dash-side__foot">
        <span className="dash-side__foot-dot" />
        <span className="dash-side__foot-text">All systems operational · v4.2.0</span>
      </div>
    </aside>
  )
}
