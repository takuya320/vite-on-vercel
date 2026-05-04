import { useToast } from '@chakra-ui/react'
import PageHeader from '../components/PageHeader'
import { currentUserId, getMembership, ROLE_LABEL } from '../data'
import { useOrg } from '../orgContext'

export default function OrganizationsPage() {
  const toast = useToast()
  const { activeOrg, setActiveOrgId, userOrgs } = useOrg()

  function activate(orgId: string) {
    if (orgId === activeOrg.id) return
    const target = userOrgs.find((o) => o.id === orgId)
    setActiveOrgId(orgId)
    toast({
      title: `アクティブ組織を切り替えました`,
      description: target?.name,
      status: 'success',
      duration: 1600,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`組織別 / 管理対象 ${userOrgs.length} 件`}
        title="所属組織の一覧"
        subtitle="あなたが所属するすべての組織と、各組織での権限ロールが一覧できます。クリックでアクティブ組織を切り替え。"
      />

      <div className="dash-stat-row dash-reveal" data-i={1}>
        <div className="dash-stat">
          <div className="dash-stat__label">所属組織</div>
          <div className="dash-stat__value">{userOrgs.length}</div>
          <div className="dash-stat__sub">最大 N:N で紐付け可</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">合計メンバー数</div>
          <div className="dash-stat__value">{userOrgs.reduce((sum, o) => sum + o.memberCount, 0)}</div>
          <div className="dash-stat__sub">あなたの組織の総和</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">Enterprise</div>
          <div className="dash-stat__value">{userOrgs.filter((o) => o.plan === 'Enterprise').length}</div>
          <div className="dash-stat__sub">組織数</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">アクティブ</div>
          <div className="dash-stat__value" style={{ fontSize: 16 }}>
            {activeOrg.name}
          </div>
          <div className="dash-stat__sub">
            {activeOrg.region} / {activeOrg.industry}
          </div>
        </div>
      </div>

      <div className="dash-card dash-tablecard dash-reveal" data-i={2}>
        <div className="dash-card__head">
          <div>
            <h3 className="dash-card__title">所属組織</h3>
            <div className="dash-card__sub">N:N — 1ユーザーが複数組織に所属可</div>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>組織</th>
                <th>業界</th>
                <th>エリア</th>
                <th>プラン</th>
                <th>あなたのロール</th>
                <th>メンバー数</th>
                <th>所属開始</th>
              </tr>
            </thead>
            <tbody>
              {userOrgs.map((org) => {
                const ms = getMembership(currentUserId, org.id)!
                const isActive = org.id === activeOrg.id
                return (
                  <tr
                    key={org.id}
                    tabIndex={0}
                    onClick={() => activate(org.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), activate(org.id))}
                    style={isActive ? { background: 'var(--dash-bg)' } : undefined}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          aria-hidden
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: 'var(--dash-ink)',
                            color: 'var(--dash-bg)',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{org.name}</div>
                          <div className="dash-table__id" style={{ marginTop: 2 }}>
                            {org.slug}
                          </div>
                        </div>
                        {isActive && (
                          <span className="dash-meta-pill dash-meta-pill--accent" style={{ marginLeft: 4 }}>
                            アクティブ
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="dash-table__service">{org.industry}</span>
                    </td>
                    <td>
                      <span className="dash-table__service">{org.region}</span>
                    </td>
                    <td>
                      <span
                        className={`dash-meta-pill${org.plan === 'Enterprise' ? ' dash-meta-pill--accent' : org.plan === 'Standard' ? ' dash-meta-pill--teal' : ''}`}
                      >
                        {org.plan}
                      </span>
                    </td>
                    <td>
                      <span className="dash-meta-pill">{ROLE_LABEL[ms.role]}</span>
                    </td>
                    <td>
                      <span className="dash-table__service">{org.memberCount.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="dash-table__time">{ms.joinedAt}</span>
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
