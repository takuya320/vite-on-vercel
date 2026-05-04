import { useToast } from '@chakra-ui/react'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { jobs, type Job, type JobStatus } from '../data'
import { useOrg } from '../orgContext'

const STATUS_LABEL: Record<JobStatus, string> = {
  success: '成功',
  failed: '失敗',
  running: '実行中',
  queued: '待機中',
}

const STATUS_CLS: Record<JobStatus, string> = {
  success: 'dash-badge dash-badge--resolved',
  failed: 'dash-badge dash-badge--p1',
  running: 'dash-badge dash-badge--investigating',
  queued: 'dash-badge dash-badge--p3',
}

export default function JobsPage() {
  const toast = useToast()
  const { activeOrg } = useOrg()

  const orgJobs = useMemo(() => jobs.filter((j) => j.organizationId === activeOrg.id), [activeOrg.id])
  const stats = useMemo(() => {
    const total = orgJobs.length
    const failed = orgJobs.filter((j) => j.status === 'failed').length
    const running = orgJobs.filter((j) => j.status === 'running').length
    const queued = orgJobs.filter((j) => j.status === 'queued').length
    return { total, failed, running, queued, success: total - failed - running - queued }
  }, [orgJobs])

  function retry(j: Job) {
    toast({
      title: `${j.name} を再実行（モック）`,
      description: `${j.service}`,
      status: 'info',
      duration: 1600,
      position: 'top-right',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow={`バックグラウンド / ${activeOrg.name}`}
        title="バックグラウンドジョブ"
        subtitle="この組織で稼働しているスケジュールジョブの実行状況。失敗時は再実行できます。"
      />

      <div className="dash-stat-row dash-reveal" data-i={1}>
        <div className="dash-stat">
          <div className="dash-stat__label">合計ジョブ</div>
          <div className="dash-stat__value">{stats.total}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">実行中</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-warn)' }}>
            {stats.running}
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">待機中</div>
          <div className="dash-stat__value">{stats.queued}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">直近失敗</div>
          <div className="dash-stat__value" style={{ color: 'var(--dash-negative)' }}>
            {stats.failed}
          </div>
        </div>
      </div>

      <div className="dash-card dash-tablecard dash-reveal" data-i={2}>
        <div className="dash-card__head">
          <div>
            <h3 className="dash-card__title">スケジュール</h3>
            <div className="dash-card__sub">cron / 定期実行</div>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ジョブ</th>
                <th>スケジュール</th>
                <th>サービス</th>
                <th>最終実行</th>
                <th>所要時間</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {orgJobs.map((j) => (
                <tr key={j.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{j.name}</div>
                    <div className="dash-table__id" style={{ marginTop: 2 }}>
                      {j.id}
                    </div>
                  </td>
                  <td>
                    <span className="dash-table__service">{j.schedule}</span>
                  </td>
                  <td>
                    <span className="dash-table__service">{j.service}</span>
                  </td>
                  <td>
                    <span className="dash-table__time">{j.lastRunAt}</span>
                  </td>
                  <td>
                    <span className="dash-table__service">{j.duration}</span>
                  </td>
                  <td>
                    <span className={STATUS_CLS[j.status]}>
                      <span className="dash-badge__dot" aria-hidden />
                      {STATUS_LABEL[j.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dash-btn dash-btn--ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        retry(j)
                      }}
                    >
                      再実行
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
