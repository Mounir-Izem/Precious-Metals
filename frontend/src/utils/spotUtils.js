// ---fonctions unilitaires ---

// Changement de couleurs dynamique
export const trendColor = (value) => {
    if (value > 0) return 'text-green-700'
    if (value === 0) return 'text-gray-400'
    if (value < 0) return 'text-red-400'
    return ''
}

// limite 2 nombres décimales
export const absFmt = (value) => {
    return Number.isFinite(value) ? Math.abs(value).toFixed(2) : '-'
}
export const fmt = (value) => {
    return Number.isFinite(value) ? value.toFixed(2) : "-"
}

// Gestion du signe en préfixe
export const sign = (value) => {
    if (value > 0) return '+'
    if (value === 0) return '='
    if (value < 0) return '-'
    return ''
}

// Conversion oz => autre unité
export const convertUnit = (priceOz, unit) => {
    if (unit === 'g') return priceOz / 31.1035
    if (unit === 'kg') return (priceOz / 31.1035) * 1000
    return priceOz
}

// Conversion $ => autre devise
export const convertCurrency = (priceUsd, currency, eurRate, gbpRate) => {
    const eur = parseFloat(eurRate);
    const gbp = parseFloat(gbpRate);

    if (currency === 'EUR') {
        return Number.isNaN(eur) ? null : priceUsd / eur;
    }

    if (currency === 'GBP') {
        return Number.isNaN(gbp) ? null : priceUsd / gbp;
    }

    return priceUsd;
}

// Symboles des devises utilisées
export const currencySymbol = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
}

// Combinaison des conversions dynamique
export const convertPrice = (ozPriceUsd, unit, currency, eurRate, gbpRate) => {
    const parsed = parseFloat(ozPriceUsd)
    if (Number.isNaN(parsed)) return null

    const iUnit = convertUnit(parsed, unit)
    return convertCurrency(iUnit, currency, eurRate, gbpRate)
}