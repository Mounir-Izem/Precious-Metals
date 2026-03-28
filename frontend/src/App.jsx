import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import './App.css'
import SpotPrice from './pages/SpotPrice.jsx'

const router = createBrowserRouter ([{
   path: '/',
   element: <Layout />,
   children: [{
      index: true,
      element: <SpotPrice />
   }]
}])



function App() {
   return < RouterProvider router={router} />
}


export default App
