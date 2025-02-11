import { createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ButtonTest from './features/button-test/ButtonTest.tsx'
import ComponentTest from './features/component-test/ComponentTest.tsx'
import TableTest from './features/table-test/TableTest.tsx'

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
    path: '/button-test',
    element: <ButtonTest />,
  },
  {
    path: '/',
    element: <App />,
  },
])
