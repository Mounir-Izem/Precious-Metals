const SpotSelectors = ({ unit, currency, setUnit, setCurrency }) => {

    return (
        <div>
            <button
                className={currency === 'USD' ? 'style-actif' : 'style-inactif'}
                onClick={() => setCurrency('USD')}>USD
            </button>
            <button
                className={currency === 'EUR' ? 'style-actif' : 'style-inactif'}
                onClick={() => setCurrency('EUR')}>EUR
            </button>
            <button
                className={currency === 'GBP' ? 'style-actif' : 'style-inactif'}
                onClick={() => setCurrency('GBP')}>GBP
            </button>

            <button
                className={unit === 'oz' ? 'style-actif' : 'style-inactif'}
                onClick={() => setUnit('oz')}>oz
            </button>
            <button
                className={unit === 'g' ? 'style-actif' : 'style-inactif'}
                onClick={() => setUnit('g')}>g
            </button>
            <button
                className={unit === 'kg' ? 'style-actif' : 'style-inactif'}
                onClick={() => setUnit('kg')}>kg</button>
        </div>
    )
}

export default SpotSelectors;