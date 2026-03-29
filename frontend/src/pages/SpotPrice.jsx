import { trendColor, absFmt, fmt, sign, currencySymbol, convertPrice } from '../utils/spotUtils.js';
import { useState, useEffect, useMemo } from 'react';
import { getSpotData, getSpotVariation } from '../services/api.js';
import SpotSelectors from '../components/spot/Selectors.jsx'
import MetalCard from '../components/spot/MetalCard.jsx'
import { useSpot } from '../context/SpotContext.jsx'

const SpotPrice = () => {

    // Declaration des states
    const [displayData, setDisplayData] = useState([]);
    const [displayVar, setDisplayVar] = useState({});
    const [currency, setCurrency] = useState('USD');
    const [unit, setUnit] = useState('oz');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Appel api coté front
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

    // Utilisation de useMemo pour sécurisé le re-render
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

    // Consomation de la date du dernier fixing
    const { setFixingDate } = useSpot();

    useEffect(() => {
        if (spotData.goldFixingAm?.date) {
            setFixingDate(spotData.goldFixingAm.date);
        }
    }, [spotData]);

    // Affichage du loading et error
    if (loading) return <main><h1>Loading ...</h1></main>;
    if (error) return <main><h1>Error loading market data.</h1></main>;

    // Declaration des variables de protection re-render
    const { goldIntradayPercent, goldVarPercent, silverVarPercent } = spotData;
    const { goldAmPrice, goldPmPrice, silverPrice, goldVarValue, goldIntradayConverted, silverVarValue } = convertedPrices;



    return (
        <section className="pt-2">
            <SpotSelectors currency={currency} setCurrency={setCurrency} unit={unit} setUnit={setUnit} />
            <MetalCard
                metalName={'Gold'}
                varValue={goldVarValue}
                varPercent={goldVarPercent}
                unit={unit}
                currency={currency}
                amPrice={goldAmPrice}
                pmPrice={goldPmPrice}
                intradayConverted={goldIntradayConverted}
                intradayPercent={goldIntradayPercent}
                hasPm={true}
                ratio={null}
            />
            <MetalCard
                metalName={'Silver'}
                currency={currency}
                unit={unit}
                varValue={silverVarValue}
                varPercent={silverVarPercent}
                amPrice={silverPrice}
                hasPm={false}
                ratio={null}
            />
        </section>
    );
};

export default SpotPrice;