import { useToast } from '@chakra-ui/react'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { auditLog, users, type AuditLog } from '../data'
import { useOrg } from '../orgContext'

export default function AuditPage() {
  const toast = useToast()
  const { activeOrg } = useOrg()

  const orgLogs = useMemo(
    () => auditLog.filter((l) => l.organizationId === activeOrg.id).sort((a, b) => (a.at < b.at ? 1 : -1)),
    [activeOrg.id],
  )

  function open(l: AuditLog) {
    const actor = users.find((u) => u.id === l.actorId)
    toast({
      title: `${l.action}`,
      description: `${actor?.name ?? l.actorId} · ${l.target}`,
      status: 'info',
      duration: 2000,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`監査ログ / ${activeOrg.name}`}
        title="監査ログ"
        subtitle="この組織で実行された操作の記録。組織ごとに完全に分離されており、他組織からは参照できません。"
        rightSlot={
          <button
            type="button"
            className="dash-btn"
            onClick={() =>
              toast({
                title: '監査ログを CSV エクスポート（モック）',
                status: 'success',
                duration: 1500,
                position: 'top-right',
              })
            }
          >
            CSV 出力
          </button>
        }
      />

      <div className="dash-card dash-tablecard dash-reveal" data-i={1}>
        <div className="dash-card__head">
          <div>
            <h3 className="dash-card__title">操作履歴</h3>
            <div className="dash-card__sub">{orgLogs.length} 件 · 直近順</div>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>時刻</th>
                <th>実行者</th>
                <th>アクション</th>
                <th>対象</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {orgLogs.map((l) => {
                const actor = users.find((u) => u.id === l.actorId)
                return (
                  <tr
                    key={l.id}
                    tabIndex={0}
                    onClick={() => open(l)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(l))}
                  >
                    <td>
                      <span className="dash-table__time">{l.at}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          aria-hidden
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: 'var(--dash-bg-2)',
                            color: 'var(--dash-ink-2)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            border: '1px solid var(--dash-rule)',
                          }}
                        >
                          {actor?.initials ?? '?'}
                        </div>
                        <span className="dash-table__owner">{actor?.name ?? l.actorId}</span>
                      </div>
                    </td>
                    <td>
                      <code
                        className="dash-table__service"
                        style={{ background: 'var(--dash-bg-2)', padding: '2px 6px', borderRadius: 3 }}
                      >
                        {l.action}
                      </code>
                    </td>
                    <td>
                      <p className="dash-table__summary">{l.target}</p>
                    </td>
                    <td>
                      <span className="dash-table__id">{l.ip}</span>
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
