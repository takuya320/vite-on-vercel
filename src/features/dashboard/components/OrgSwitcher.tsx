import { useEffect, useRef, useState } from 'react'
import { currentUserId, getMembership, ROLE_LABEL } from '../data'
import { useOrg } from '../orgContext'

export default function OrgSwitcher() {
  const { activeOrg, setActiveOrgId, userOrgs } = useOrg()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const myMembership = getMembership(currentUserId, activeOrg.id)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="dash-orgswitch" ref={wrap}>
      <button
        type="button"
        className="dash-orgswitch__btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="dash-orgswitch__avatar" aria-hidden>
          {activeOrg.name.charAt(0)}
        </span>
        <div className="dash-orgswitch__text">
          <div className="dash-orgswitch__name">{activeOrg.name}</div>
          <div className="dash-orgswitch__sub">
            {ROLE_LABEL[myMembership?.role ?? 'viewer']} · {activeOrg.plan}
          </div>
        </div>
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            marginLeft: 4,
            opacity: 0.6,
            transform: open ? 'rotate(180deg)' : undefined,
            transition: 'transform 120ms ease',
          }}
        >
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="dash-orgswitch__menu" role="menu">
          <div className="dash-orgswitch__menu-label">所属組織 · {userOrgs.length} 件</div>
          {userOrgs.map((org) => {
            const ms = getMembership(currentUserId, org.id)
            const isActive = org.id === activeOrg.id
            return (
              <button
                key={org.id}
                type="button"
                role="menuitem"
                className={`dash-orgswitch__item${isActive ? ' dash-orgswitch__item--active' : ''}`}
                onClick={() => {
                  setActiveOrgId(org.id)
                  setOpen(false)
                }}
              >
                <span className="dash-orgswitch__avatar" aria-hidden>
                  {org.name.charAt(0)}
                </span>
                <div className="dash-orgswitch__text">
                  <div className="dash-orgswitch__name">{org.name}</div>
                  <div className="dash-orgswitch__sub">
                    {ROLE_LABEL[ms?.role ?? 'viewer']} · {org.plan} · {org.region}
                  </div>
                </div>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
