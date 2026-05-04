import { useToast } from '@chakra-ui/react'
import PageHeader from '../components/PageHeader'
import { currentUserId, getMembership, ROLE_LABEL } from '../data'
import { useOrg } from '../orgContext'

export default function SettingsPage() {
  const toast = useToast()
  const { activeOrg } = useOrg()
  const myMembership = getMembership(currentUserId, activeOrg.id)
  const canManage = myMembership?.permissions.includes('settings:manage') ?? false

  function notImpl() {
    toast({
      title: '設定変更はモックです',
      description: '本実装では各項目を編集できます',
      status: 'info',
      duration: 1500,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`設定 / ${activeOrg.name}`}
        title="組織設定"
        subtitle={
          canManage
            ? 'この組織の基本情報・ダッシュボード初期値の設定。設定は組織ごとに独立しています。'
            : `この組織での権限は「${ROLE_LABEL[myMembership?.role ?? 'viewer']}」のため、設定は閲覧のみ可能です。`
        }
      />

      <div className="dash-card dash-reveal" data-i={1} style={{ padding: 24 }}>
        <div className="dash-settings-grid">
          <div className="dash-settings-grid__heading">
            <h3>組織情報</h3>
            <p>組織の基本情報。slug は API・URL 内で組織を識別する一意なキーです。</p>
          </div>
          <div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">組織名</div>
                <div className="dash-settings-row__hint">表示用の名称</div>
              </div>
              <div className="dash-settings-row__value">{activeOrg.name}</div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">slug</div>
                <div className="dash-settings-row__hint">不変・URL 識別子</div>
              </div>
              <div className="dash-settings-row__value">{activeOrg.slug}</div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">プラン</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill dash-meta-pill--accent">{activeOrg.plan}</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">エリア / 業界</div>
              </div>
              <div className="dash-settings-row__value">
                {activeOrg.region} / {activeOrg.industry}
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">作成日</div>
              </div>
              <div className="dash-settings-row__value">{activeOrg.createdAt}</div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">メンバー数</div>
              </div>
              <div className="dash-settings-row__value">{activeOrg.memberCount}</div>
            </div>
          </div>
        </div>

        <div className="dash-settings-grid">
          <div className="dash-settings-grid__heading">
            <h3>ダッシュボード初期値</h3>
            <p>この組織を開いたときの既定の表示条件。メンバー全員に適用されます。</p>
          </div>
          <div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">既定の期間</div>
                <div className="dash-settings-row__hint">概要・指標ページで適用</div>
              </div>
              <div className="dash-settings-row__value">過去 30 日</div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">既定のプラン絞込</div>
              </div>
              <div className="dash-settings-row__value">全プラン</div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">監査ログ保持期間</div>
                <div className="dash-settings-row__hint">超過分は自動削除</div>
              </div>
              <div className="dash-settings-row__value">365 日</div>
            </div>
            <div className="dash-settings-row">
              <div></div>
              <div>
                <button className="dash-btn" type="button" onClick={notImpl}>
                  既定値を編集
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-settings-grid">
          <div className="dash-settings-grid__heading">
            <h3>危険な操作</h3>
            <p>取り返しのつかない操作。実行には別途オーナー権限が必要です。</p>
          </div>
          <div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">組織を削除</div>
                <div className="dash-settings-row__hint">関連する全データを完全に削除します</div>
              </div>
              <div>
                <button
                  className="dash-btn"
                  type="button"
                  style={{ borderColor: 'var(--dash-negative)', color: 'var(--dash-negative)' }}
                  onClick={notImpl}
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
