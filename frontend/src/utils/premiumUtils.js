export const calcMetalValue = (fineWeightG, spotPerG) => {
    if (!Number.isFinite(fineWeightG) || !Number.isFinite(spotPerG)) {
        return null
    }
    return fineWeightG * spotPerG;
};

export const calcSpotPerG = (pricePerOz) => {
    if (!Number.isFinite(pricePerOz) || pricePerOz <= 0) {
        return null
    }
    return pricePerOz / 31.1035;
};

export const calcPremiumValue = (askPrice, metalValue) => {
    if (!Number.isFinite(askPrice) || !Number.isFinite(metalValue)) {
        return null
    }
    return askPrice - metalValue
};

export const calcPremiumPercent = (premiumValue, metalValue) => {
    if (!Number.isFinite(premiumValue) || !Number.isFinite(metalValue) || metalValue === 0) {
        return null
    }
    return (premiumValue / metalValue) * 100
};