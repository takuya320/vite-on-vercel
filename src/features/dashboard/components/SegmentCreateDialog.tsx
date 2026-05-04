import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useOrg } from '../orgContext'

const FIELDS: Array<{ id: string; label: string }> = [
  { id: 'last_login_days', label: '最終ログインからの日数' },
  { id: 'monthly_orders', label: '月間注文回数' },
  { id: 'monthly_gmv', label: '月間流通額' },
  { id: 'plan', label: 'プラン' },
  { id: 'region', label: 'エリア' },
  { id: 'login_count_30d', label: '直近30日のログイン回数' },
  { id: 'feature_x_used', label: '機能X 利用有無' },
  { id: 'session_duration', label: '平均セッション時間 (分)' },
]

const OPERATORS: Array<{ id: string; label: string }> = [
  { id: 'gte', label: '以上' },
  { id: 'lte', label: '以下' },
  { id: 'eq', label: '一致' },
  { id: 'neq', label: '不一致' },
  { id: 'in', label: '含む' },
  { id: 'not_in', label: '含まない' },
]

type Logic = 'and' | 'or'

type Rule = {
  id: number
  field: string
  operator: string
  value: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

const initialRules = (): Rule[] => [{ id: 1, field: 'last_login_days', operator: 'gte', value: '30' }]

export default function SegmentCreateDialog({ isOpen, onClose }: Props) {
  const toast = useToast()
  const { activeOrg } = useOrg()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logic, setLogic] = useState<Logic>('and')
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [nextId, setNextId] = useState(2)

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setDescription('')
      setLogic('and')
      setRules(initialRules())
      setNextId(2)
    }
  }, [isOpen])

  function addRule() {
    setRules((r) => [...r, { id: nextId, field: 'monthly_orders', operator: 'gte', value: '' }])
    setNextId((n) => n + 1)
  }

  function removeRule(id: number) {
    setRules((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r))
  }

  function updateRule(id: number, patch: Partial<Rule>) {
    setRules((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  // mock estimate based on rule count + name length (just to feel reactive)
  const estimated = useMemo(() => {
    const filledRules = rules.filter((r) => r.value.trim().length > 0).length
    return Math.max(40, 18000 - filledRules * 4200 - name.length * 80)
  }, [rules, name])

  function handleCreate() {
    toast({
      title: 'セグメントを作成しました',
      description: `${activeOrg.name} / ${name} · 条件 ${rules.length} 件 · 推定 ${estimated.toLocaleString()} 名`,
      status: 'success',
      duration: 2400,
      position: 'top-right',
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(24, 20, 16, 0.45)" backdropFilter="blur(2px)" />
      <ModalContent
        bg="#ffffff"
        color="#181410"
        borderRadius="12px"
        border="1px solid #d8cebd"
        boxShadow="0 30px 80px -20px rgba(24, 20, 16, 0.45)"
        fontFamily="'Plus Jakarta Sans', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif"
      >
        <ModalHeader pb={2}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.005em' }}>新規セグメントを作成</div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8c8275',
              marginTop: 4,
            }}
          >
            {activeOrg.name} / 条件を組み合わせて顧客グループを定義
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="dash-form-label" htmlFor="seg-name">
                セグメント名
              </label>
              <input
                id="seg-name"
                className="dash-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 優良顧客（プレミアム）"
                autoFocus
              />
            </div>

            <div>
              <label className="dash-form-label" htmlFor="seg-desc">
                説明（任意）
              </label>
              <textarea
                id="seg-desc"
                className="dash-form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="このセグメントの定義や利用目的を記述"
                rows={2}
              />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <label className="dash-form-label" style={{ marginBottom: 0 }}>
                  条件
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dash-form-hint">複数条件の結合</span>
                  <div className="dash-tabs" style={{ height: 26 }}>
                    {(['and', 'or'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        className={`dash-tab${logic === l ? ' dash-tab--active' : ''}`}
                        onClick={() => setLogic(l)}
                      >
                        {l === 'and' ? 'AND' : 'OR'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rules.map((r, idx) => (
                  <div key={r.id} className="dash-rule-row">
                    <span className="dash-rule-conn">{idx === 0 ? '' : logic === 'and' ? 'かつ' : 'または'}</span>
                    <select
                      className="dash-select"
                      value={r.field}
                      onChange={(e) => updateRule(r.id, { field: e.target.value })}
                      style={{ flex: 1.4, minWidth: 0 }}
                      aria-label="フィールド"
                    >
                      {FIELDS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="dash-select"
                      value={r.operator}
                      onChange={(e) => updateRule(r.id, { operator: e.target.value })}
                      style={{ flex: 1, minWidth: 0 }}
                      aria-label="演算子"
                    >
                      {OPERATORS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="dash-form-input"
                      value={r.value}
                      onChange={(e) => updateRule(r.id, { value: e.target.value })}
                      placeholder="値"
                      style={{ flex: 1, minWidth: 0, height: 32, padding: '0 10px' }}
                      aria-label="値"
                    />
                    <button
                      type="button"
                      className="dash-iconbtn"
                      onClick={() => removeRule(r.id)}
                      disabled={rules.length === 1}
                      aria-label="この条件を削除"
                      style={{ flexShrink: 0 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 3l6 6M3 9l6-6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="dash-btn dash-btn--ghost" onClick={addRule} style={{ marginTop: 10 }}>
                + 条件を追加
              </button>
            </div>

            <div className="dash-form-preview">
              <div>
                <div className="dash-form-preview__label">推定対象ユーザー</div>
                <div className="dash-form-preview__sub">条件確定時の概算（モック）</div>
              </div>
              <div className="dash-form-preview__count">
                {estimated.toLocaleString()}
                <span className="dash-form-preview__unit">名</span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter borderTop="1px solid #d8cebd" gap={2}>
          <button className="dash-btn" type="button" onClick={onClose}>
            キャンセル
          </button>
          <button
            className="dash-btn dash-btn--primary"
            type="button"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            セグメントを作成
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
