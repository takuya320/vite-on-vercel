import { useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    toast({
      title: '検索を実行（モック）',
      description: `クエリ: ${q}`,
      status: 'info',
      duration: 1800,
      position: 'top-right',
    })
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <header className="dash-head">
      <div className="dash-head__crumb">
        <span>ワークスペース</span>
        <span className="dash-head__crumb-sep">/</span>
        <b>概要</b>
      </div>
      <form className="dash-head__search" onSubmit={submit} role="search">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          className="dash-head__search-input"
          placeholder="顧客・サービス・インシデントを検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="グローバル検索"
        />
        <kbd>⌘K</kbd>
      </form>
      <div className="dash-head__spacer" />
      <span className="dash-head__env" title="環境: 本番">
        <span className="dash-head__env-dot" /> PRODUCTION
      </span>
      <button
        className="dash-head__icon-btn"
        aria-label="通知 (3 件)"
        type="button"
        onClick={() =>
          toast({
            title: '通知が 3 件あります（モック）',
            description: 'P1 インシデント · 月次締めリマインド · デプロイ完了',
            status: 'warning',
            duration: 2400,
            isClosable: true,
            position: 'top-right',
          })
        }
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 7a4 4 0 1 1 8 0v3l1.5 2H2.5L4 10V7zM6 13a2 2 0 0 0 4 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="dash-head__icon-btn-dot" />
      </button>
      <button
        className="dash-head__user"
        type="button"
        onClick={() =>
          toast({
            title: 'アカウントメニュー（モック）',
            description: 'プロフィール · 環境切替 · ログアウト',
            status: 'info',
            duration: 1800,
            position: 'top-right',
          })
        }
      >
        <div className="dash-head__user-avatar">YT</div>
        <div>
          <div className="dash-head__user-name">山田 太郎</div>
          <div className="dash-head__user-role">管理者</div>
        </div>
      </button>
    </header>
  )
}
