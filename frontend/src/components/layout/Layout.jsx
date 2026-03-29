import TopBar from './TopBar.jsx';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import Footer from './Footer.jsx';
import { useState } from 'react';
import { SpotContext } from '../../context/SpotContext.jsx'

const Layout = () => {

    const  [fixingDate, setFixingDate] = useState(null) 

    return (
        <main className="bg-gray-100">
            <SpotContext.Provider value={{fixingDate, setFixingDate}}>
                <TopBar />
                <Outlet />
                <BottomNav />
                <Footer />
            </ SpotContext.Provider>
        </main>
    )
}

export default Layout;