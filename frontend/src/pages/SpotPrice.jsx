import { trendColor, absFmt, fmt, sign, currencySymbol, convertPrice } from '../utils/spotUtils.js';
import { useState, useEffect, useMemo } from 'react';
import { getSpotData, getSpotVariation } from '../services/api.js';

const SpotPrice = () => {

    const [displayData, setDisplayData] = useState([]);
    const [displayVar, setDisplayVar] = useState({});
    const [currency, setCurrency] = useState('USD');
    const [unit, setUnit] = useState('oz');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [data, dataVar] = await Promise.all([
                    getSpotData(),
                    getSpotVariation()
                ]);

                if (!data || !dataVar) throw new Error("Invalid data");

                setDisplayData(data);
                setDisplayVar(dataVar);

            } catch (error) {
                console.error('error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const spotData = useMemo(() => {
        const goldFixingAm = displayData.find(n => n.metal === 'gold' && n.fixing === 'AM');
        const goldFixingPm = displayData.find(n => n.metal === 'gold' && n.fixing === 'PM');
        const silverFixing = displayData.find(n => n.metal === 'silver' && n.fixing === 'NOON');
        const goldAmUsd = parseFloat(goldFixingAm?.oz_price_usd);
        const goldPmUsd = parseFloat(goldFixingPm?.oz_price_usd);
        const goldIntradayValue = Number.isFinite(goldAmUsd) && Number.isFinite(goldPmUsd)
            ? goldPmUsd - goldAmUsd : null;
        const goldIntradayPercent = Number.isFinite(goldAmUsd) && Number.isFinite(goldPmUsd) && goldAmUsd !== 0
            ? (goldPmUsd - goldAmUsd) / goldAmUsd * 100 : null;
        const goldVarPercent = parseFloat(displayVar.gold?.variationPercent);
        const silverVarPercent = parseFloat(displayVar.silver?.variationPercent);

        return {
            goldFixingAm, goldFixingPm, silverFixing,
            goldAmUsd, goldPmUsd,
            goldIntradayValue, goldIntradayPercent,
            goldVarPercent, silverVarPercent
        };
    }, [displayData, displayVar]);

    const convertedPrices = useMemo(() => {
        const { goldFixingAm, goldFixingPm, silverFixing, goldIntradayValue } = spotData;

        return {
            goldAmPrice: convertPrice(goldFixingAm?.oz_price_usd, unit, currency, goldFixingAm?.eur_usd_rate, goldFixingAm?.gbp_usd_rate),
            goldPmPrice: convertPrice(goldFixingPm?.oz_price_usd, unit, currency, goldFixingPm?.eur_usd_rate, goldFixingPm?.gbp_usd_rate),
            silverPrice: convertPrice(silverFixing?.oz_price_usd, unit, currency, silverFixing?.eur_usd_rate, silverFixing?.gbp_usd_rate),
            goldVarValue: convertPrice(displayVar.gold?.variationValue, unit, currency, goldFixingPm?.eur_usd_rate, goldFixingPm?.gbp_usd_rate),
            goldIntradayConverted: convertPrice(goldIntradayValue, unit, currency, goldFixingPm?.eur_usd_rate, goldFixingPm?.gbp_usd_rate),
            silverVarValue: convertPrice(displayVar.silver?.variationValue, unit, currency, silverFixing?.eur_usd_rate, silverFixing?.gbp_usd_rate),
        };
    }, [displayData, displayVar, currency, unit, spotData]);

    if (loading) return <main><h1>Loading ...</h1></main>;
    if (error) return <main><h1>Error loading market data.</h1></main>;

    const { goldIntradayPercent, goldVarPercent, silverVarPercent } = spotData;
    const { goldAmPrice, goldPmPrice, silverPrice, goldVarValue, goldIntradayConverted, silverVarValue } = convertedPrices;

    return (
        <main>
            <h1>Gold & Silver Spot Prices</h1>
            <p>Clean market snapshot with AM and PM fixing, daily variation, and quick unit/currency controls.</p>
            <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()}</time>
            <div>
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
            </div>
            <article>
                <div>
                    <span>Metal</span>
                    <h3>Gold</h3>
                </div>
                <div>
                    <h3>Day/Yesterday Variation</h3>
                    <p className={trendColor(goldVarValue)}>
                        {sign(goldVarValue)}{absFmt(goldVarValue)}{currencySymbol[currency]} ✺ {sign(goldVarPercent)}{absFmt(goldVarPercent)}%
                    </p>
                </div>
                <div>
                    <h3>AM Fixing</h3>
                    <p>{fmt(goldAmPrice)}</p>
                    <span>{currencySymbol[currency]} ✺ {unit}</span>
                </div>
                <div>
                    <h3>PM Fixing</h3>
                    <p>{fmt(goldPmPrice)}</p>
                    <span>{currencySymbol[currency]} ✺ {unit}</span>
                </div>
                <div>
                    <h3>Intraday AM/PM</h3>
                    <p className={trendColor(goldIntradayConverted)}>
                        {sign(goldIntradayConverted)}{absFmt(goldIntradayConverted)}{currencySymbol[currency]}
                        ✺ {sign(goldIntradayPercent)}{absFmt(goldIntradayPercent)}%
                    </p>
                </div>
            </article>
            <article>
                <div>
                    <span>Metal</span>
                    <h3>Silver</h3>
                </div>
                <div>
                    <h3>Day/Yesterday Variation</h3>
                    <p className={trendColor(silverVarValue)}>
                        {sign(silverVarValue)}{absFmt(silverVarValue)}{currencySymbol[currency]} ✺ {sign(silverVarPercent)}{absFmt(silverVarPercent)}%
                    </p>
                </div>
                <div>
                    <h3>Fixing</h3>
                    <p>{fmt(silverPrice)}</p>
                    <span>{currencySymbol[currency]} ✺ {unit}</span>
                </div>
            </article>
        </main>
    );
};

export default SpotPrice;