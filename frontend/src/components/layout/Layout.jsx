import TopBar from './TopBar.jsx';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import Footer from './Footer.jsx';
import { useState } from 'react';
import { SpotContext } from '../../context/SpotContext.jsx'

const Layout = () => {

    const  [fixingDate, setFixingDate] = useState(null);
    const [language, setLanguage] = useState('fr');

    return (
        <main className="bg-[#1c1c1e] pb-50">
            <SpotContext.Provider value={{fixingDate, setFixingDate, language, setLanguage}}>
                <TopBar />
                <Outlet />
                <BottomNav />
                <Footer />
            </ SpotContext.Provider>
        </main>
    )
}

export default Layout;