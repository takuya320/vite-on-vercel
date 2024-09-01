import App from './App.tsx'
import ComponentTest from './features/component-test/ComponentTest.tsx'
import TableTest from './features/table-test/TableTest.tsx'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/component-test',
    element: <ComponentTest />,
  },
  {
    path: '/table-test',
    element: <TableTest />,
  },
  {
    path: '/',
    element: <App />,
  },
])
