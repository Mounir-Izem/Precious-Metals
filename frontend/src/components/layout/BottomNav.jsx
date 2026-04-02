import { BarChart2, DollarSign } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const BottomNav = () => {

    return (
        <nav className="flex justify-around items-center py-3 bg-[#1c1c1e] border-t border-gray-800 fixed bottom-0 w-full">
            <NavLink to="/" className="flex flex-col items-center gap-1">
                {({ isActive }) => (
                    <>
                        <div className={`transition-all duration-200 rounded-2xl p-3 ${isActive ? "bg-yellow-700" : ""}`}>
                            <BarChart2 size={24} color={isActive ? "white" : "gray"} />
                        </div>
                        <span className={`text-xs transition-colors duration-200 ${isActive ? "font-bold text-yellow-700" : "text-gray-400"}`}>SPOT</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/price-check" className="flex flex-col items-center gap-1">
                {({ isActive }) => (
                    <>
                        <div className={`transition-all duration-200 rounded-2xl p-3 ${isActive ? "bg-yellow-700" : ""}`}>
                            <DollarSign size={24} color={isActive ? "white" : "gray"} />
                        </div>
                        <span className={`text-xs transition-colors duration-200 ${isActive ? "font-bold text-yellow-700" : "text-gray-400"}`}>PRICE-CHECK</span>
                    </>
                )}
            </NavLink>
        </nav>
    )
}

export default BottomNav;