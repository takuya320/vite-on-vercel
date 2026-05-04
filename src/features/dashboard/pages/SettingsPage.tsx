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
            ? 'この組織の基本情報・通知・連携サービスの設定。設定は組織ごとに独立しています。'
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
            <h3>通知</h3>
            <p>しきい値超過・重大インシデント発生時の通知ルール。</p>
          </div>
          <div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">P1 インシデント通知</div>
                <div className="dash-settings-row__hint">Slack #ops-alert / 即時</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill dash-meta-pill--positive">有効</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">SLO 違反通知</div>
                <div className="dash-settings-row__hint">PagerDuty / 5 分超で発火</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill dash-meta-pill--positive">有効</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">日次サマリ</div>
                <div className="dash-settings-row__hint">毎朝 09:00 JST</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill">無効</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-settings-grid">
          <div className="dash-settings-grid__heading">
            <h3>連携サービス</h3>
            <p>外部サービスとの連携状態。組織単位で個別に設定できます。</p>
          </div>
          <div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">Slack</div>
                <div className="dash-settings-row__hint">通知・コマンド連携</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill dash-meta-pill--positive">接続済</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">PagerDuty</div>
                <div className="dash-settings-row__hint">オンコール</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill dash-meta-pill--positive">接続済</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">Datadog</div>
                <div className="dash-settings-row__hint">メトリクス送信</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill">未接続</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">Linear</div>
                <div className="dash-settings-row__hint">インシデント連動</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill">未接続</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-settings-grid">
          <div className="dash-settings-grid__heading">
            <h3>請求</h3>
            <p>プラン情報と次回請求予定。請求は組織単位で発行されます。</p>
          </div>
          <div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">現在のプラン</div>
              </div>
              <div className="dash-settings-row__value">
                <span className="dash-meta-pill dash-meta-pill--accent">{activeOrg.plan}</span>
              </div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">次回請求予定</div>
              </div>
              <div className="dash-settings-row__value">2026-06-01</div>
            </div>
            <div className="dash-settings-row">
              <div>
                <div className="dash-settings-row__label">支払い方法</div>
              </div>
              <div className="dash-settings-row__value">VISA •••• 4242</div>
            </div>
            <div className="dash-settings-row">
              <div></div>
              <div>
                <button className="dash-btn" type="button" onClick={notImpl}>
                  請求情報を編集
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
