import { useSpot } from '../../context/SpotContext.jsx';
import i18n from '../../i18n/i18n.js'


const TopBar = () => {

    const { fixingDate, language, setLanguage } = useSpot()

    return (
        <header className="flex justify-between items-center px-4 py-3 bg-[#1c1c1e]">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">Precious Metals</h1>
                <p className="text-xs uppercase text-yellow-500">
                    {fixingDate ? new Date(fixingDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => { i18n.changeLanguage('fr'); setLanguage('fr'); }}
                    className={`rounded-full px-3 py-1 text-sm transition-colors duration-150 ${language === 'fr' ? 'border-2 border-yellow-700' : 'border border-gray-600'}`}
                    aria-label="Français">
                    <img src="/flags/fr.svg" alt="Français" className="w-6 h-4" />
                </button>
                <button
                    onClick={() => { i18n.changeLanguage('en'); setLanguage('en'); }}
                    className={`rounded-full px-3 py-1 text-sm transition-colors duration-150 ${language === 'en' ? 'border-2 border-yellow-700' : 'border border-gray-600'}`}
                    aria-label="English">
                    <img src="/flags/gb.svg" alt="English" className="w-6 h-4" />
                </button>
            </div>
        </header>
    )
}

export default TopBar;