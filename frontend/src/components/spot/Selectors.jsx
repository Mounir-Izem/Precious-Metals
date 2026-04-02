const SpotSelectors = ({ unit, currency, setUnit, setCurrency }) => {

    const activeClass = 'bg-yellow-700 text-white border-yellow-700 rounded-full px-3 py-1 text-sm transition-colors duration-150';
    const inactiveClass = 'border border-gray-600 text-gray-300 rounded-full px-3 py-1 text-sm transition-colors duration-150';


    return (
        <div className="flex justify-center items-center gap-2 px-4 py-2">
            <button
                className={currency === 'USD' ? activeClass : inactiveClass}
                onClick={() => setCurrency('USD')}>USD
            </button>
            <button
                className={currency === 'EUR' ? activeClass : inactiveClass}
                onClick={() => setCurrency('EUR')}>EUR
            </button>
            <button
                className={currency === 'GBP' ? activeClass : inactiveClass}
                onClick={() => setCurrency('GBP')}>GBP
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"/>
            <button
                className={unit === 'oz' ? activeClass : inactiveClass}
                onClick={() => setUnit('oz')}>oz
            </button>
            <button
                className={unit === 'g' ? activeClass : inactiveClass}
                onClick={() => setUnit('g')}>g
            </button>
            <button
                className={unit === 'kg' ? activeClass : inactiveClass}
                onClick={() => setUnit('kg')}>kg
            </button>
        </div>
    )
}

export default SpotSelectors;