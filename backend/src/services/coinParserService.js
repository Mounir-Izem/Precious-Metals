const coinPatterns = require("../config/coinPatterns.json");
const metalPatterns = require("../config/metalPatterns.json");
const forbiddenPatterns = require("../config/forbiddenPatterns.json");

// Step 1 — Normalize title

const normalizeTitle = (title) => {
    return title
        .toLowerCase()
        .replace(/[-_/]/g, ' ')
        .replace(/(\d+)oz\b/g, '$1 oz')
        .replace(/\s+/g, ' ')
        .trim();
};

// Step 2 - Tokenize

const tokenize = (normalizedTitle) => normalizedTitle.split(' ');

// Step 3 - Extract basics signals (coin, metal, weight, year)

const extractCoin = (tokens) => {
    for (const coinPattern of coinPatterns) {
        for (const alias of coinPattern.aliases) {
            if (alias.every(word => tokens.includes(word))) {
                return coinPattern.name;
            }
        }
    }
    return null;
}

const extractMetal = (tokens) => {
    for (const metalPattern of metalPatterns) {
        for (const alias of metalPattern.aliases) {
            if (alias.every(word => tokens.includes(word))) {
                return metalPattern.name;
            }
        }
    }
    return null;
}

const extractWeight = (tokens) => {
    const ozIndex = tokens.indexOf('oz');

    if (ozIndex > 0) {
        const weightToken = tokens[ozIndex - 1];

        if (!isNaN(weightToken)) {
            return `${weightToken} oz`;
        }
    }

    return null;
}

const extractYear = (tokens) => {
    return tokens.find(token => {
        const num = Number(token);
        return num >= 1900 && num <= 2100;
    }) || null;
}

// Step 4 - Detect forbidden patterns

const detectPatterns = (tokens) => {
    return forbiddenPatterns.map(pattern => {
        const matchedWords = pattern.words.filter(word => tokens.includes(word));
        return matchedWords.length > 0 ? {
            type: pattern.type,
            severity: pattern.severity,
            matchedWords
        } : null;
    }).filter(Boolean);
}

// Step 5 - Classify status (rejected, accepted_non_standard, accepted_standard)

const classifyPatterns = (detectedPatterns) => {
    const rejectedPatterns = detectedPatterns.filter(
        pattern => pattern.severity === "hard_reject"
    );

    const nonStandardPatterns = detectedPatterns.filter(
        pattern => pattern.severity === "coin_non_standard"
    );

    const rejectedWords = rejectedPatterns.flatMap(
        pattern => pattern.matchedWords
    );

    const nonStandardWords = nonStandardPatterns.flatMap(
        pattern => pattern.matchedWords
    );

    let status = "accepted_standard";

    if (rejectedPatterns.length > 0) {
        status = "rejected";
    } else if (nonStandardPatterns.length > 0) {
        status = "accepted_non_standard";
    }

    return {
        status,
        rejectedPatterns,
        rejectedWords,
        nonStandardPatterns,
        nonStandardWords
    };
};



const parseCoinTitle = (title) => {

    const normalizedTitle = normalizeTitle(title);

    const tokens = tokenize(normalizedTitle);

    const coin = extractCoin(tokens);

    const metal = extractMetal(tokens);

    const weight = extractWeight(tokens);

    const year = extractYear(tokens);

    const detectedPatterns = detectPatterns(tokens);

    const { status,
        rejectedPatterns,
        rejectedWords,
        nonStandardPatterns,
        nonStandardWords
    } = classifyPatterns(detectedPatterns);

    return {
        rawTitle: title,
        normalizedTitle,
        tokens,
        coin,
        metal,
        weight,
        year,
        status,
        rejected: status === "rejected",
        rejectedPatterns,
        rejectedWords,
        nonStandardPatterns,
        nonStandardWords
    }
}

module.exports = {
    parseCoinTitle
}