import { BarChart2, DollarSign } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const BottomNav = () => {

    return (
        <nav className="flex justify-around items-center py-3 bg-white border-t border-gray-200 fixed bottom-0 w-full">
            <NavLink to="/" className="flex flex-col items-center gap-1">
                {({ isActive }) => (
                    <>
                        <div className={isActive ? "bg-yellow-700 rounded-2xl p-3" : "p-3"}>
                            <BarChart2 size={24} color={isActive ? "white" : "gray"} />
                        </div>
                        <span className={isActive ? "text-xs font-bold text-yellow-700" : "text-xs text-gray-400"}>SPOT</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/price-check" className="flex flex-col items-center gap-1">
                {({ isActive }) => (
                    <>
                        <div className={isActive ? "bg-yellow-700 rounded-2xl p-3" : "p-3"}>
                            <DollarSign size={24} color={isActive ? "white" : "gray"} />
                        </div>
                        <span className={isActive ? "text-xs font-bold text-yellow-700" : "text-xs text-gray-400"}>PRICE-CHECK</span>
                    </>
                )}
            </NavLink>
        </nav>
    )
}

export default BottomNav;