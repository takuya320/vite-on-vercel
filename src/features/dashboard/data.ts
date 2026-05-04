// =====================================================
// Domain types — multi-tenant N:N user/org with permissions
// =====================================================

export type Role = 'owner' | 'admin' | 'editor' | 'viewer'

export type Permission =
  | 'metrics:read'
  | 'metrics:write'
  | 'segments:manage'
  | 'incidents:manage'
  | 'audit:read'
  | 'members:manage'
  | 'settings:manage'
  | 'billing:manage'

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'オーナー',
  admin: '管理者',
  editor: '編集者',
  viewer: '閲覧者',
}

export const ROLE_DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    'metrics:read',
    'metrics:write',
    'segments:manage',
    'incidents:manage',
    'audit:read',
    'members:manage',
    'settings:manage',
    'billing:manage',
  ],
  admin: [
    'metrics:read',
    'metrics:write',
    'segments:manage',
    'incidents:manage',
    'audit:read',
    'members:manage',
    'settings:manage',
  ],
  editor: ['metrics:read', 'metrics:write', 'segments:manage', 'incidents:manage'],
  viewer: ['metrics:read', 'audit:read'],
}

export const PERMISSION_LABEL: Record<Permission, string> = {
  'metrics:read': '指標 閲覧',
  'metrics:write': '指標 編集',
  'segments:manage': 'セグメント 管理',
  'incidents:manage': 'インシデント 管理',
  'audit:read': '監査ログ 閲覧',
  'members:manage': 'メンバー 管理',
  'settings:manage': '設定 管理',
  'billing:manage': '請求 管理',
}

export type User = {
  id: string
  name: string
  email: string
  initials: string
}

export type Organization = {
  id: string
  name: string
  slug: string
  plan: 'Enterprise' | 'Standard' | 'Lite'
  region: string
  industry: string
  createdAt: string
  memberCount: number
}

export type Membership = {
  userId: string
  organizationId: string
  role: Role
  permissions: Permission[]
  joinedAt: string
}

// =====================================================
// User & Org data
// =====================================================

export const users: User[] = [
  { id: 'u-yamada', name: '山田 太郎', email: 'yamada.taro@example.com', initials: 'YT' },
  { id: 'u-sato', name: '佐藤 花子', email: 'sato.hanako@example.com', initials: 'SH' },
  { id: 'u-suzuki', name: '鈴木 一郎', email: 'suzuki.ichiro@example.com', initials: 'SI' },
  { id: 'u-tanaka', name: '田中 美咲', email: 'tanaka.misaki@example.com', initials: 'TM' },
  { id: 'u-watanabe', name: '渡辺 健', email: 'watanabe.ken@example.com', initials: 'WK' },
  { id: 'u-ito', name: '伊藤 涼', email: 'ito.ryo@example.com', initials: 'IR' },
  { id: 'u-nakamura', name: '中村 翔', email: 'nakamura.sho@example.com', initials: 'NS' },
  { id: 'u-kobayashi', name: '小林 結衣', email: 'kobayashi.yui@example.com', initials: 'KY' },
]

export const currentUserId = 'u-yamada'

export const organizations: Organization[] = [
  {
    id: 'o-aoyama',
    name: 'Aoyama Holdings',
    slug: 'aoyama',
    plan: 'Enterprise',
    region: '東京',
    industry: '小売',
    createdAt: '2024-01-15',
    memberCount: 28,
  },
  {
    id: 'o-kitazawa',
    name: 'Kitazawa Foods',
    slug: 'kitazawa',
    plan: 'Standard',
    region: '大阪',
    industry: '食品',
    createdAt: '2024-08-22',
    memberCount: 12,
  },
  {
    id: 'o-hanazono',
    name: 'Hanazono Logistics',
    slug: 'hanazono',
    plan: 'Enterprise',
    region: '福岡',
    industry: '物流',
    createdAt: '2023-11-03',
    memberCount: 47,
  },
  {
    id: 'o-mishima',
    name: 'Mishima Print',
    slug: 'mishima',
    plan: 'Lite',
    region: '静岡',
    industry: '印刷',
    createdAt: '2025-02-10',
    memberCount: 6,
  },
]

export const memberships: Membership[] = [
  // 山田 (current user) — 3 orgs with different roles
  {
    userId: 'u-yamada',
    organizationId: 'o-aoyama',
    role: 'admin',
    permissions: ROLE_DEFAULT_PERMISSIONS.admin,
    joinedAt: '2024-01-20',
  },
  {
    userId: 'u-yamada',
    organizationId: 'o-kitazawa',
    role: 'editor',
    permissions: ROLE_DEFAULT_PERMISSIONS.editor,
    joinedAt: '2024-09-01',
  },
  {
    userId: 'u-yamada',
    organizationId: 'o-hanazono',
    role: 'viewer',
    permissions: ROLE_DEFAULT_PERMISSIONS.viewer,
    joinedAt: '2024-03-15',
  },
  // o-aoyama members
  {
    userId: 'u-sato',
    organizationId: 'o-aoyama',
    role: 'owner',
    permissions: ROLE_DEFAULT_PERMISSIONS.owner,
    joinedAt: '2024-01-15',
  },
  {
    userId: 'u-suzuki',
    organizationId: 'o-aoyama',
    role: 'editor',
    permissions: ROLE_DEFAULT_PERMISSIONS.editor,
    joinedAt: '2024-02-10',
  },
  {
    userId: 'u-tanaka',
    organizationId: 'o-aoyama',
    role: 'viewer',
    permissions: ROLE_DEFAULT_PERMISSIONS.viewer,
    joinedAt: '2024-04-22',
  },
  {
    userId: 'u-nakamura',
    organizationId: 'o-aoyama',
    role: 'editor',
    permissions: [...ROLE_DEFAULT_PERMISSIONS.editor, 'audit:read'],
    joinedAt: '2024-06-12',
  },
  // o-kitazawa members
  {
    userId: 'u-watanabe',
    organizationId: 'o-kitazawa',
    role: 'owner',
    permissions: ROLE_DEFAULT_PERMISSIONS.owner,
    joinedAt: '2024-08-22',
  },
  {
    userId: 'u-sato',
    organizationId: 'o-kitazawa',
    role: 'admin',
    permissions: ROLE_DEFAULT_PERMISSIONS.admin,
    joinedAt: '2024-09-15',
  },
  {
    userId: 'u-ito',
    organizationId: 'o-kitazawa',
    role: 'editor',
    permissions: [...ROLE_DEFAULT_PERMISSIONS.editor, 'audit:read'],
    joinedAt: '2024-11-01',
  },
  // o-hanazono members
  {
    userId: 'u-tanaka',
    organizationId: 'o-hanazono',
    role: 'owner',
    permissions: ROLE_DEFAULT_PERMISSIONS.owner,
    joinedAt: '2023-11-03',
  },
  {
    userId: 'u-ito',
    organizationId: 'o-hanazono',
    role: 'admin',
    permissions: ROLE_DEFAULT_PERMISSIONS.admin,
    joinedAt: '2024-01-10',
  },
  {
    userId: 'u-kobayashi',
    organizationId: 'o-hanazono',
    role: 'editor',
    permissions: ROLE_DEFAULT_PERMISSIONS.editor,
    joinedAt: '2024-05-20',
  },
  // o-mishima members
  {
    userId: 'u-kobayashi',
    organizationId: 'o-mishima',
    role: 'owner',
    permissions: ROLE_DEFAULT_PERMISSIONS.owner,
    joinedAt: '2025-02-10',
  },
]

export function getMembership(userId: string, orgId: string): Membership | undefined {
  return memberships.find((m) => m.userId === userId && m.organizationId === orgId)
}

export function getOrgsForUser(userId: string): Organization[] {
  const ids = new Set(memberships.filter((m) => m.userId === userId).map((m) => m.organizationId))
  return organizations.filter((o) => ids.has(o.id))
}

export function getMembersOfOrg(orgId: string): Array<{ user: User; membership: Membership }> {
  return memberships
    .filter((m) => m.organizationId === orgId)
    .map((m) => ({ user: users.find((u) => u.id === m.userId)!, membership: m }))
}

// =====================================================
// KPI / Chart / Ranking — per-org
// =====================================================

export type Trend = 'up' | 'down' | 'flat'

export type Kpi = {
  id: string
  label: string
  value: string
  unit?: string
  delta: number
  trend: Trend
  spark: number[]
  helpText: string
}

export const kpisByOrg: Record<string, Kpi[]> = {
  'o-aoyama': [
    {
      id: 'gmv',
      label: '流通総額 (GMV)',
      value: '¥84,219,400',
      delta: 12.4,
      trend: 'up',
      spark: [42, 44, 46, 41, 50, 48, 52, 56, 60, 58, 64, 71],
      helpText: '対象組織における当該期間内の確定取引総額。返金・キャンセルを除く。',
    },
    {
      id: 'orders',
      label: '注文件数',
      value: '7,402',
      unit: '件',
      delta: 4.7,
      trend: 'up',
      spark: [55, 58, 60, 57, 62, 65, 63, 68, 70, 69, 72, 75],
      helpText: '与信成立した注文の件数。テスト注文・社内検証分は除外済み。',
    },
    {
      id: 'mau',
      label: '月間アクティブ',
      value: '128,940',
      unit: 'users',
      delta: -1.8,
      trend: 'down',
      spark: [80, 82, 79, 81, 78, 80, 76, 75, 74, 73, 71, 70],
      helpText: '直近30日間に1回以上ログインしたユニークユーザー数。',
    },
    {
      id: 'errors',
      label: '5xx エラー',
      value: '312',
      unit: 'incidents',
      delta: 38.6,
      trend: 'up',
      spark: [12, 14, 11, 18, 22, 19, 25, 28, 30, 33, 41, 48],
      helpText: 'バックエンドが返した 5xx 系の総数。0.1% を超えた場合はオンコールへ即連携。',
    },
  ],
  'o-kitazawa': [
    {
      id: 'gmv',
      label: '流通総額 (GMV)',
      value: '¥28,450,200',
      delta: 6.1,
      trend: 'up',
      spark: [30, 31, 33, 32, 34, 36, 35, 37, 38, 40, 39, 41],
      helpText: '対象組織における当該期間内の確定取引総額。返金・キャンセルを除く。',
    },
    {
      id: 'orders',
      label: '注文件数',
      value: '2,184',
      unit: '件',
      delta: 8.3,
      trend: 'up',
      spark: [40, 42, 44, 43, 46, 47, 48, 49, 51, 52, 54, 55],
      helpText: '与信成立した注文の件数。テスト注文・社内検証分は除外済み。',
    },
    {
      id: 'mau',
      label: '月間アクティブ',
      value: '34,210',
      unit: 'users',
      delta: 2.4,
      trend: 'up',
      spark: [60, 61, 62, 63, 65, 64, 66, 67, 68, 69, 70, 71],
      helpText: '直近30日間に1回以上ログインしたユニークユーザー数。',
    },
    {
      id: 'errors',
      label: '5xx エラー',
      value: '47',
      unit: 'incidents',
      delta: -12.0,
      trend: 'down',
      spark: [20, 22, 19, 18, 16, 15, 14, 13, 11, 10, 9, 9],
      helpText: 'バックエンドが返した 5xx 系の総数。0.1% を超えた場合はオンコールへ即連携。',
    },
  ],
  'o-hanazono': [
    {
      id: 'gmv',
      label: '流通総額 (GMV)',
      value: '¥124,850,000',
      delta: 18.2,
      trend: 'up',
      spark: [60, 62, 65, 67, 70, 73, 76, 80, 83, 87, 92, 96],
      helpText: '対象組織における当該期間内の確定取引総額。返金・キャンセルを除く。',
    },
    {
      id: 'orders',
      label: '配送件数',
      value: '14,820',
      unit: '件',
      delta: 9.8,
      trend: 'up',
      spark: [70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92],
      helpText: '対象期間内に発送完了した荷物の件数。再配達は含まない。',
    },
    {
      id: 'mau',
      label: '月間アクティブ',
      value: '98,540',
      unit: 'users',
      delta: 3.1,
      trend: 'up',
      spark: [70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82],
      helpText: '直近30日間に1回以上ログインしたユニークユーザー数。',
    },
    {
      id: 'errors',
      label: '5xx エラー',
      value: '188',
      unit: 'incidents',
      delta: 4.2,
      trend: 'up',
      spark: [22, 24, 23, 25, 26, 27, 26, 28, 29, 31, 30, 32],
      helpText: 'バックエンドが返した 5xx 系の総数。0.1% を超えた場合はオンコールへ即連携。',
    },
  ],
  'o-mishima': [
    {
      id: 'gmv',
      label: '流通総額 (GMV)',
      value: '¥3,840,500',
      delta: -2.4,
      trend: 'down',
      spark: [22, 21, 20, 22, 21, 20, 19, 20, 19, 18, 17, 18],
      helpText: '対象組織における当該期間内の確定取引総額。返金・キャンセルを除く。',
    },
    {
      id: 'orders',
      label: '受注件数',
      value: '184',
      unit: '件',
      delta: 0.0,
      trend: 'flat',
      spark: [12, 12, 13, 13, 12, 13, 13, 12, 13, 13, 12, 13],
      helpText: '与信成立した注文の件数。テスト注文・社内検証分は除外済み。',
    },
    {
      id: 'mau',
      label: '月間アクティブ',
      value: '1,420',
      unit: 'users',
      delta: 1.2,
      trend: 'up',
      spark: [15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19],
      helpText: '直近30日間に1回以上ログインしたユニークユーザー数。',
    },
    {
      id: 'errors',
      label: '5xx エラー',
      value: '4',
      unit: 'incidents',
      delta: 33.3,
      trend: 'up',
      spark: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
      helpText: 'バックエンドが返した 5xx 系の総数。0.1% を超えた場合はオンコールへ即連携。',
    },
  ],
}

export type ChartPoint = {
  label: string
  current: number
  previous: number
}

function genChart(base: number, trend: number): ChartPoint[] {
  const dates = Array.from({ length: 20 }, (_, i) => {
    const d = new Date(2026, 3, 14 + i)
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  })
  return dates.map((label, i) => {
    const ratio = i / (dates.length - 1)
    const current = +(base + base * trend * ratio + Math.sin(i * 0.7) * base * 0.05).toFixed(2)
    const previous = +(base * 0.92 + base * trend * 0.6 * ratio + Math.cos(i * 0.6) * base * 0.04).toFixed(2)
    return { label, current, previous }
  })
}

export const chartSeriesByOrg: Record<string, ChartPoint[]> = {
  'o-aoyama': genChart(4.2, 1.2),
  'o-kitazawa': genChart(1.4, 0.4),
  'o-hanazono': genChart(6.0, 1.8),
  'o-mishima': genChart(0.18, -0.1),
}

export type RankingItem = {
  rank: number
  name: string
  meta: string
  value: string
  delta: number
}

export const rankingByOrg: Record<string, RankingItem[]> = {
  'o-aoyama': [
    { rank: 1, name: '青山 渋谷店', meta: 'フラッグシップ / 渋谷', value: '¥18.4M', delta: 24.1 },
    { rank: 2, name: '青山 新宿東口店', meta: 'スタンダード / 新宿', value: '¥12.9M', delta: 11.7 },
    { rank: 3, name: '青山 銀座店', meta: 'プレミアム / 中央区', value: '¥9.6M', delta: 6.2 },
    { rank: 4, name: '青山 池袋店', meta: 'スタンダード / 豊島区', value: '¥7.2M', delta: -3.4 },
    { rank: 5, name: '青山 表参道店', meta: 'プレミアム / 港区', value: '¥5.8M', delta: 18.9 },
    { rank: 6, name: '青山 上野店', meta: 'スタンダード / 台東区', value: '¥4.4M', delta: 2.1 },
  ],
  'o-kitazawa': [
    { rank: 1, name: 'Kitazawa 心斎橋', meta: 'メインショップ / 大阪市', value: '¥8.9M', delta: 14.2 },
    { rank: 2, name: 'Kitazawa 神戸三宮', meta: 'スタンダード / 神戸市', value: '¥6.4M', delta: 7.8 },
    { rank: 3, name: 'Kitazawa 京都駅前', meta: 'スタンダード / 京都市', value: '¥4.7M', delta: 22.0 },
    { rank: 4, name: 'Kitazawa 梅田北', meta: 'プレミアム / 大阪市', value: '¥3.1M', delta: -1.2 },
    { rank: 5, name: 'Kitazawa 難波', meta: 'スタンダード / 大阪市', value: '¥2.6M', delta: 5.4 },
  ],
  'o-hanazono': [
    { rank: 1, name: '九州物流センター 福岡', meta: '基幹拠点 / 福岡市', value: '¥34.2M', delta: 21.4 },
    { rank: 2, name: '九州物流センター 北九州', meta: 'サブ拠点 / 北九州市', value: '¥28.5M', delta: 18.7 },
    { rank: 3, name: '熊本配送センター', meta: 'サブ拠点 / 熊本市', value: '¥18.1M', delta: 12.3 },
    { rank: 4, name: '長崎配送センター', meta: '小型 / 長崎市', value: '¥9.8M', delta: 8.9 },
    { rank: 5, name: '大分配送センター', meta: '小型 / 大分市', value: '¥7.4M', delta: -2.1 },
  ],
  'o-mishima': [
    { rank: 1, name: '富士工場', meta: 'メイン / 富士市', value: '¥1.9M', delta: -1.4 },
    { rank: 2, name: '沼津営業所', meta: 'サブ / 沼津市', value: '¥1.1M', delta: 2.8 },
    { rank: 3, name: '清水支店', meta: 'サブ / 静岡市', value: '¥0.7M', delta: -8.0 },
  ],
}

// =====================================================
// Operations: incidents / jobs / audit
// =====================================================

export type IncidentStatus = 'open' | 'investigating' | 'mitigated' | 'resolved'

export type Incident = {
  id: string
  organizationId: string
  occurredAt: string
  service: string
  summary: string
  severity: 'P1' | 'P2' | 'P3'
  status: IncidentStatus
  owner: string
}

export const incidents: Incident[] = [
  // o-aoyama
  {
    id: 'INC-2841',
    organizationId: 'o-aoyama',
    occurredAt: '2026-05-04 02:14',
    service: 'checkout-api',
    summary: '決済認可APIの p99 レイテンシが SLO を 12 分間超過',
    severity: 'P1',
    status: 'investigating',
    owner: '中村 翔',
  },
  {
    id: 'INC-2840',
    organizationId: 'o-aoyama',
    occurredAt: '2026-05-04 00:51',
    service: 'search-indexer',
    summary: 'インデックス再構築ジョブが 3 回連続で失敗',
    severity: 'P2',
    status: 'mitigated',
    owner: '佐藤 花子',
  },
  {
    id: 'INC-2839',
    organizationId: 'o-aoyama',
    occurredAt: '2026-05-03 22:08',
    service: 'notification-worker',
    summary: 'Slack Webhook がレート制限に到達 / バックオフ動作中',
    severity: 'P3',
    status: 'open',
    owner: '鈴木 一郎',
  },
  {
    id: 'INC-2838',
    organizationId: 'o-aoyama',
    occurredAt: '2026-05-03 19:42',
    service: 'billing-job',
    summary: '請求バッチで 4 件の重複レコードを検知',
    severity: 'P2',
    status: 'resolved',
    owner: '田中 美咲',
  },
  {
    id: 'INC-2837',
    organizationId: 'o-aoyama',
    occurredAt: '2026-05-03 17:20',
    service: 'auth-gateway',
    summary: 'リフレッシュトークンの検証エラーが 0.4% に上昇',
    severity: 'P3',
    status: 'resolved',
    owner: '中村 翔',
  },
  // o-kitazawa
  {
    id: 'INC-1184',
    organizationId: 'o-kitazawa',
    occurredAt: '2026-05-04 03:02',
    service: 'order-api',
    summary: '注文 API でタイムアウトが断続的に発生',
    severity: 'P2',
    status: 'investigating',
    owner: '渡辺 健',
  },
  {
    id: 'INC-1183',
    organizationId: 'o-kitazawa',
    occurredAt: '2026-05-03 20:15',
    service: 'inventory-sync',
    summary: '在庫同期ジョブが 1 回失敗 / 自動復旧',
    severity: 'P3',
    status: 'resolved',
    owner: '伊藤 涼',
  },
  // o-hanazono
  {
    id: 'INC-3102',
    organizationId: 'o-hanazono',
    occurredAt: '2026-05-04 01:48',
    service: 'tracking-api',
    summary: '配送ステータス更新の遅延が 8 分発生',
    severity: 'P2',
    status: 'mitigated',
    owner: '田中 美咲',
  },
  {
    id: 'INC-3101',
    organizationId: 'o-hanazono',
    occurredAt: '2026-05-03 23:30',
    service: 'route-optimizer',
    summary: 'ルート最適化ジョブの実行時間が SLO を超過',
    severity: 'P3',
    status: 'open',
    owner: '伊藤 涼',
  },
  {
    id: 'INC-3100',
    organizationId: 'o-hanazono',
    occurredAt: '2026-05-03 14:05',
    service: 'driver-app',
    summary: 'ドライバーアプリのプッシュ通知が 6 件失敗',
    severity: 'P3',
    status: 'resolved',
    owner: '小林 結衣',
  },
  // o-mishima (smaller)
  {
    id: 'INC-0042',
    organizationId: 'o-mishima',
    occurredAt: '2026-05-03 16:18',
    service: 'print-queue',
    summary: '印刷キュー監視で連続 2 件の警告',
    severity: 'P3',
    status: 'investigating',
    owner: '小林 結衣',
  },
]

export type JobStatus = 'success' | 'failed' | 'running' | 'queued'

export type Job = {
  id: string
  organizationId: string
  name: string
  schedule: string
  lastRunAt: string
  duration: string
  status: JobStatus
  service: string
}

export const jobs: Job[] = [
  // o-aoyama
  { id: 'J-101', organizationId: 'o-aoyama', name: '日次 GMV 集計', schedule: '毎日 03:00 JST', lastRunAt: '2026-05-04 03:00', duration: '4m 12s', status: 'success', service: 'analytics-batch' },
  { id: 'J-102', organizationId: 'o-aoyama', name: '在庫スナップショット', schedule: '毎時 00分', lastRunAt: '2026-05-04 09:00', duration: '38s', status: 'success', service: 'inventory-batch' },
  { id: 'J-103', organizationId: 'o-aoyama', name: '検索インデックス再構築', schedule: '毎日 04:00 JST', lastRunAt: '2026-05-04 04:00', duration: '12m 04s', status: 'failed', service: 'search-indexer' },
  { id: 'J-104', organizationId: 'o-aoyama', name: 'メール配信キュー', schedule: '5 分毎', lastRunAt: '2026-05-04 09:35', duration: '6s', status: 'running', service: 'notification-worker' },
  { id: 'J-105', organizationId: 'o-aoyama', name: '請求バッチ', schedule: '月初 02:00 JST', lastRunAt: '2026-05-01 02:00', duration: '22m 18s', status: 'success', service: 'billing-job' },
  { id: 'J-106', organizationId: 'o-aoyama', name: 'データウェアハウス連携', schedule: '毎日 05:00 JST', lastRunAt: '2026-05-04 05:00', duration: '8m 41s', status: 'success', service: 'etl' },
  // o-kitazawa
  { id: 'J-201', organizationId: 'o-kitazawa', name: '日次 GMV 集計', schedule: '毎日 03:00 JST', lastRunAt: '2026-05-04 03:00', duration: '1m 48s', status: 'success', service: 'analytics-batch' },
  { id: 'J-202', organizationId: 'o-kitazawa', name: '在庫同期', schedule: '15 分毎', lastRunAt: '2026-05-04 09:30', duration: '12s', status: 'queued', service: 'inventory-sync' },
  { id: 'J-203', organizationId: 'o-kitazawa', name: 'メール配信キュー', schedule: '5 分毎', lastRunAt: '2026-05-04 09:35', duration: '4s', status: 'success', service: 'notification-worker' },
  // o-hanazono
  { id: 'J-301', organizationId: 'o-hanazono', name: '配送ルート最適化', schedule: '毎日 04:30 JST', lastRunAt: '2026-05-04 04:30', duration: '18m 22s', status: 'success', service: 'route-optimizer' },
  { id: 'J-302', organizationId: 'o-hanazono', name: '配送ステータス集計', schedule: '毎時 30分', lastRunAt: '2026-05-04 09:30', duration: '2m 06s', status: 'success', service: 'tracking-batch' },
  { id: 'J-303', organizationId: 'o-hanazono', name: 'ドライバー実績集計', schedule: '毎日 06:00 JST', lastRunAt: '2026-05-04 06:00', duration: '3m 41s', status: 'success', service: 'driver-batch' },
  { id: 'J-304', organizationId: 'o-hanazono', name: 'プッシュ通知配信', schedule: '5 分毎', lastRunAt: '2026-05-04 09:35', duration: '11s', status: 'running', service: 'notification-worker' },
  // o-mishima
  { id: 'J-401', organizationId: 'o-mishima', name: '日次受注集計', schedule: '毎日 03:00 JST', lastRunAt: '2026-05-04 03:00', duration: '14s', status: 'success', service: 'analytics-batch' },
  { id: 'J-402', organizationId: 'o-mishima', name: '印刷キュー監視', schedule: '10 分毎', lastRunAt: '2026-05-04 09:30', duration: '3s', status: 'success', service: 'print-monitor' },
]

export type AuditLog = {
  id: string
  organizationId: string
  actorId: string
  action: string
  target: string
  at: string
  ip: string
}

export const auditLog: AuditLog[] = [
  // o-aoyama
  { id: 'A-2001', organizationId: 'o-aoyama', actorId: 'u-yamada', action: 'metrics.update', target: '指標「GMV」のしきい値変更', at: '2026-05-04 09:42', ip: '10.0.12.34' },
  { id: 'A-2000', organizationId: 'o-aoyama', actorId: 'u-sato', action: 'members.invite', target: 'invite@example.com を viewer で招待', at: '2026-05-04 08:15', ip: '10.0.18.7' },
  { id: 'A-1999', organizationId: 'o-aoyama', actorId: 'u-suzuki', action: 'segments.create', target: 'セグメント「リピーター」を作成', at: '2026-05-04 07:48', ip: '10.0.12.99' },
  { id: 'A-1998', organizationId: 'o-aoyama', actorId: 'u-yamada', action: 'incidents.assign', target: 'INC-2841 を中村 翔 に割当', at: '2026-05-04 02:18', ip: '10.0.12.34' },
  { id: 'A-1997', organizationId: 'o-aoyama', actorId: 'u-tanaka', action: 'auth.login', target: 'SSO ログイン成功', at: '2026-05-04 01:50', ip: '10.0.20.41' },
  { id: 'A-1996', organizationId: 'o-aoyama', actorId: 'u-sato', action: 'settings.update', target: '通知ルール「高重要度のみ」を有効化', at: '2026-05-03 23:12', ip: '10.0.18.7' },
  { id: 'A-1995', organizationId: 'o-aoyama', actorId: 'u-nakamura', action: 'audit.export', target: '監査ログ 2026-04 を CSV エクスポート', at: '2026-05-03 22:30', ip: '10.0.16.88' },
  // o-kitazawa
  { id: 'A-3050', organizationId: 'o-kitazawa', actorId: 'u-watanabe', action: 'members.role_change', target: 'u-ito の権限を editor に変更', at: '2026-05-04 09:30', ip: '10.0.32.4' },
  { id: 'A-3049', organizationId: 'o-kitazawa', actorId: 'u-yamada', action: 'metrics.create', target: '指標「在庫回転率」を新規作成', at: '2026-05-04 09:10', ip: '10.0.12.34' },
  { id: 'A-3048', organizationId: 'o-kitazawa', actorId: 'u-ito', action: 'incidents.resolve', target: 'INC-1183 を解決済みにマーク', at: '2026-05-03 20:22', ip: '10.0.32.91' },
  // o-hanazono
  { id: 'A-4022', organizationId: 'o-hanazono', actorId: 'u-tanaka', action: 'settings.update', target: '配送ルート最適化の SLO を 20 分に変更', at: '2026-05-04 09:05', ip: '10.0.40.12' },
  { id: 'A-4021', organizationId: 'o-hanazono', actorId: 'u-ito', action: 'jobs.retry', target: 'route-optimizer の再実行', at: '2026-05-04 04:50', ip: '10.0.40.7' },
  { id: 'A-4020', organizationId: 'o-hanazono', actorId: 'u-kobayashi', action: 'segments.update', target: 'セグメント「優良顧客」を更新', at: '2026-05-03 18:42', ip: '10.0.40.55' },
  // o-mishima
  { id: 'A-5010', organizationId: 'o-mishima', actorId: 'u-kobayashi', action: 'auth.login', target: 'パスワードログイン成功', at: '2026-05-04 09:00', ip: '10.0.50.2' },
  { id: 'A-5009', organizationId: 'o-mishima', actorId: 'u-kobayashi', action: 'incidents.create', target: 'INC-0042 を作成', at: '2026-05-03 16:18', ip: '10.0.50.2' },
]

// =====================================================
// Segments per org
// =====================================================

export type Segment = {
  id: string
  organizationId: string
  name: string
  description: string
  userCount: number
  filterCount: number
  ownerId: string
  updatedAt: string
}

export const segments: Segment[] = [
  // o-aoyama
  { id: 'S-A001', organizationId: 'o-aoyama', name: 'リピーター（月次）', description: '直近30日に2回以上購入した顧客', userCount: 12420, filterCount: 3, ownerId: 'u-suzuki', updatedAt: '2026-05-04 07:48' },
  { id: 'S-A002', organizationId: 'o-aoyama', name: 'プレミアム会員', description: '年間利用額が 50万円以上', userCount: 845, filterCount: 2, ownerId: 'u-sato', updatedAt: '2026-04-28 12:30' },
  { id: 'S-A003', organizationId: 'o-aoyama', name: '休眠顧客（90日）', description: '90日以上アクティビティなし', userCount: 18260, filterCount: 4, ownerId: 'u-yamada', updatedAt: '2026-04-15 09:20' },
  { id: 'S-A004', organizationId: 'o-aoyama', name: '新規（直近7日）', description: '初回購入から7日以内', userCount: 1240, filterCount: 2, ownerId: 'u-tanaka', updatedAt: '2026-05-03 14:00' },
  { id: 'S-A005', organizationId: 'o-aoyama', name: '高エラー率セッション', description: '5xxを2回以上経験したセッション保有', userCount: 312, filterCount: 5, ownerId: 'u-nakamura', updatedAt: '2026-05-04 02:30' },
  // o-kitazawa
  { id: 'S-K001', organizationId: 'o-kitazawa', name: 'まとめ買い顧客', description: '1注文 1万円以上の顧客', userCount: 1840, filterCount: 2, ownerId: 'u-watanabe', updatedAt: '2026-05-02 11:00' },
  { id: 'S-K002', organizationId: 'o-kitazawa', name: '関西エリア', description: '配送先が大阪・京都・兵庫', userCount: 24100, filterCount: 3, ownerId: 'u-ito', updatedAt: '2026-04-28 18:45' },
  { id: 'S-K003', organizationId: 'o-kitazawa', name: '法人顧客', description: '法人アカウント所有', userCount: 320, filterCount: 1, ownerId: 'u-sato', updatedAt: '2026-04-20 10:20' },
  // o-hanazono
  { id: 'S-H001', organizationId: 'o-hanazono', name: '当日配送圏内', description: '営業所から30km圏内', userCount: 48200, filterCount: 4, ownerId: 'u-tanaka', updatedAt: '2026-05-03 09:30' },
  { id: 'S-H002', organizationId: 'o-hanazono', name: '冷凍商品取扱', description: '冷凍輸送オプション利用顧客', userCount: 6450, filterCount: 2, ownerId: 'u-ito', updatedAt: '2026-04-25 13:15' },
  { id: 'S-H003', organizationId: 'o-hanazono', name: '優良顧客', description: '月間配送件数 100件以上', userCount: 240, filterCount: 3, ownerId: 'u-kobayashi', updatedAt: '2026-05-03 18:42' },
  // o-mishima
  { id: 'S-M001', organizationId: 'o-mishima', name: '定期発注顧客', description: '月次の定期発注契約', userCount: 84, filterCount: 1, ownerId: 'u-kobayashi', updatedAt: '2026-04-30 11:00' },
]

// =====================================================
// Metrics catalog (per-org definitions)
// =====================================================

export type MetricDef = {
  id: string
  organizationId: string
  name: string
  category: 'business' | 'operations' | 'quality' | 'cost'
  description: string
  unit: string
  threshold: string
  currentValue: string
  trend: Trend
  delta: number
}

export const metricDefs: MetricDef[] = [
  // o-aoyama
  { id: 'M-A1', organizationId: 'o-aoyama', name: '流通総額 (GMV)', category: 'business', description: '確定取引総額。返金・キャンセルを除く。', unit: '¥', threshold: '前月比 -10% で警告', currentValue: '¥84.2M', trend: 'up', delta: 12.4 },
  { id: 'M-A2', organizationId: 'o-aoyama', name: '注文件数', category: 'business', description: '与信成立した注文件数', unit: '件', threshold: '前日比 -20% で警告', currentValue: '7,402', trend: 'up', delta: 4.7 },
  { id: 'M-A3', organizationId: 'o-aoyama', name: '5xx エラー率', category: 'quality', description: 'バックエンド 5xx の割合', unit: '%', threshold: '0.1% 超でオンコール', currentValue: '0.18%', trend: 'up', delta: 38.6 },
  { id: 'M-A4', organizationId: 'o-aoyama', name: 'p99 レイテンシ', category: 'operations', description: 'API レイテンシの99パーセンタイル', unit: 'ms', threshold: '800ms 超で警告', currentValue: '742ms', trend: 'up', delta: 8.4 },
  { id: 'M-A5', organizationId: 'o-aoyama', name: 'CAC (顧客獲得コスト)', category: 'cost', description: '新規顧客 1 件あたりの獲得コスト', unit: '¥', threshold: '¥3,000 超で警告', currentValue: '¥2,180', trend: 'down', delta: -4.2 },
  { id: 'M-A6', organizationId: 'o-aoyama', name: 'バウンス率', category: 'quality', description: '初回ページ離脱率', unit: '%', threshold: '40% 超で警告', currentValue: '32.1%', trend: 'flat', delta: 0.3 },
  // o-kitazawa
  { id: 'M-K1', organizationId: 'o-kitazawa', name: '流通総額 (GMV)', category: 'business', description: '確定取引総額。返金・キャンセルを除く。', unit: '¥', threshold: '前月比 -10% で警告', currentValue: '¥28.4M', trend: 'up', delta: 6.1 },
  { id: 'M-K2', organizationId: 'o-kitazawa', name: '在庫回転率', category: 'operations', description: '月間平均在庫日数', unit: '日', threshold: '14日 超で警告', currentValue: '11.2日', trend: 'down', delta: -3.4 },
  { id: 'M-K3', organizationId: 'o-kitazawa', name: '5xx エラー率', category: 'quality', description: 'バックエンド 5xx の割合', unit: '%', threshold: '0.1% 超でオンコール', currentValue: '0.04%', trend: 'down', delta: -12.0 },
  { id: 'M-K4', organizationId: 'o-kitazawa', name: '配送遅延率', category: 'operations', description: '予定配送時刻を超過した割合', unit: '%', threshold: '5% 超で警告', currentValue: '2.8%', trend: 'flat', delta: 0.0 },
  // o-hanazono
  { id: 'M-H1', organizationId: 'o-hanazono', name: '流通総額 (GMV)', category: 'business', description: '配送料収入の総額', unit: '¥', threshold: '前月比 -10% で警告', currentValue: '¥124.8M', trend: 'up', delta: 18.2 },
  { id: 'M-H2', organizationId: 'o-hanazono', name: '配送完了率', category: 'operations', description: '当日配送完了の割合', unit: '%', threshold: '95% 未満で警告', currentValue: '97.4%', trend: 'up', delta: 0.6 },
  { id: 'M-H3', organizationId: 'o-hanazono', name: 'ルート最適化所要時間', category: 'operations', description: 'バッチ全体の実行時間', unit: '分', threshold: '20分 超で警告', currentValue: '18m 22s', trend: 'flat', delta: 1.2 },
  { id: 'M-H4', organizationId: 'o-hanazono', name: 'ドライバー稼働率', category: 'business', description: '稼働中ドライバーの割合', unit: '%', threshold: '85% 未満で警告', currentValue: '89.1%', trend: 'up', delta: 1.8 },
  // o-mishima
  { id: 'M-M1', organizationId: 'o-mishima', name: '受注総額', category: 'business', description: '月次受注総額', unit: '¥', threshold: '前月比 -10% で警告', currentValue: '¥3.8M', trend: 'down', delta: -2.4 },
  { id: 'M-M2', organizationId: 'o-mishima', name: '印刷ジョブ成功率', category: 'quality', description: '印刷ジョブの完了率', unit: '%', threshold: '99% 未満で警告', currentValue: '99.7%', trend: 'flat', delta: 0.0 },
]
