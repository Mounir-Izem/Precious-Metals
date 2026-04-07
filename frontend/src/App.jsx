import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout.jsx'
import SpotPrice from './pages/SpotPrice.jsx'
import { SpotContext } from './context/SpotContext.jsx'
import { getCachedSpotData } from './services/spotCache.js'
import './App.css'

const router = createBrowserRouter([{
   path: '/',
   element: <Layout />,
   children: [{
      index: true,
      element: <SpotPrice />
   }]
}])

function App() {
   const [spot, setSpot] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [language, setLanguage] = useState('fr');

   useEffect(() => {
      getCachedSpotData()
         .then(data => setSpot(data))
         .catch(err => setError(err))
         .finally(() => setLoading(false));
   }, []);

   return (
      <SpotContext.Provider value={{
         spot,
         loading,
         error,
         fixingDate: spot?.timestamp ?? null,
         language,
         setLanguage
      }}>
         <RouterProvider router={router} />
      </SpotContext.Provider>
   );
}

export default App
