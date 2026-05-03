import { createBrowserRouter } from 'react-router-dom'
import ButtonTest from './features/button-test/ButtonTest.tsx'
import ComponentTest from './features/component-test/ComponentTest.tsx'
import Dashboard from './features/dashboard/Dashboard.tsx'
import TableTest from './features/table-test/TableTest.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/component-test',
    element: <ComponentTest />,
  },
  {
    path: '/table-test',
    element: <TableTest />,
  },
  {
    path: '/button-test',
    element: <ButtonTest />,
  },
])
