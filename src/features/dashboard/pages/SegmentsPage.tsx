import { useDisclosure, useToast } from '@chakra-ui/react'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import SegmentCreateDialog from '../components/SegmentCreateDialog'
import { segments } from '../data'
import { useOrg } from '../orgContext'

export default function SegmentsPage() {
  const toast = useToast()
  const { activeOrg } = useOrg()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const orgSegments = useMemo(() => segments.filter((s) => s.organizationId === activeOrg.id), [activeOrg.id])
  const totalUsers = orgSegments.reduce((sum, s) => sum + s.userCount, 0)

  function openSegment(name: string) {
    toast({
      title: `${name} の詳細を開きます（モック）`,
      status: 'info',
      duration: 1600,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`セグメント / ${activeOrg.name}`}
        title="顧客セグメント"
        subtitle="この組織内の分析・マーケティング向けセグメント。セグメントは組織ごとに独立し、他組織から参照できません。"
        rightSlot={
          <button type="button" className="dash-btn dash-btn--primary" onClick={onOpen}>
            + 新規セグメント
          </button>
        }
      />

      <div className="dash-stat-row dash-reveal" data-i={1}>
        <div className="dash-stat">
          <div className="dash-stat__label">セグメント数</div>
          <div className="dash-stat__value">{orgSegments.length}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">対象ユーザー総数</div>
          <div className="dash-stat__value">{totalUsers.toLocaleString()}</div>
          <div className="dash-stat__sub">重複を含む延べ数</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">最大セグメント</div>
          <div className="dash-stat__value" style={{ fontSize: 16 }}>
            {orgSegments.slice().sort((a, b) => b.userCount - a.userCount)[0]?.name ?? '—'}
          </div>
        </div>
      </div>

      <div className="dash-card dash-tablecard dash-reveal" data-i={2}>
        <div className="dash-card__head">
          <div>
            <h3 className="dash-card__title">セグメント一覧</h3>
            <div className="dash-card__sub">{activeOrg.name} 内のみ表示</div>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>説明</th>
                <th>対象ユーザー</th>
                <th>条件数</th>
                <th>更新</th>
              </tr>
            </thead>
            <tbody>
              {orgSegments.map((s) => (
                <tr
                  key={s.id}
                  tabIndex={0}
                  onClick={() => openSegment(s.name)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openSegment(s.name))}
                >
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="dash-table__id" style={{ marginTop: 2 }}>
                      {s.id}
                    </div>
                  </td>
                  <td>
                    <p className="dash-table__summary">{s.description}</p>
                  </td>
                  <td>
                    <span className="dash-table__service">{s.userCount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="dash-meta-pill">{s.filterCount}</span>
                  </td>
                  <td>
                    <span className="dash-table__time">{s.updatedAt}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SegmentCreateDialog isOpen={isOpen} onClose={onClose} />
    </>
  )
}
