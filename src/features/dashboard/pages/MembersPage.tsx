import { useToast } from '@chakra-ui/react'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { currentUserId, getMembersOfOrg, PERMISSION_LABEL, ROLE_LABEL, type Membership, type User } from '../data'
import { useOrg } from '../orgContext'

const ROLE_PILL_CLS: Record<Membership['role'], string> = {
  owner: 'dash-meta-pill dash-meta-pill--accent',
  admin: 'dash-meta-pill dash-meta-pill--teal',
  editor: 'dash-meta-pill dash-meta-pill--positive',
  viewer: 'dash-meta-pill',
}

export default function MembersPage() {
  const toast = useToast()
  const { activeOrg } = useOrg()

  const members = useMemo(() => getMembersOfOrg(activeOrg.id), [activeOrg.id])
  const counts = useMemo(() => {
    const r: Record<Membership['role'], number> = { owner: 0, admin: 0, editor: 0, viewer: 0 }
    members.forEach((m) => (r[m.membership.role] += 1))
    return r
  }, [members])

  function open(member: { user: User; membership: Membership }) {
    toast({
      title: `${member.user.name} の権限詳細`,
      description: `${ROLE_LABEL[member.membership.role]} · ${member.membership.permissions.length} 件の権限`,
      status: 'info',
      duration: 2000,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`メンバー / ${activeOrg.name}`}
        title="メンバーと権限"
        subtitle="この組織のメンバーと、各メンバーに付与されたロール・権限。ユーザーは複数組織に所属できますが、権限は組織ごとに独立しています。"
        rightSlot={
          <button
            type="button"
            className="dash-btn dash-btn--primary"
            onClick={() =>
              toast({
                title: 'メンバー招待（モック）',
                description: `${activeOrg.name} へ招待リンクを発行します`,
                status: 'info',
                duration: 1600,
                position: 'top-right',
              })
            }
          >
            + メンバー招待
          </button>
        }
      />

      <div className="dash-stat-row dash-reveal" data-i={1}>
        <div className="dash-stat">
          <div className="dash-stat__label">合計メンバー</div>
          <div className="dash-stat__value">{members.length}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">オーナー</div>
          <div className="dash-stat__value">{counts.owner}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">管理者</div>
          <div className="dash-stat__value">{counts.admin}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">編集者</div>
          <div className="dash-stat__value">{counts.editor}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">閲覧者</div>
          <div className="dash-stat__value">{counts.viewer}</div>
        </div>
      </div>

      <div className="dash-card dash-tablecard dash-reveal" data-i={2}>
        <div className="dash-card__head">
          <div>
            <h3 className="dash-card__title">メンバー一覧</h3>
            <div className="dash-card__sub">この組織に所属する {members.length} 名</div>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ユーザー</th>
                <th>メール</th>
                <th>ロール</th>
                <th>付与された権限</th>
                <th>所属開始</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const isMe = m.user.id === currentUserId
                return (
                  <tr
                    key={m.user.id}
                    tabIndex={0}
                    onClick={() => open(m)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(m))}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          aria-hidden
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: 'var(--dash-ink)',
                            color: 'var(--dash-bg)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {m.user.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {m.user.name}
                            {isMe && (
                              <span className="dash-meta-pill dash-meta-pill--accent" style={{ marginLeft: 8 }}>
                                あなた
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="dash-table__id">{m.user.email}</span>
                    </td>
                    <td>
                      <span className={ROLE_PILL_CLS[m.membership.role]}>{ROLE_LABEL[m.membership.role]}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 380 }}>
                        {m.membership.permissions.map((p) => (
                          <span key={p} className="dash-perm-chip">
                            {PERMISSION_LABEL[p]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="dash-table__time">{m.membership.joinedAt}</span>
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
