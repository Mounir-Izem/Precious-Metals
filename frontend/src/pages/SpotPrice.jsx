import { useState, useEffect, useMemo } from 'react';
import { convertPrice } from '../utils/spotUtils.js';
import { getSpotData } from '../services/api.js';
import SpotSelectors from '../components/spot/Selectors.jsx';
import MetalCard from '../components/spot/MetalCard.jsx';
import { useSpot } from '../context/SpotContext.jsx';

const SpotPrice = () => {
    const [data, setData] = useState(null);
    const [currency, setCurrency] = useState('USD');
    const [unit, setUnit] = useState('oz');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setFixingDate } = useSpot();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const spot = await getSpotData();
                if (!spot) throw new Error('No data');
                setData(spot);
                setFixingDate(spot.timestamp);
            } catch (err) {
                console.error('Error fetching spot:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const goldPrice = useMemo(() =>
        data ? convertPrice(data.gold.oz_usd, unit, currency, data.rates.EUR, data.rates.GBP) : null
    , [data, unit, currency]);

    const silverPrice = useMemo(() =>
        data ? convertPrice(data.silver.oz_usd, unit, currency, data.rates.EUR, data.rates.GBP) : null
    , [data, unit, currency]);

    const goldChange = useMemo(() =>
        data ? convertPrice(data.gold.change, unit, currency, data.rates.EUR, data.rates.GBP) : null
    , [data, unit, currency]);

    const silverChange = useMemo(() =>
        data ? convertPrice(data.silver.change, unit, currency, data.rates.EUR, data.rates.GBP) : null
    , [data, unit, currency]);

    const ratio = useMemo(() =>
        Number.isFinite(goldPrice) && Number.isFinite(silverPrice) && silverPrice !== 0
            ? (goldPrice / silverPrice).toFixed(2)
            : null
    , [goldPrice, silverPrice]);

    if (loading) return <main><h1>Loading ...</h1></main>;
    if (error) return <main><h1>Error loading market data.</h1></main>;

    return (
        <section className="pt-2">
            <SpotSelectors currency={currency} setCurrency={setCurrency} unit={unit} setUnit={setUnit} />
            <MetalCard
                metalName="Gold"
                price={goldPrice}
                change={goldChange}
                changePct={data?.gold.change_pct}
                currency={currency}
                unit={unit}
                ratio={ratio}
            />
            <MetalCard
                metalName="Silver"
                price={silverPrice}
                change={silverChange}
                changePct={data?.silver.change_pct}
                currency={currency}
                unit={unit}
                ratio={ratio}
            />
        </section>
    );
};

export default SpotPrice;
