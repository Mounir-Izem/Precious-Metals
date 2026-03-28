import { useSpot } from '../../context/SpotContext.jsx'


const TopBar = () => {
    
    const { fixingDate } = useSpot()

    return (
        <main>
            <h1>Precious Metals</h1>
            <div>
                {fixingDate ? new Date(fixingDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
            </div>
            <button>FR/EN</button>
        </main>
    )
}

export default TopBar;