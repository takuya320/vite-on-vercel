import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { currentUserId, getOrgsForUser, type Organization } from './data'

type OrgContextValue = {
  activeOrg: Organization
  setActiveOrgId: (id: string) => void
  userOrgs: Organization[]
}

const OrgContext = createContext<OrgContextValue | null>(null)

export function OrgProvider({ children }: { children: ReactNode }) {
  const userOrgs = useMemo(() => getOrgsForUser(currentUserId), [])
  const [activeOrgId, setActiveOrgId] = useState<string>(() => userOrgs[0]?.id ?? '')
  const activeOrg = userOrgs.find((o) => o.id === activeOrgId) ?? userOrgs[0]
  if (!activeOrg) throw new Error('Current user has no organizations')
  return <OrgContext.Provider value={{ activeOrg, setActiveOrgId, userOrgs }}>{children}</OrgContext.Provider>
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used inside <OrgProvider>')
  return ctx
}
