import { useState, useMemo } from 'react';
import { convertPrice } from '../utils/spotUtils.js';
import SpotSelectors from '../components/spot/Selectors.jsx';
import MetalCard from '../components/spot/MetalCard.jsx';
import { useSpot } from '../context/SpotContext.jsx';

const SpotPrice = () => {
    const { spot, loading, error, language } = useSpot();
    const [currency, setCurrency] = useState('USD');
    const [unit, setUnit] = useState('oz');

    const goldPrice = useMemo(() =>
        spot ? convertPrice(spot.gold.oz_usd, unit, currency, spot.rates.EUR, spot.rates.GBP) : null
    , [spot, unit, currency]);

    const silverPrice = useMemo(() =>
        spot ? convertPrice(spot.silver.oz_usd, unit, currency, spot.rates.EUR, spot.rates.GBP) : null
    , [spot, unit, currency]);

    const goldChange = useMemo(() =>
        spot ? convertPrice(spot.gold.change, unit, currency, spot.rates.EUR, spot.rates.GBP) : null
    , [spot, unit, currency]);

    const silverChange = useMemo(() =>
        spot ? convertPrice(spot.silver.change, unit, currency, spot.rates.EUR, spot.rates.GBP) : null
    , [spot, unit, currency]);

    const ratio = useMemo(() =>
        Number.isFinite(goldPrice) && Number.isFinite(silverPrice) && silverPrice !== 0
            ? (goldPrice / silverPrice).toFixed(2)
            : null
    , [goldPrice, silverPrice]);

    if (loading) return <main><h1>Loading ...</h1></main>;
    if (error) return <main><h1>Error loading market data.</h1></main>;

    return (
        <section className="pt-2">
            {spot?.stale && (
                <div className="mx-4 mb-2 px-3 py-2 bg-yellow-900/40 border border-yellow-700 rounded-xl text-yellow-400 text-xs">
                    ⚠ Dernier spot connu — {new Date(spot.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB')}
                </div>
            )}
            <SpotSelectors currency={currency} setCurrency={setCurrency} unit={unit} setUnit={setUnit} />
            <MetalCard
                metalName="Gold"
                price={goldPrice}
                change={goldChange}
                changePct={spot?.gold.change_pct}
                currency={currency}
                unit={unit}
                ratio={ratio}
            />
            <MetalCard
                metalName="Silver"
                price={silverPrice}
                change={silverChange}
                changePct={spot?.silver.change_pct}
                currency={currency}
                unit={unit}
                ratio={ratio}
            />
        </section>
    );
};

export default SpotPrice;
