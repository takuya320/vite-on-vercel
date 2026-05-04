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
import { useEffect, useState } from 'react'
import { PERMISSION_LABEL, ROLE_DEFAULT_PERMISSIONS, ROLE_LABEL, type Permission, type Role } from '../data'
import { useOrg } from '../orgContext'

const ROLE_DESCRIPTION: Record<Role, string> = {
  owner: '組織のすべての操作が可能。請求権限を含む。',
  admin: 'メンバー管理・設定・運用すべてに権限。請求は除く。',
  editor: '指標・セグメント・介入の編集が可能。',
  viewer: 'データ閲覧のみ。編集不可。',
}

const ROLE_ORDER: Role[] = ['owner', 'admin', 'editor', 'viewer']

const ALL_PERMISSIONS: Permission[] = [
  'metrics:read',
  'metrics:write',
  'segments:manage',
  'incidents:manage',
  'audit:read',
  'members:manage',
  'settings:manage',
  'billing:manage',
]

type Props = {
  isOpen: boolean
  onClose: () => void
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export default function MemberInviteDialog({ isOpen, onClose }: Props) {
  const toast = useToast()
  const { activeOrg } = useOrg()

  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [role, setRole] = useState<Role>('admin')
  const [permissions, setPermissions] = useState<Permission[]>(ROLE_DEFAULT_PERMISSIONS.admin)
  const [message, setMessage] = useState('')
  const [permsTouched, setPermsTouched] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setEmails([])
      setEmailInput('')
      setRole('admin')
      setPermissions(ROLE_DEFAULT_PERMISSIONS.admin)
      setMessage('')
      setPermsTouched(false)
    }
  }, [isOpen])

  function changeRole(r: Role) {
    setRole(r)
    if (!permsTouched) {
      setPermissions(ROLE_DEFAULT_PERMISSIONS[r])
    }
  }

  function addEmail(text: string): boolean {
    const trimmed = text.trim().replace(/[,\s]+$/, '')
    if (!trimmed) return false
    if (!isValidEmail(trimmed)) {
      toast({
        title: '不正なメール形式',
        description: trimmed,
        status: 'error',
        duration: 1600,
        position: 'top-right',
      })
      return false
    }
    if (emails.includes(trimmed)) return false
    setEmails((e) => [...e, trimmed])
    return true
  }

  function removeEmail(email: string) {
    setEmails((e) => e.filter((x) => x !== email))
  }

  function handleEmailKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      if (emailInput.trim()) {
        e.preventDefault()
        if (addEmail(emailInput)) setEmailInput('')
      }
    } else if (e.key === 'Backspace' && emailInput === '' && emails.length > 0) {
      setEmails((arr) => arr.slice(0, -1))
    }
  }

  function handleEmailPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    if (/[,\s\n;]/.test(text)) {
      e.preventDefault()
      const tokens = text
        .split(/[,\s\n;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      tokens.forEach((t) => addEmail(t))
    }
  }

  function togglePermission(p: Permission) {
    setPermsTouched(true)
    setPermissions((perms) => (perms.includes(p) ? perms.filter((x) => x !== p) : [...perms, p]))
  }

  function resetPerms() {
    setPermsTouched(false)
    setPermissions(ROLE_DEFAULT_PERMISSIONS[role])
  }

  function submit() {
    let pending = emails
    const t = emailInput.trim()
    if (t) {
      if (!isValidEmail(t)) {
        toast({
          title: '宛先の最後のアドレスが不正',
          description: t,
          status: 'error',
          duration: 1600,
          position: 'top-right',
        })
        return
      }
      if (!emails.includes(t)) pending = [...emails, t]
    }
    if (pending.length === 0) {
      toast({
        title: '宛先メールアドレスを入力してください',
        status: 'error',
        duration: 1500,
        position: 'top-right',
      })
      return
    }
    toast({
      title: `${pending.length} 名へ招待を送信しました`,
      description: `${activeOrg.name} / ロール: ${ROLE_LABEL[role]} / 権限: ${permissions.length} 件`,
      status: 'success',
      duration: 2400,
      position: 'top-right',
    })
    onClose()
  }

  const defaultPermsForRole = ROLE_DEFAULT_PERMISSIONS[role]
  const isDefaultPerms =
    permissions.length === defaultPermsForRole.length &&
    defaultPermsForRole.every((p) => permissions.includes(p))

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
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.005em' }}>メンバーを招待</div>
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
            {activeOrg.name} / ロールと権限を指定して招待リンクを発行
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email chips */}
            <div>
              <label className="dash-form-label">招待先メールアドレス</label>
              <div
                className="dash-email-chips"
                onClick={(e) => {
                  const input = (e.currentTarget.querySelector('input') as HTMLInputElement | null)
                  input?.focus()
                }}
              >
                {emails.map((em) => (
                  <span key={em} className="dash-email-chip">
                    {em}
                    <button
                      type="button"
                      className="dash-email-chip__close"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeEmail(em)
                      }}
                      aria-label={`${em} を削除`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  className="dash-email-chips__input"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleEmailKey}
                  onPaste={handleEmailPaste}
                  onBlur={() => {
                    if (emailInput.trim() && addEmail(emailInput)) setEmailInput('')
                  }}
                  placeholder={emails.length === 0 ? 'name@example.com（カンマ・改行・Enter で複数追加）' : ''}
                  autoFocus
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="dash-form-label">ロール</label>
              <div className="dash-role-grid">
                {ROLE_ORDER.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`dash-role-card${role === r ? ' dash-role-card--active' : ''}`}
                    onClick={() => changeRole(r)}
                    aria-pressed={role === r}
                  >
                    <div className="dash-role-card__title">
                      <span className="dash-role-card__radio" aria-hidden />
                      <span>{ROLE_LABEL[r]}</span>
                    </div>
                    <div className="dash-role-card__desc">{ROLE_DESCRIPTION[r]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <label className="dash-form-label" style={{ marginBottom: 0 }}>
                  権限（個別に上書き可）
                </label>
                {permsTouched && !isDefaultPerms && (
                  <button
                    type="button"
                    className="dash-btn dash-btn--ghost"
                    onClick={resetPerms}
                    style={{ height: 22, padding: '0 8px', fontSize: 11 }}
                  >
                    {ROLE_LABEL[role]} の既定に戻す
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ALL_PERMISSIONS.map((p) => {
                  const on = permissions.includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`dash-perm-toggle${on ? ' dash-perm-toggle--on' : ''}`}
                      onClick={() => togglePermission(p)}
                      aria-pressed={on}
                    >
                      <span className="dash-perm-toggle__check" aria-hidden />
                      {PERMISSION_LABEL[p]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="dash-form-label" htmlFor="invite-msg">
                招待メッセージ（任意）
              </label>
              <textarea
                id="invite-msg"
                className="dash-form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="招待メールに含まれる一文。プロジェクトへの参加目的などを記述。"
                rows={2}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter borderTop="1px solid #d8cebd" gap={2}>
          <div style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8c8275' }}>
            {emails.length > 0 ? `${emails.length} 件の招待を送信予定` : ''}
          </div>
          <button className="dash-btn" type="button" onClick={onClose}>
            キャンセル
          </button>
          <button
            className="dash-btn dash-btn--primary"
            type="button"
            onClick={submit}
            disabled={emails.length === 0 && emailInput.trim() === ''}
          >
            招待を送信
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
