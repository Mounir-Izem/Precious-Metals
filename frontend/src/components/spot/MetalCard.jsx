import { trendColor, absFmt, fmt, sign, currencySymbol } from '../../utils/spotUtils.js';

const MetalCard = ({ metalName, varValue, varPercent, amPrice, pmPrice,
    intradayConverted, intradayPercent, currency, unit, hasPm }) => {
        
    return (
            <article>
                <div>
                    <span>Metal</span>
                    <h3>{metalName}</h3>
                </div>
                <div>
                    <h3>Day/Yesterday Variation</h3>
                    <p className={trendColor(varValue)}>
                        {sign(varValue)}{absFmt(varValue)}{currencySymbol[currency]} ✺ {sign(varPercent)}{absFmt(varPercent)}%
                    </p>
                </div>
                <div>
                    <h3>AM Fixing</h3>
                    <p>{fmt(amPrice)}</p>
                    <span>{currencySymbol[currency]} ✺ {unit}</span>
                </div>
                {hasPm && (<div>
                    <h3>PM Fixing</h3>
                    <p>{fmt(pmPrice)}</p>
                    <span>{currencySymbol[currency]} ✺ {unit}</span>
                </div>)}
                {hasPm &&(<div>
                    <h3>Intraday AM/PM</h3>
                    <p className={trendColor(intradayConverted)}>
                        {sign(intradayConverted)}{absFmt(intradayConverted)}{currencySymbol[currency]}
                        ✺ {sign(intradayPercent)}{absFmt(intradayPercent)}%
                    </p>
                </div>)}
            </article>
    )
}

export default MetalCard;