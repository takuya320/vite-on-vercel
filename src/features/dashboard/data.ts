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

export const kpis: Kpi[] = [
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
]

export type ChartPoint = {
  label: string
  current: number
  previous: number
}

export const chartSeries: ChartPoint[] = [
  { label: '04/14', current: 4.2, previous: 3.8 },
  { label: '04/15', current: 4.6, previous: 4.0 },
  { label: '04/16', current: 4.9, previous: 4.4 },
  { label: '04/17', current: 5.2, previous: 4.8 },
  { label: '04/18', current: 4.8, previous: 5.0 },
  { label: '04/19', current: 5.6, previous: 5.1 },
  { label: '04/20', current: 6.1, previous: 5.4 },
  { label: '04/21', current: 5.9, previous: 5.6 },
  { label: '04/22', current: 6.4, previous: 5.9 },
  { label: '04/23', current: 6.8, previous: 6.0 },
  { label: '04/24', current: 7.1, previous: 6.3 },
  { label: '04/25', current: 7.4, previous: 6.5 },
  { label: '04/26', current: 7.0, previous: 6.7 },
  { label: '04/27', current: 7.6, previous: 6.9 },
  { label: '04/28', current: 8.1, previous: 7.0 },
  { label: '04/29', current: 8.4, previous: 7.3 },
  { label: '04/30', current: 8.0, previous: 7.5 },
  { label: '05/01', current: 8.6, previous: 7.6 },
  { label: '05/02', current: 9.1, previous: 7.9 },
  { label: '05/03', current: 9.4, previous: 8.0 },
]

export type RankingItem = {
  rank: number
  name: string
  meta: string
  value: string
  delta: number
}

export const ranking: RankingItem[] = [
  { rank: 1, name: 'Aoyama Holdings', meta: 'Enterprise / 東京', value: '¥18.4M', delta: 24.1 },
  { rank: 2, name: 'Kitazawa Foods', meta: 'Standard / 大阪', value: '¥12.9M', delta: 11.7 },
  { rank: 3, name: 'Hanazono Logistics', meta: 'Enterprise / 福岡', value: '¥9.6M', delta: 6.2 },
  { rank: 4, name: 'Sumiyoshi Brewing', meta: 'Standard / 京都', value: '¥7.2M', delta: -3.4 },
  { rank: 5, name: 'Mishima Print', meta: 'Lite / 静岡', value: '¥5.8M', delta: 18.9 },
  { rank: 6, name: 'Asakusa Textile', meta: 'Standard / 東京', value: '¥4.4M', delta: 2.1 },
]

export type IncidentStatus = 'open' | 'investigating' | 'mitigated' | 'resolved'

export type Incident = {
  id: string
  occurredAt: string
  service: string
  summary: string
  severity: 'P1' | 'P2' | 'P3'
  status: IncidentStatus
  owner: string
}

export const incidents: Incident[] = [
  {
    id: 'INC-2841',
    occurredAt: '2026-05-04 02:14',
    service: 'checkout-api',
    summary: '決済認可APIの p99 レイテンシが SLO を 12 分間超過',
    severity: 'P1',
    status: 'investigating',
    owner: '中村',
  },
  {
    id: 'INC-2840',
    occurredAt: '2026-05-04 00:51',
    service: 'search-indexer',
    summary: 'インデックス再構築ジョブが 3 回連続で失敗',
    severity: 'P2',
    status: 'mitigated',
    owner: '王',
  },
  {
    id: 'INC-2839',
    occurredAt: '2026-05-03 22:08',
    service: 'notification-worker',
    summary: 'Slack Webhook がレート制限に到達 / バックオフ動作中',
    severity: 'P3',
    status: 'open',
    owner: '佐々木',
  },
  {
    id: 'INC-2838',
    occurredAt: '2026-05-03 19:42',
    service: 'billing-job',
    summary: '請求バッチで 4 件の重複レコードを検知',
    severity: 'P2',
    status: 'resolved',
    owner: '李',
  },
  {
    id: 'INC-2837',
    occurredAt: '2026-05-03 17:20',
    service: 'auth-gateway',
    summary: 'リフレッシュトークンの検証エラーが 0.4% に上昇',
    severity: 'P3',
    status: 'resolved',
    owner: '中村',
  },
]
