const SpotSelectors = ({unit, currency, setUnit, setCurrency}) => {

    return (
        <main>
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                </select>
                <select value={unit} onChange={e => setUnit(e.target.value)}>
                    <option value="oz">oz</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                </select>
        </main>
    )
}

export default SpotSelectors;