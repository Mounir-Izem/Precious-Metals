import { trendColor, absFmt, fmt, sign, currencySymbol } from '../../utils/spotUtils.js';
import { useTranslation } from 'react-i18next'

const MetalCard = ({ metalName, varValue, varPercent, amPrice, pmPrice,
    intradayConverted, intradayPercent, currency, unit, hasPm, ratio }) => {
    
    // Gestion de la traduction des langues
    const { t } = useTranslation();

    // Pattern pour les styles css

    const styleGold = {
        className: "rounded-2xl p-4 mx-4 my-2 shadow-lg text-white",
        style: {
            background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(255,255,255,0.35) 0%, transparent 45%), linear-gradient(135deg, #FFE566 0%, #F0B429 25%, #B8860B 55%, #8B6508 100%)',
            boxShadow: '0 10px 40px rgba(184, 134, 11, 0.6), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.2)'
        },
        labelColor: 'text-white'
    };
    const styleSilver = {
        className: "rounded-2xl p-4 mx-4 my-2 shadow-lg text-gray-800",
        style: {
            background: 'radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.7) 0%, transparent 50%), linear-gradient(135deg, #FFFFFF 0%, #D8D8D8 25%, #A0A0A0 55%, #707070 100%)',
            boxShadow: '0 10px 40px rgba(100, 100, 100, 0.5), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(0,0,0,0.15)'
        },
        labelColor: 'text-gray-700'
    };
    const cardStyle = metalName === 'Gold' ? styleGold : styleSilver;

    return (
        <article className={cardStyle.className} style={cardStyle.style}>
            <div className="flex justify-between items-start">
                <h3 className='text-4xl font-black italic uppercase'>{t(`metals.${metalName.toLowerCase()}`)}</h3>
                <div className="text-right">
                    <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>{t('metalCard.variation')}</h3>
                    <p className={`${trendColor(varValue)} font-bold text-sm`}>
                        {sign(varValue)}{absFmt(varValue)}{currencySymbol[currency]} ✺ {sign(varPercent)}{absFmt(varPercent)}%
                    </p>
                </div>
            </div>
            <div className="flex gap-4 mt-3">
                <div className="flex-1">
                    <h3 className="text-xs uppercase opacity-70 font-semibold">{t('metalCard.amFixing')}</h3>
                    <p className="text-2xl font-bold">{fmt(amPrice)}</p>
                    <span className="text-xs opacity-70">{currencySymbol[currency]} / {unit}</span>
                </div>
                {hasPm && (
                    <div className="flex-1">
                        <p className="text-xs uppercase opacity-70 font-semibold">{t('metalCard.pmFixing')}</p>
                        <p className="text-2xl font-bold">{fmt(pmPrice)}</p>
                        <span className="text-xs opacity-70">{currencySymbol[currency]} / {unit}</span>
                    </div>
                )}
                {!hasPm && (
                    <div className="flex-1">
                        <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>Ratio</h3>
                        <p className="text-2xl font-bold">{ratio ?? '—'}</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mt-3">
                {hasPm && (
                    <div>
                        <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>Ratio</h3>
                        <p>{ratio ?? '—'}</p>
                    </div>
                )}
                {hasPm && (
                    <div className="text-right">
                        <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>{t('metalCard.intraday')}</h3>
                        <p className={`${trendColor(intradayConverted)} font-bold text-sm`}>
                            {sign(intradayConverted)}{absFmt(intradayConverted)}{currencySymbol[currency]}
                            ✺ {sign(intradayPercent)}{absFmt(intradayPercent)}%
                        </p>
                    </div>
                )}
            </div>
        </article>
    )
}

export default MetalCard;