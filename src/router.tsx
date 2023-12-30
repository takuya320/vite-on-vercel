import App from './App.tsx'
import ComponentTest from './features/component-test/ComponentTest.tsx'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/component-test',
    element: <ComponentTest />,
  },
  {
    path: '/',
    element: <App />,
  },
])
