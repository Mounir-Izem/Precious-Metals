import { useSpot } from '../../context/SpotContext.jsx'


const TopBar = () => {

    const { fixingDate } = useSpot()

    return (
        <header className="flex justify-between items-center px-4 py-3 bg-white">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">Precious Metals</h1>
                <p className="text-xs uppercase text-yellow-700">
                    {fixingDate ? new Date(fixingDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                </p>
            </div>
            <button className="border border-gray-400 rounded-full px-3 py-1 text-sm">FR/EN</button>
        </header>
    )
}

export default TopBar;