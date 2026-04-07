import TopBar from './TopBar.jsx';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import Footer from './Footer.jsx';

const Layout = () => {
    return (
        <main className="bg-[#1c1c1e] pb-50">
            <TopBar />
            <Outlet />
            <BottomNav />
            <Footer />
        </main>
    )
}

export default Layout;