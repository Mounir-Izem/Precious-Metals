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
            background: 'radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.7) 0%, transparent 40%), radial-gradient(ellipse at 85% 85%, rgba(255,255,255,0.2) 0%, transparent 40%), linear-gradient(135deg, #FFE566 0%, #F0B429 25%, #B8860B 55%, #8B6508 100%)',
            boxShadow: '0 8px 24px rgba(184, 134, 11, 0.45), inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.25)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
        },
        labelColor: 'text-white',
        subLabelColor: 'text-white/70'
    };
    const styleSilver = {
        className: "rounded-2xl p-4 mx-4 my-2 shadow-lg text-gray-800",
        style: {
            background: 'radial-gradient(ellipse at 18% 12%, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.6) 15%, transparent 38%), linear-gradient(118deg, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.4) 48%, rgba(255,255,255,0.0) 66%), radial-gradient(ellipse at 80% 80%, rgba(200,215,225,0.3) 0%, transparent 40%), linear-gradient(135deg, #F0F4F8 0%, #B8C4CC 25%, #7A8A95 55%, #4E6070 100%)',
            boxShadow: '0 8px 28px rgba(70, 85, 95, 0.6), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(0,0,0,0.25)'
        },
        labelColor: 'text-gray-800',
        subLabelColor: 'text-gray-500'
    };
    const cardStyle = metalName === 'Gold' ? styleGold : styleSilver;

    return (
        <article className={cardStyle.className} style={cardStyle.style}>
            <div className="flex justify-between items-start">
                <h3 className='text-4xl italic uppercase'>{t(`metals.${metalName.toLowerCase()}`)}</h3>
                <div className="text-right">
                    <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>{t('metalCard.variation')}</h3>
                    <p className={`${trendColor(varValue)} font-bold text-sm bg-black/20 rounded-full px-2 py-0.5`}>
                        {sign(varValue)}{absFmt(varValue)}{currencySymbol[currency]} ✺ {sign(varPercent)}{absFmt(varPercent)}%
                    </p>
                </div>
            </div>
            <div className="flex gap-4 mt-3">
                <div className="flex-1">
                    <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>{t('metalCard.amFixing')}</h3>
                    <p className="text-2xl font-bold">{fmt(amPrice)}</p>
                    <span className={`text-xs ${cardStyle.subLabelColor}`}>{currencySymbol[currency]} / {unit}</span>
                </div>
                {hasPm && (
                    <div className="flex-1">
                        <p className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>{t('metalCard.pmFixing')}</p>
                        <p className="text-2xl font-bold">{fmt(pmPrice)}</p>
                        <span className={`text-xs ${cardStyle.subLabelColor}`}>{currencySymbol[currency]} / {unit}</span>
                    </div>
                )}
                {!hasPm && (
                    <div className="flex-1">
                        <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>Ratio Oz</h3>
                        <p className="text-2xl">
                            <span className="font-black">{ratio}</span> / 1
                        </p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mt-3">
                {hasPm && (
                    <div>
                        <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>Ratio Oz</h3>
                        <p>
                            <span className="font-black">1 /</span> {ratio}
                        </p>
                    </div>
                )}
                {hasPm && (
                    <div className="text-right">
                        <h3 className={`text-xs uppercase font-bold ${cardStyle.labelColor}`}>{t('metalCard.intraday')}</h3>
                        <p className={`${trendColor(intradayConverted)} font-bold text-sm bg-black/20 rounded-full px-2 py-0.5`}>
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