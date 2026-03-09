const parseCoinTitle = (title) => {
    const normalizedTitle = title.toLowerCase().trim();
    const tokens = normalizedTitle.split(' ');
    
    let year = tokens.find(token => {
        const num = Number(token);
        return num >= 1900 && num <= 2100;
    }) || null;
    
    const ozIndex = tokens.indexOf('oz');

    let weight = null;
    if (ozIndex > 0) {
        const weightToken = tokens[ozIndex - 1];
        if (!isNaN(weightToken)) {
            weight = `${weightToken} oz`;
        }
    }

    let coin = null;
    if (tokens.includes('maple') && tokens.includes('leaf')) {
        coin = 'maple leaf';
    }

    let metal = null;
    if (tokens.includes('silver')) {
        metal = 'silver';
    }

    return {
        rawTitle: title,
        normalizedTitle,
        tokens,
        coin,
        weight,
        metal,
        year
    }
}

module.exports = {
    parseCoinTitle
}