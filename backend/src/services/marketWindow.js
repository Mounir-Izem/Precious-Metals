

export const isMarketOpen= (now) => {
     const day = now.getUTCDay();
     const hour = now.getUTCHours();

    if (day === 5 && hour >= 22) {
        return false;
    }
    if (day === 6 || day === 0) {
        return false;
    }
    return true;
}

export const getSpotTtlMs = (now) => {
    if (isMarketOpen(now)) {
        return 5 * 60 * 1000; // 5 minutes in milliseconds
    }
    return 24* 60 * 60 * 1000; // 24 hours in milliseconds
} 