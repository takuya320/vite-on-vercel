import { createBrowserRouter } from 'react-router-dom'
import Dashboard from './features/dashboard/Dashboard.tsx'
import AuditPage from './features/dashboard/pages/AuditPage.tsx'
import IncidentsPage from './features/dashboard/pages/IncidentsPage.tsx'
import JobsPage from './features/dashboard/pages/JobsPage.tsx'
import MembersPage from './features/dashboard/pages/MembersPage.tsx'
import MetricsPage from './features/dashboard/pages/MetricsPage.tsx'
import OrganizationsPage from './features/dashboard/pages/OrganizationsPage.tsx'
import OverviewPage from './features/dashboard/pages/OverviewPage.tsx'
import SegmentsPage from './features/dashboard/pages/SegmentsPage.tsx'
import SettingsPage from './features/dashboard/pages/SettingsPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'metrics', element: <MetricsPage /> },
      { path: 'organizations', element: <OrganizationsPage /> },
      { path: 'segments', element: <SegmentsPage /> },
      { path: 'incidents', element: <IncidentsPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'audit', element: <AuditPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
