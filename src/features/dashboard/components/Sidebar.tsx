import { useToast } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  to: string
  label: string
  badge?: string
  icon: JSX.Element
}

const G = (path: string) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d={path} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const USAGE: NavItem[] = [
  { to: '/', label: '概要', icon: G('M2 9l6-5 6 5v5H2V9zM7 14V11h2v3') },
  { to: '/metrics', label: '利用指標', icon: G('M2 13V3M2 13h11M5 10V7M8 10V5M11 10V8') },
  {
    to: '/organizations',
    label: '組織別',
    badge: 'NEW',
    icon: G('M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 14a5 5 0 0 1 10 0'),
  },
  { to: '/segments', label: 'セグメント', icon: G('M8 1v14M1 8h14M3 3l10 10M13 3L3 13') },
]

const INTERVENTION: NavItem[] = [
  {
    to: '/interventions',
    label: '介入履歴',
    badge: '3',
    icon: G('M3 8l3-3 4 4 3-3M3 13h10'),
  },
  { to: '/audit', label: '監査ログ', icon: G('M3 2h7l3 3v9H3V2zM10 2v3h3') },
]

const MANAGEMENT: NavItem[] = [
  {
    to: '/members',
    label: 'メンバー',
    icon: G(
      'M5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM11 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1 14a4 4 0 0 1 8 0M9 14a4 4 0 0 1 6 0',
    ),
  },
  {
    to: '/settings',
    label: '設定',
    icon: G(
      'M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 1v2M8 13v2M2 8h2M12 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5L5 11M11 5l1.5-1.5',
    ),
  },
]

type SectionProps = {
  title: string
  items: NavItem[]
  pathname: string
}

function Section({ title, items, pathname }: SectionProps) {
  return (
    <div>
      <div className="dash-side__group-title">{title}</div>
      {items.map((item) => {
        const active = pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`dash-side__item${active ? ' dash-side__item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="dash-side__item-glyph">{item.icon}</span>
            <span className="dash-side__item-label">{item.label}</span>
            {item.badge && <span className="dash-side__item-badge">{item.badge}</span>}
          </Link>
        )
      })}
    </div>
  )
}

export default function Sidebar() {
  const toast = useToast()
  const { pathname } = useLocation()

  return (
    <aside className="dash-side" aria-label="主要ナビゲーション">
      <div className="dash-side__brand">
        <div className="dash-side__brand-mark">M</div>
        <div className="dash-side__brand-name">Meridian Ops</div>
      </div>
      <nav className="dash-side__nav">
        <Section title="利用実態" items={USAGE} pathname={pathname} />
        <Section title="介入" items={INTERVENTION} pathname={pathname} />
        <Section title="管理" items={MANAGEMENT} pathname={pathname} />
      </nav>
      <button
        type="button"
        className="dash-side__foot"
        onClick={() =>
          toast({
            title: 'サービスステータス',
            description: '全システム正常稼働中（モック）',
            status: 'success',
            duration: 1500,
            position: 'top-right',
          })
        }
      >
        <span className="dash-side__foot-dot" />
        <span className="dash-side__foot-text">All systems operational · v4.2.0</span>
      </button>
    </aside>
  )
}
